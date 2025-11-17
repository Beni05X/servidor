const app = require("../index");

// Exportar como función para Vercel
module.exports = (req, res) => {
  return app(req, res);
};
