var express = require('express');
var http = require('http');
var { Server } = require('socket.io');
var cors = require('cors');
var { goLive, goOffline, getNearby, getUser, getGeohash } = require('./nearby');

var app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

var server = http.createServer(app);
var io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

var pendingRequests = new Map();
var activeChats = new Map();
var socketToGeohash = new Map();

io.on('connection', function(socket) {
  console.log('+ connected:', socket.id);

  socket.on('go_live', function(data) {
    var gh = goLive(socket.id, data);
    socketToGeohash.set(socket.id, gh);

    socket.join('geo:' + gh);

    var nearby = getNearby(socket.id, data.radiusKm || 5);
    socket.emit('nearby_list', nearby);

    // tell others in same geo area a new person arrived
    socket.to('geo:' + gh).emit('nearby_changed');
  });

  socket.on('refresh_nearby', function(data) {
    var nearby = getNearby(socket.id, (data && data.radiusKm) || 5);
    socket.emit('nearby_list', nearby);
  });

  socket.on('send_request', function(data) {
    // check user is still online
    if (!getUser(data.toId)) {
      socket.emit('request_error', { code: 'user_offline', message: 'They went offline.' });
      return;
    }
    var reqId = socket.id + '_' + data.toId + '_' + Date.now();
    pendingRequests.set(reqId, { from: socket.id, to: data.toId, reqId: reqId });

    var me = getUser(socket.id);
    io.to(data.toId).emit('incoming_request', {
      reqId: reqId,
      from: socket.id,
      name: me ? me.name : 'Someone',
      vibe: me ? me.vibe : 'just chill',
    });
    socket.emit('request_sent', { reqId: reqId });

    // auto-expire invite after 30s
    setTimeout(function() {
      if (pendingRequests.has(reqId)) {
        pendingRequests.delete(reqId);
        socket.emit('request_expired', { reqId: reqId });
        io.to(data.toId).emit('invite_expired', { reqId: reqId });
      }
    }, 30000);
  });

  socket.on('accept_request', function(data) {
    var req = pendingRequests.get(data.reqId);
    if (!req) {
      socket.emit('request_error', { code: 'invite_expired', message: 'Invite expired.' });
      return;
    }
    pendingRequests.delete(data.reqId);

    var chatId = 'chat_' + req.reqId.replace(/[^a-z0-9]/gi, '').slice(0, 12);
    activeChats.set(chatId, { userA: req.from, userB: req.to });

    socket.join(chatId);
    var fromSocket = io.sockets.sockets.get(req.from);
    if (fromSocket) fromSocket.join(chatId);

    var myName = getUser(socket.id)?.name || 'Someone';
    var theirName = getUser(req.from)?.name || 'Someone';

    io.to(req.from).emit('chat_started', { chatId: chatId, withName: myName });
    socket.emit('chat_started', { chatId: chatId, withName: theirName });
  });

  socket.on('decline_request', function(data) {
    var req = pendingRequests.get(data.reqId);
    if (!req) return;
    pendingRequests.delete(data.reqId);
    io.to(req.from).emit('request_declined');
  });

  socket.on('chat_message', function(data) {
    if (!data.chatId || !data.text) return;
    io.to(data.chatId).emit('chat_message', {
      chatId: data.chatId,
      from: socket.id,
      text: data.text,
      ts: Date.now(),
    });
  });

  socket.on('go_offline', function() {
    cleanup(socket);
  });

  socket.on('disconnect', function() {
    console.log('- disconnected:', socket.id);
    cleanup(socket);
  });

  function cleanup(s) {
    var gh = socketToGeohash.get(s.id);
    goOffline(s.id);
    socketToGeohash.delete(s.id);
    if (gh) {
      s.to('geo:' + gh).emit('nearby_changed');
    }
  }
});

app.get('/health', function(req, res) { res.json({ ok: true }); });

var PORT = process.env.PORT || 4000;
server.listen(PORT, function() {
  console.log('Out server on http://localhost:' + PORT);
});
