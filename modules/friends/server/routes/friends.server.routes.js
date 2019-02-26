'use strict';

/**
 * Module dependencies
 */
var friendsPolicy = require('../policies/friends.server.policy'),
  friends = require('../controllers/friends.server.controller');

module.exports = function(app) {
  // Friends Routes
  app.route('/api/friends')
    .get(friends.list)
    .post(friends.create);

  app.route('/api/friends/:friendId').all(friendsPolicy.isAllowed)
    .get(friends.read)
    .put(friends.update)
    .delete(friends.delete);

  // Finish by binding the Friend middleware
  app.param('friendId', friends.friendByID);

  // ///////////////////////////// // pendingToUser   
  
  app.route('/api/findFriend')
    .get(friends.findFriend);

  app.route('/api/pendingFriend')
    .get(friends.pendingFriend);
};
