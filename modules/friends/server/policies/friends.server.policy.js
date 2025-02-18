'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Friends Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/friends',
      permissions: '*'
    }, {
      resources: '/api/friends/:friendId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/friends',
      permissions: ['get', 'post', 'delete']
    }, {
      resources: '/api/friends/:friendId',
      permissions: ['get', 'post', 'delete']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/friends',
      permissions: ['get']
    }, {
      resources: '/api/friends/:friendId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Friends Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Friend is being processed and the current user created it then allow any manipulation
  if (req.friend && req.user && req.friend.user && req.friend.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
