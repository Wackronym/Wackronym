'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  app.route('/api/users/mobileEditUser').post(users.mobileEditUser);
  app.route('/api/users/mobileLogin').get(users.mobileLogin);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
