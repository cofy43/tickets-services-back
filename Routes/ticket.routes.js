const {
  ticketController,
  clientController,
  memberController,
  statusController,
} = require("../Controllers");

module.exports.ticketRoutes = (app) => {
  const router = require("express").Router();

  router.post(
    "/",
    clientController.createFindCliet,
    memberController.getMoreFreeMember,
    statusController.getFirstStatus,
    ticketController.createTicket,
    memberController.assisngTicket
  );

  app.use("/tickets", router);
};