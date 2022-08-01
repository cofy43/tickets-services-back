const {
  ticketController,
  clientController,
  memberController,
  statusController,
} = require("../Controllers");
const { authenticateJWT } = require('../Middlewares/authentication.middleware')

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

  router.get("/info", ticketController.ticketInfoForCustomer);

  router.get("/detail/:ticketId", 
    authenticateJWT,
    ticketController.ticketInfoForMember
  );

  app.use("/tickets", router);
};
