const { memberController } = require('../Controllers');
const { authenticateJWT } = require('../Middlewares/authentication.middleware')

module.exports.memberRoutes = (app) => {
  const router = require('express').Router();

  /**
   * Create a new isntance
   */
  router.post('/', memberController.createMember)

  /**
   * Update a instance
   */
  router.put('/:memberId', memberController.updateMember)

  /**
   * Find a instance of member to dashboard view
   */
  router.get('/', memberController.findMemberInfo)

  app.use('/member', authenticateJWT, router);
}