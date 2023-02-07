require("dotenv").config({ path: "./config/config.env" });
require("dotenv").config();
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongodbRoute = process.env.DBLOCAL;

const userRouter = require("./src/routes/userRoutes");

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  pingTimeout: 30000,
  cors: {
    origin: "*",
  },
});
exports.socketIO = io;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api", userRouter);

async function start() {
  try {
    await mongoose.connect(mongodbRoute);
    app.get("/", (req, res) => {
      res.send("Welcome to Chaotic Chronicles Epic Final Socket Service");
    });
    server.listen(port, () => {
      console.log(`Server activo en ${port}`);
    });
    console.log(`Conexión con Mongo correcta.`);
  } catch (error) {
    console.log(process.env);
    console.log(`Error al conectar a la base de datos: ${error.message}`);
  }
}

start();

require("./socket/socketMain");
