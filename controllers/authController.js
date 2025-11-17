import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validarPIN } from "../utils/validatePin.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ message: "El correo ya está registrado" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hash
    });

    res.json({ message: "Usuario registrado", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Correo o contraseña incorrectos" });

    if (user.cuenta_bloqueada) return res.status(403).json({ message: "Cuenta bloqueada" });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) {
      user.intentos_fallidos += 1;
      if (user.intentos_fallidos >= 5) {
        user.cuenta_bloqueada = true;
        user.fecha_bloqueo = new Date();
      }
      await user.save();
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    user.intentos_fallidos = 0;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login exitoso",
      necesitaConfigurarPIN: user.pin === null,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginPIN = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });
    if (!user.pin) return res.status(400).json({ message: "No tiene PIN configurado" });
    if (user.cuenta_bloqueada) return res.status(403).json({ message: "Cuenta bloqueada" });

    if (pin !== user.pin) {
      user.intentos_fallidos += 1;
      if (user.intentos_fallidos >= 5) {
        user.cuenta_bloqueada = true;
        user.fecha_bloqueo = new Date();
      }
      await user.save();
      return res.status(400).json({ message: "PIN incorrecto" });
    }

    user.intentos_fallidos = 0;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login por PIN exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const configurarPIN = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (!validarPIN(pin)) {
      return res.status(400).json({ message: "El PIN no cumple las reglas" });
    }

    user.pin = pin;
    await user.save();

    res.json({ message: "PIN configurado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
