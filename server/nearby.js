var activeUsers = new Map();  // socketId → { lat, lng, vibe, name, since }
var blockedMap  = new Map();  // socketId → Set<blockedSocketId>
var reportMap   = new Map();  // socketId → { count, firstAt }

var R_MILES = 3958.8;

function haversine(lat1, lng1, lat2, lng2) {
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 1° cells ≈ 69mi — good enough for socket room grouping
function getTile(lat, lng) {
  return Math.floor(lat) + '_' + Math.floor(lng);
}

// ±0.5km (~0.31mi) jitter
function fuzz(coord) {
  return coord + (Math.random() * 0.009 - 0.0045);
}

// ── Matching algorithm ────────────────────────────────────────
// Compatible vibe pairs (asymmetric is fine; checked both ways)
var VIBE_COMPAT = {
  coffee: ['coffee', 'talk', 'chill'],
  walk:   ['walk',   'chill'],
  chill:  ['chill',  'walk', 'coffee'],
  food:   ['food',   'talk'],
  talk:   ['talk',   'coffee', 'food'],
  study:  ['study'],
};

// 0-20 pts for vibe affinity
function vibeScore(myVibe, theirVibe) {
  if (myVibe === theirVibe) return 20;
  var compat = VIBE_COMPAT[myVibe] || [];
  return compat.indexOf(theirVibe) !== -1 ? 10 : 0;
}

// 0-80 pts for proximity (0 mi → 80, 3 mi → 0)
function distScore(miles) {
  return Math.max(0, Math.round(80 * (1 - miles / 3)));
}

// ─────────────────────────────────────────────────────────────

function goLive(socketId, data) {
  activeUsers.set(socketId, {
    lat:   fuzz(data.lat),
    lng:   fuzz(data.lng),
    vibe:  data.vibe  || 'chill',
    name:  data.name  || 'Someone',
    since: Date.now(),
  });
  return getTile(data.lat, data.lng);
}

function goOffline(socketId) {
  activeUsers.delete(socketId);
}

// Returns nearby users sorted by match score (distance + vibe affinity)
function getMatches(socketId, radiusMiles) {
  var me = activeUsers.get(socketId);
  if (!me) return [];

  var myBlocked = blockedMap.get(socketId) || new Set();
  var results   = [];

  activeUsers.forEach(function(user, id) {
    if (id === socketId) return;
    if (myBlocked.has(id)) return;

    var dist = haversine(me.lat, me.lng, user.lat, user.lng);
    if (dist <= (radiusMiles || 3)) {
      results.push({
        id,
        name:       user.name,
        vibe:       user.vibe,
        distMiles:  Math.round(dist * 10) / 10,
        matchScore: distScore(dist) + vibeScore(me.vibe, user.vibe),
        since:      user.since,
      });
    }
  });

  // best match first
  results.sort(function(a, b) { return b.matchScore - a.matchScore; });
  return results;
}

function getUser(socketId) {
  return activeUsers.get(socketId) || null;
}

function blockUser(socketId, targetId) {
  if (!blockedMap.has(socketId)) blockedMap.set(socketId, new Set());
  blockedMap.get(socketId).add(targetId);
}

function isBlocked(byId, targetId) {
  var set = blockedMap.get(byId);
  return !!(set && set.has(targetId));
}

// Returns new report count for the target. Resets after 24h.
function report(targetId) {
  var now = Date.now();
  var entry = reportMap.get(targetId);
  if (!entry || now - entry.firstAt > 86400000) {
    reportMap.set(targetId, { count: 1, firstAt: now });
    return 1;
  }
  entry.count++;
  return entry.count;
}

function activeCount() {
  return activeUsers.size;
}

module.exports = { goLive, goOffline, getMatches, getUser, getTile, blockUser, isBlocked, report, activeCount };
