const express = require("express");
const { 
  registrarUsuario,
  loginConContraseña,
  loginConPin
} = require("../controllers/usuarioController");

const router = express.Router();

// Registro
router.post("/registro", registrarUsuario);

// Login con contraseña
router.post("/login/contraseña", loginConContraseña);

// Login con PIN
router.post("/login/pin", loginConPin);

module.exports = router;
