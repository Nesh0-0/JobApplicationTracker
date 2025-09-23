const express = require('express');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const companyRoutes = require('./routes/companies');
const reminderRoutes = require('./routes/reminders');
const statsRoutes = require('./routes/stats');
const resumeScannerRoutes = require('./routes/resumeScanner')
const groupRoutes = require('./routes/groups');
const messageRoutes = require('./routes/messages');
const db = require('./utils/db');
const cors = require('cors');
const http = require("http");
require('./utils/reminderScheduler');
const { Server } = require("socket.io");
const server = http.createServer(app);
const jwt = require('jsonwebtoken');
require('dotenv').config()



const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL like "http://localhost:5173"
    methods: ["GET", "POST"]
  }
});



app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

app.use('/users', userRoutes);

app.use('/applications', applicationRoutes);

app.use('/companies', companyRoutes);

app.use('/reminders', reminderRoutes);

app.use('/stats', statsRoutes);

app.use('/scanResume', resumeScannerRoutes);

app.use('/groups', groupRoutes);

app.use('/messages', messageRoutes);

// app.use(express.static('public'));

const verify = (token) => {
    try {
       
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return user;
    }
    catch (err) {
        return err;
    }
};


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a group
  socket.on("joinGroup", ({ groupId }) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // User sends a message
  socket.on("sendMessage", async ({ groupId, text, token }) => {
    try {
      // Decode user from token
      const user = verify(token);
    //   const user = verifyToken(token); // implement JWT verify
      const msg = { userId: user.id, userName: user.username, text, groupId };

      // Save message to DB
      // await Message.create({ userId: user.id, groupId, text });

      // Emit to group members only
      io.to(`group_${groupId}`).emit("message", msg);
    } catch (err) {
      console.log("Error sending message:", err);
    }
  });
});




db.sync().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running!`);
    });

}).catch(err => {
    console.log("Could not run server!");
});

module.exports = { io };