const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");


// Función para validar PIN no secuencial
const pinEsSecuencial = (pin) => {
  const secuenciasProhibidas = [
    "0123", "1234", "2345", "3456", "4567", "5678", "6789",
    "9876", "8765", "7654", "6543", "5432", "4321", "3210",
    "0000", "1111", "2222", "3333", "4444", "5555", 
    "6666", "7777", "8888", "9999"
  ];
  return secuenciasProhibidas.includes(pin);
};


// ----------------------------------------------------
//  REGISTRO DE USUARIO
// ----------------------------------------------------
exports.registrarUsuario = async (req, res) => {
  try {
    let { email, contraseña, pin } = req.body;

    // Validación de PIN
    if (pin) {
      if (pin.length !== 4) {
        return res.status(400).json({ error: "El PIN debe tener 4 dígitos." });
      }
      if (pinEsSecuencial(pin)) {
        return res.status(400).json({ error: "El PIN no puede ser secuencial o repetitivo." });
      }
    }

    // Encriptar contraseña y pin
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);
    const pinEncriptado = pin ? await bcrypt.hash(pin, salt) : null;

    const usuario = new Usuario({
      email,
      contraseña: contraseñaEncriptada,
      pin: pinEncriptado
    });

    await usuario.save();

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Este correo ya está registrado." });
    }
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};



// ----------------------------------------------------
// 1️⃣  INICIO DE SESIÓN CON CONTRASEÑA
// ----------------------------------------------------
exports.loginConContraseña = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

    // Validar si la cuenta está bloqueada
    if (usuario.cuenta_bloqueada) {
      return res.status(403).json({
        error: "La cuenta está bloqueada. Contacte soporte."
      });
    }

    // Comparar contraseña
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) {
      usuario.intentos_fallidos += 1;

      // Bloqueo después de 3 intentos
      if (usuario.intentos_fallidos >= 3) {
        usuario.cuenta_bloqueada = true;
        usuario.fecha_bloqueo = new Date();
      }

      await usuario.save();
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    // Reiniciar intentos
    usuario.intentos_fallidos = 0;
    await usuario.save();

    res.json({ mensaje: "Inicio de sesión exitoso con contraseña." });

  } catch (error) {
    res.status(500).json({ error: "Error en el inicio de sesión." });
  }
};



// ----------------------------------------------------
// 2️⃣  INICIO DE SESIÓN CON PIN
// ----------------------------------------------------
exports.loginConPin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

    // Validar si la cuenta está bloqueada
    if (usuario.cuenta_bloqueada) {
      return res.status(403).json({
        error: "La cuenta está bloqueada. Contacte soporte."
      });
    }

    // Comparar PIN
    const coincide = await bcrypt.compare(pin, usuario.pin);
    if (!coincide) {
      usuario.intentos_fallidos += 1;

      // Bloqueo después de 3 intentos
      if (usuario.intentos_fallidos >= 3) {
        usuario.cuenta_bloqueada = true;
        usuario.fecha_bloqueo = new Date();
      }

      await usuario.save();
      return res.status(400).json({ error: "PIN incorrecto." });
    }

    // Reiniciar intentos
    usuario.intentos_fallidos = 0;
    await usuario.save();

    res.json({ mensaje: "Inicio de sesión exitoso con PIN." });

  } catch (error) {
    res.status(500).json({ error: "Error en el inicio de sesión." });
  }
};

