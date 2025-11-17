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

// Para desarrollo local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app; // Necesario para Vercel
