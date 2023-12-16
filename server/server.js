const { instrument } = require("@socket.io/admin-ui");
const { Server } = require("socket.io");

const io = new Server(3000, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userIo = io.of("/user");
userIo.on("connection", (socket) => {
  console.log(`Connected to user Namespace ${socket.username}`);
});

function getUsernameFromToken(token) {
  return token;
}

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("Please send token"));
  }
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("send-message", (message, instance) => {
    if (instance === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      // It is assumed that this is .broadcast when using to
      socket.to(instance).emit("receive-message", message);
    }
  });
  //callback must always be the last thing
  socket.on("join-instance", (instance, cb) => {
    socket.join(instance);
    cb(`Joined ${instance}`);
  });
});

instrument(io, { auth: false, mode: "de" });
