const { statusController } = require("../Controllers");
const { authenticateJWT } = require('../Middlewares/authentication.middleware')

module.exports.statusRoutes = (app) => {
  const router = require("express").Router();

  /**
   * Create a new status
   */
  router.post("/", statusController.createStatus)

  /**
   * Find all instance
   */
  router.get("/all", statusController.getStatusList)

  app.use("/status", authenticateJWT, router);
};
