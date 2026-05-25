var activeUsers = new Map();

function haversine(lat1, lng1, lat2, lng2) {
  var R = 3958.8; // miles
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Simple geohash-like tile key (1-degree cells ≈ ~69mi — good enough for room grouping)
function getTile(lat, lng) {
  return Math.floor(lat) + '_' + Math.floor(lng);
}

function fuzz(coord) {
  return coord + (Math.random() * 0.004 - 0.002); // ~200m jitter
}

function goLive(socketId, data) {
  activeUsers.set(socketId, {
    lat: fuzz(data.lat),
    lng: fuzz(data.lng),
    vibe: data.vibe || 'just chill',
    name: data.name || 'Someone',
    since: Date.now(),
  });
  return getTile(data.lat, data.lng);
}

function goOffline(socketId) {
  activeUsers.delete(socketId);
}

function getNearby(socketId, radiusMiles) {
  var me = activeUsers.get(socketId);
  if (!me) return [];
  var results = [];
  activeUsers.forEach(function(user, id) {
    if (id === socketId) return;
    var dist = haversine(me.lat, me.lng, user.lat, user.lng);
    if (dist <= (radiusMiles || 3)) {
      results.push({
        id: id,
        vibe: user.vibe,
        name: user.name,
        distMiles: Math.round(dist * 10) / 10,
        since: user.since,
      });
    }
  });
  results.sort(function(a, b) { return a.distMiles - b.distMiles; });
  return results;
}

function getUser(socketId) {
  return activeUsers.get(socketId) || null;
}

function getGeohash(socketId) {
  var u = activeUsers.get(socketId);
  return u ? getTile(u.lat, u.lng) : null;
}

module.exports = { goLive, goOffline, getNearby, getUser, getGeohash };
