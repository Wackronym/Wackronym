'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pack = mongoose.model('Pack'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  pack;

/**
 * Pack routes tests
 */
describe('Pack CRUD tests', function () {

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

    // Save a user to the test db and create new Pack
    user.save(function () {
      pack = {
        name: 'Pack name'
      };

      done();
    });
  });

  it('should be able to save a Pack if logged in', function (done) {
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

        // Save a new Pack
        agent.post('/api/packs')
          .send(pack)
          .expect(200)
          .end(function (packSaveErr, packSaveRes) {
            // Handle Pack save error
            if (packSaveErr) {
              return done(packSaveErr);
            }

            // Get a list of Packs
            agent.get('/api/packs')
              .end(function (packsGetErr, packsGetRes) {
                // Handle Packs save error
                if (packsGetErr) {
                  return done(packsGetErr);
                }

                // Get Packs list
                var packs = packsGetRes.body;

                // Set assertions
                (packs[0].user._id).should.equal(userId);
                (packs[0].name).should.match('Pack name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Pack if not logged in', function (done) {
    agent.post('/api/packs')
      .send(pack)
      .expect(403)
      .end(function (packSaveErr, packSaveRes) {
        // Call the assertion callback
        done(packSaveErr);
      });
  });

  it('should not be able to save an Pack if no name is provided', function (done) {
    // Invalidate name field
    pack.name = '';

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

        // Save a new Pack
        agent.post('/api/packs')
          .send(pack)
          .expect(400)
          .end(function (packSaveErr, packSaveRes) {
            // Set message assertion
            (packSaveRes.body.message).should.match('Please fill Pack name');

            // Handle Pack save error
            done(packSaveErr);
          });
      });
  });

  it('should be able to update an Pack if signed in', function (done) {
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

        // Save a new Pack
        agent.post('/api/packs')
          .send(pack)
          .expect(200)
          .end(function (packSaveErr, packSaveRes) {
            // Handle Pack save error
            if (packSaveErr) {
              return done(packSaveErr);
            }

            // Update Pack name
            pack.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Pack
            agent.put('/api/packs/' + packSaveRes.body._id)
              .send(pack)
              .expect(200)
              .end(function (packUpdateErr, packUpdateRes) {
                // Handle Pack update error
                if (packUpdateErr) {
                  return done(packUpdateErr);
                }

                // Set assertions
                (packUpdateRes.body._id).should.equal(packSaveRes.body._id);
                (packUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Packs if not signed in', function (done) {
    // Create new Pack model instance
    var packObj = new Pack(pack);

    // Save the pack
    packObj.save(function () {
      // Request Packs
      request(app).get('/api/packs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Pack if not signed in', function (done) {
    // Create new Pack model instance
    var packObj = new Pack(pack);

    // Save the Pack
    packObj.save(function () {
      request(app).get('/api/packs/' + packObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', pack.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Pack with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/packs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Pack is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Pack which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Pack
    request(app).get('/api/packs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Pack with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Pack if signed in', function (done) {
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

        // Save a new Pack
        agent.post('/api/packs')
          .send(pack)
          .expect(200)
          .end(function (packSaveErr, packSaveRes) {
            // Handle Pack save error
            if (packSaveErr) {
              return done(packSaveErr);
            }

            // Delete an existing Pack
            agent.delete('/api/packs/' + packSaveRes.body._id)
              .send(pack)
              .expect(200)
              .end(function (packDeleteErr, packDeleteRes) {
                // Handle pack error error
                if (packDeleteErr) {
                  return done(packDeleteErr);
                }

                // Set assertions
                (packDeleteRes.body._id).should.equal(packSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Pack if not signed in', function (done) {
    // Set Pack user
    pack.user = user;

    // Create new Pack model instance
    var packObj = new Pack(pack);

    // Save the Pack
    packObj.save(function () {
      // Try deleting Pack
      request(app).delete('/api/packs/' + packObj._id)
        .expect(403)
        .end(function (packDeleteErr, packDeleteRes) {
          // Set message assertion
          (packDeleteRes.body.message).should.match('User is not authorized');

          // Handle Pack error error
          done(packDeleteErr);
        });

    });
  });

  it('should be able to get a single Pack that has an orphaned user reference', function (done) {
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

          // Save a new Pack
          agent.post('/api/packs')
            .send(pack)
            .expect(200)
            .end(function (packSaveErr, packSaveRes) {
              // Handle Pack save error
              if (packSaveErr) {
                return done(packSaveErr);
              }

              // Set assertions on new Pack
              (packSaveRes.body.name).should.equal(pack.name);
              should.exist(packSaveRes.body.user);
              should.equal(packSaveRes.body.user._id, orphanId);

              // force the Pack to have an orphaned user reference
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

                    // Get the Pack
                    agent.get('/api/packs/' + packSaveRes.body._id)
                      .expect(200)
                      .end(function (packInfoErr, packInfoRes) {
                        // Handle Pack error
                        if (packInfoErr) {
                          return done(packInfoErr);
                        }

                        // Set assertions
                        (packInfoRes.body._id).should.equal(packSaveRes.body._id);
                        (packInfoRes.body.name).should.equal(pack.name);
                        should.equal(packInfoRes.body.user, undefined);

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
      Pack.remove().exec(done);
    });
  });
});
