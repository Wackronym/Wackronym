'use strict';

/**
 * Module dependencies
 */
var friendsPolicy = require('../policies/friends.server.policy'),
  friends = require('../controllers/friends.server.controller');

module.exports = function(app) {
  // Friends Routes  .all(friendsPolicy.isAllowed)
  app.route('/api/friends')
    .get(friends.list)
    .post(friends.create);

  app.route('/api/friends/:friendId')
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

  app.route('/api/activeFriend')
    .get(friends.activeFriend);
};
