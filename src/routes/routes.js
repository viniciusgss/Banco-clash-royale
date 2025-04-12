const consultasRoutes = require("./usuario.routes");

/**
 * Configura as rotas do aplicativo.
 * @param {Object} app - Aplicativo Express
 */
const routes = (app) => {
  app.use("/api/consultas", consultasRoutes);
};

module.exports = routes;
