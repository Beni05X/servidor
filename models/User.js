import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  pin: { type: String, default: null },
  cuenta_bloqueada: { type: Boolean, default: false },
  fecha_bloqueo: { type: Date, default: null },
  intentos_fallidos: { type: Number, default: 0 }
}, 
{ timestamps: true });

export default mongoose.model("User", userSchema);
