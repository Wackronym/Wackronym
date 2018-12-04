'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Config = mongoose.model('Config'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  config;

/**
 * Config routes tests
 */
describe('Config CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Config
    user.save(function () {
      config = {
        name: 'Config name'
      };

      done();
    });
  });

  it('should be able to save a Config if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Config
        agent.post('/api/configs')
          .send(config)
          .expect(200)
          .end(function (configSaveErr, configSaveRes) {
            // Handle Config save error
            if (configSaveErr) {
              return done(configSaveErr);
            }

            // Get a list of Configs
            agent.get('/api/configs')
              .end(function (configsGetErr, configsGetRes) {
                // Handle Configs save error
                if (configsGetErr) {
                  return done(configsGetErr);
                }

                // Get Configs list
                var configs = configsGetRes.body;

                // Set assertions
                (configs[0].user._id).should.equal(userId);
                (configs[0].name).should.match('Config name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Config if not logged in', function (done) {
    agent.post('/api/configs')
      .send(config)
      .expect(403)
      .end(function (configSaveErr, configSaveRes) {
        // Call the assertion callback
        done(configSaveErr);
      });
  });

  it('should not be able to save an Config if no name is provided', function (done) {
    // Invalidate name field
    config.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Config
        agent.post('/api/configs')
          .send(config)
          .expect(400)
          .end(function (configSaveErr, configSaveRes) {
            // Set message assertion
            (configSaveRes.body.message).should.match('Please fill Config name');

            // Handle Config save error
            done(configSaveErr);
          });
      });
  });

  it('should be able to update an Config if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Config
        agent.post('/api/configs')
          .send(config)
          .expect(200)
          .end(function (configSaveErr, configSaveRes) {
            // Handle Config save error
            if (configSaveErr) {
              return done(configSaveErr);
            }

            // Update Config name
            config.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Config
            agent.put('/api/configs/' + configSaveRes.body._id)
              .send(config)
              .expect(200)
              .end(function (configUpdateErr, configUpdateRes) {
                // Handle Config update error
                if (configUpdateErr) {
                  return done(configUpdateErr);
                }

                // Set assertions
                (configUpdateRes.body._id).should.equal(configSaveRes.body._id);
                (configUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Configs if not signed in', function (done) {
    // Create new Config model instance
    var configObj = new Config(config);

    // Save the config
    configObj.save(function () {
      // Request Configs
      request(app).get('/api/configs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Config if not signed in', function (done) {
    // Create new Config model instance
    var configObj = new Config(config);

    // Save the Config
    configObj.save(function () {
      request(app).get('/api/configs/' + configObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', config.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Config with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/configs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Config is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Config which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Config
    request(app).get('/api/configs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Config with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Config if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Config
        agent.post('/api/configs')
          .send(config)
          .expect(200)
          .end(function (configSaveErr, configSaveRes) {
            // Handle Config save error
            if (configSaveErr) {
              return done(configSaveErr);
            }

            // Delete an existing Config
            agent.delete('/api/configs/' + configSaveRes.body._id)
              .send(config)
              .expect(200)
              .end(function (configDeleteErr, configDeleteRes) {
                // Handle config error error
                if (configDeleteErr) {
                  return done(configDeleteErr);
                }

                // Set assertions
                (configDeleteRes.body._id).should.equal(configSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Config if not signed in', function (done) {
    // Set Config user
    config.user = user;

    // Create new Config model instance
    var configObj = new Config(config);

    // Save the Config
    configObj.save(function () {
      // Try deleting Config
      request(app).delete('/api/configs/' + configObj._id)
        .expect(403)
        .end(function (configDeleteErr, configDeleteRes) {
          // Set message assertion
          (configDeleteRes.body.message).should.match('User is not authorized');

          // Handle Config error error
          done(configDeleteErr);
        });

    });
  });

  it('should be able to get a single Config that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Config
          agent.post('/api/configs')
            .send(config)
            .expect(200)
            .end(function (configSaveErr, configSaveRes) {
              // Handle Config save error
              if (configSaveErr) {
                return done(configSaveErr);
              }

              // Set assertions on new Config
              (configSaveRes.body.name).should.equal(config.name);
              should.exist(configSaveRes.body.user);
              should.equal(configSaveRes.body.user._id, orphanId);

              // force the Config to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Config
                    agent.get('/api/configs/' + configSaveRes.body._id)
                      .expect(200)
                      .end(function (configInfoErr, configInfoRes) {
                        // Handle Config error
                        if (configInfoErr) {
                          return done(configInfoErr);
                        }

                        // Set assertions
                        (configInfoRes.body._id).should.equal(configSaveRes.body._id);
                        (configInfoRes.body.name).should.equal(config.name);
                        should.equal(configInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Config.remove().exec(done);
    });
  });
});
