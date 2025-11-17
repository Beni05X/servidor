const express = require("express");
const cors = require("cors");
const conectarDB = require("../config/database");
const usuarioRoutes = require("../routes/usuarioRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

conectarDB();

app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente desde /api" });
});

app.use("/benilde", usuarioRoutes);

// Exportar como serverless function
module.exports = app;
