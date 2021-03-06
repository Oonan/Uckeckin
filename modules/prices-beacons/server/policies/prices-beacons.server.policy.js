'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Prices Permissions
 */
 exports.invokeRolesPolicies = function () {
   acl.allow([{
     roles: ['admin'],
     allows: [{
       resources: '/api/prices/beacons',
       permissions: '*'
     }, {
       resources: '/api/prices/beacons/:beaconPriceId',
       permissions: '*'
     }]
   }, {
     roles: ['user'],
     allows: [{
       resources: '/api/prices/beacons',
       permissions: 'get'
     }, {
       resources: '/api/prices/beacons/:beaconPriceId',
       permissions: 'get'
     }]
   }]);
 };

/**
 * Check If Beacons Prices Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  if (req.beaconPrice && req.user && req.beaconPrice.user && req.beaconPrice.user.id === req.user.id) {
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
