const { statusController } = require("../Controllers");

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

  app.use("/status", router);
};
