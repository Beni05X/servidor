const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/database");
const usuarioRoutes = require("./routes/usuarioRoutes");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
conectarDB();

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ mensaje: "API funcionando correctamente" });
});

// Rutas de usuario
app.use("/benilde", usuarioRoutes);

// ❌ IMPORTANTE: Quitar app.listen() en Vercel
// Vercel maneja el servidor internamente.

// ✔️ Exportar la app para que Vercel la use
module.exports = app;
