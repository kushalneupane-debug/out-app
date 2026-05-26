var express = require('express');
var http    = require('http');
var { Server } = require('socket.io');
var cors    = require('cors');
var { goLive, goOffline, getMatches, getUser, getTile, blockUser, isBlocked, report, activeCount } = require('./nearby');

var app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

var server = http.createServer(app);
var io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingInterval: 25000,
  pingTimeout:  60000,
});

var pendingConnects  = new Map();  // reqId → { from, to, reqId }
var activeChats      = new Map();  // chatId → { userA, userB }
var socketToTile     = new Map();  // socketId → tile key
var connectRateMap   = new Map();  // socketId → { count, reset }

// ─── Rate limiter (5 connect requests per 60s per socket) ────────────────────
function rateOk(socketId) {
  var now = Date.now();
  var entry = connectRateMap.get(socketId);
  if (!entry || now > entry.reset) {
    connectRateMap.set(socketId, { count: 1, reset: now + 60000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// ─── Socket events ────────────────────────────────────────────────────────────
io.on('connection', function(socket) {
  console.log('+ connected:', socket.id);

  socket.on('go_live', function(data) {
    var tile = goLive(socket.id, data);
    socketToTile.set(socket.id, tile);
    socket.join('geo:' + tile);

    // convert km → miles for the matching radius
    var radiusMi = ((data.radiusKm || 5) * 0.621371);
    var matches = getMatches(socket.id, radiusMi);
    socket.emit('match_list', matches);
    socket.to('geo:' + tile).emit('nearby_changed');
  });

  socket.on('refresh_nearby', function(data) {
    var radiusMi = (((data && data.radiusKm) || 5) * 0.621371);
    var matches = getMatches(socket.id, radiusMi);
    socket.emit('match_list', matches);
  });

  // Connect request (replaces wave)
  socket.on('connect_request', function(data) {
    if (!rateOk(socket.id)) {
      socket.emit('connect_error', { code: 'rate_limit', message: 'Too many requests — slow down a bit.' });
      return;
    }
    if (isBlocked(data.toId, socket.id)) {
      socket.emit('connect_error', { code: 'blocked', message: 'Unable to connect.' });
      return;
    }
    if (!getUser(data.toId)) {
      socket.emit('connect_error', { code: 'user_offline', message: 'They just went offline.' });
      return;
    }

    var reqId = socket.id + '_' + data.toId + '_' + Date.now();
    pendingConnects.set(reqId, { from: socket.id, to: data.toId, reqId });

    var me = getUser(socket.id);
    io.to(data.toId).emit('incoming_connect', {
      reqId,
      from:       socket.id,
      name:       me ? me.name : 'Someone',
      vibe:       me ? me.vibe : 'chill',
      matchScore: data.matchScore || 0,
    });
    socket.emit('connect_sent', { reqId });

    // auto-expire after 30s
    setTimeout(function() {
      if (pendingConnects.has(reqId)) {
        pendingConnects.delete(reqId);
        socket.emit('connect_expired', { reqId });
        io.to(data.toId).emit('connect_expired', { reqId });
      }
    }, 30000);
  });

  socket.on('accept_connect', function(data) {
    var req = pendingConnects.get(data.reqId);
    if (!req) {
      socket.emit('connect_error', { code: 'expired', message: 'Request expired.' });
      return;
    }
    pendingConnects.delete(data.reqId);

    var chatId = 'chat_' + req.reqId.replace(/[^a-z0-9]/gi, '').slice(0, 14);
    activeChats.set(chatId, { userA: req.from, userB: req.to });

    socket.join(chatId);
    var fromSocket = io.sockets.sockets.get(req.from);
    if (fromSocket) fromSocket.join(chatId);

    var myName    = getUser(socket.id)?.name || 'Someone';
    var theirName = getUser(req.from)?.name  || 'Someone';

    io.to(req.from).emit('chat_started', { chatId, withName: myName });
    socket.emit('chat_started', { chatId, withName: theirName });
  });

  socket.on('decline_connect', function(data) {
    var req = pendingConnects.get(data.reqId);
    if (!req) return;
    pendingConnects.delete(data.reqId);
    io.to(req.from).emit('connect_declined');
  });

  socket.on('chat_message', function(data) {
    if (!data.chatId || !data.text) return;
    if (data.text.length > 500) return;
    io.to(data.chatId).emit('chat_message', {
      chatId: data.chatId,
      from:   socket.id,
      text:   data.text,
      ts:     Date.now(),
    });
  });

  socket.on('chat:typing', function(data) {
    if (!data.chatId) return;
    socket.to(data.chatId).emit('chat:typing', {
      chatId: data.chatId,
      typing: !!data.typing,
    });
  });

  socket.on('block_user', function(data) {
    if (!data.targetId) return;
    blockUser(socket.id, data.targetId);
    var matches = getMatches(socket.id, 5);
    socket.emit('match_list', matches);
  });

  socket.on('report_user', function(data) {
    if (!data.targetId) return;
    var count = report(data.targetId);
    if (count >= 3) {
      var targetSocket = io.sockets.sockets.get(data.targetId);
      if (targetSocket) {
        targetSocket.emit('presence:expired');
        cleanup(targetSocket);
        targetSocket.disconnect(true);
      }
    }
  });

  socket.on('go_offline', function() {
    cleanup(socket);
  });

  socket.on('disconnect', function() {
    console.log('- disconnected:', socket.id);
    cleanup(socket);
  });

  function cleanup(s) {
    var tile = socketToTile.get(s.id);
    goOffline(s.id);
    socketToTile.delete(s.id);
    connectRateMap.delete(s.id);
    if (tile) s.to('geo:' + tile).emit('nearby_changed');
  }
});

// ─── HTTP routes ──────────────────────────────────────────────────────────────
app.get('/health', function(req, res) {
  res.json({ ok: true });
});

app.get('/stats', function(req, res) {
  res.json({ active: activeCount() });
});

var PORT = process.env.PORT || 4000;
server.listen(PORT, function() {
  console.log('Out server → http://localhost:' + PORT);
});
