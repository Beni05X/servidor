const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  contraseña: { type: String, required: true },
  pin: { type: String, default: null },
  cuenta_bloqueada: { type: Boolean, default: false },
  fecha_bloqueo: { type: Date, default: null },
  intentos_fallidos: { type: Number, default: 0 }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
