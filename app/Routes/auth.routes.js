const { authController } = require('../Controllers');

module.exports.authRoutes = (app) => {
  const router = require('express').Router();
  /**
   * Create a new isntance
   */
  router.post('/login', authController.login)

  /**
   * Update a instance
   */
  router.get('/logout', authController.logout)

  app.use('/auth', router);
}