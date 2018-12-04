'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sentense = mongoose.model('Sentense'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sentense;

/**
 * Sentense routes tests
 */
describe('Sentense CRUD tests', function () {

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

    // Save a user to the test db and create new Sentense
    user.save(function () {
      sentense = {
        name: 'Sentense name'
      };

      done();
    });
  });

  it('should be able to save a Sentense if logged in', function (done) {
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

        // Save a new Sentense
        agent.post('/api/sentenses')
          .send(sentense)
          .expect(200)
          .end(function (sentenseSaveErr, sentenseSaveRes) {
            // Handle Sentense save error
            if (sentenseSaveErr) {
              return done(sentenseSaveErr);
            }

            // Get a list of Sentenses
            agent.get('/api/sentenses')
              .end(function (sentensesGetErr, sentensesGetRes) {
                // Handle Sentenses save error
                if (sentensesGetErr) {
                  return done(sentensesGetErr);
                }

                // Get Sentenses list
                var sentenses = sentensesGetRes.body;

                // Set assertions
                (sentenses[0].user._id).should.equal(userId);
                (sentenses[0].name).should.match('Sentense name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sentense if not logged in', function (done) {
    agent.post('/api/sentenses')
      .send(sentense)
      .expect(403)
      .end(function (sentenseSaveErr, sentenseSaveRes) {
        // Call the assertion callback
        done(sentenseSaveErr);
      });
  });

  it('should not be able to save an Sentense if no name is provided', function (done) {
    // Invalidate name field
    sentense.name = '';

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

        // Save a new Sentense
        agent.post('/api/sentenses')
          .send(sentense)
          .expect(400)
          .end(function (sentenseSaveErr, sentenseSaveRes) {
            // Set message assertion
            (sentenseSaveRes.body.message).should.match('Please fill Sentense name');

            // Handle Sentense save error
            done(sentenseSaveErr);
          });
      });
  });

  it('should be able to update an Sentense if signed in', function (done) {
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

        // Save a new Sentense
        agent.post('/api/sentenses')
          .send(sentense)
          .expect(200)
          .end(function (sentenseSaveErr, sentenseSaveRes) {
            // Handle Sentense save error
            if (sentenseSaveErr) {
              return done(sentenseSaveErr);
            }

            // Update Sentense name
            sentense.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sentense
            agent.put('/api/sentenses/' + sentenseSaveRes.body._id)
              .send(sentense)
              .expect(200)
              .end(function (sentenseUpdateErr, sentenseUpdateRes) {
                // Handle Sentense update error
                if (sentenseUpdateErr) {
                  return done(sentenseUpdateErr);
                }

                // Set assertions
                (sentenseUpdateRes.body._id).should.equal(sentenseSaveRes.body._id);
                (sentenseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sentenses if not signed in', function (done) {
    // Create new Sentense model instance
    var sentenseObj = new Sentense(sentense);

    // Save the sentense
    sentenseObj.save(function () {
      // Request Sentenses
      request(app).get('/api/sentenses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sentense if not signed in', function (done) {
    // Create new Sentense model instance
    var sentenseObj = new Sentense(sentense);

    // Save the Sentense
    sentenseObj.save(function () {
      request(app).get('/api/sentenses/' + sentenseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sentense.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sentense with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sentenses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sentense is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sentense which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sentense
    request(app).get('/api/sentenses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sentense with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sentense if signed in', function (done) {
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

        // Save a new Sentense
        agent.post('/api/sentenses')
          .send(sentense)
          .expect(200)
          .end(function (sentenseSaveErr, sentenseSaveRes) {
            // Handle Sentense save error
            if (sentenseSaveErr) {
              return done(sentenseSaveErr);
            }

            // Delete an existing Sentense
            agent.delete('/api/sentenses/' + sentenseSaveRes.body._id)
              .send(sentense)
              .expect(200)
              .end(function (sentenseDeleteErr, sentenseDeleteRes) {
                // Handle sentense error error
                if (sentenseDeleteErr) {
                  return done(sentenseDeleteErr);
                }

                // Set assertions
                (sentenseDeleteRes.body._id).should.equal(sentenseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sentense if not signed in', function (done) {
    // Set Sentense user
    sentense.user = user;

    // Create new Sentense model instance
    var sentenseObj = new Sentense(sentense);

    // Save the Sentense
    sentenseObj.save(function () {
      // Try deleting Sentense
      request(app).delete('/api/sentenses/' + sentenseObj._id)
        .expect(403)
        .end(function (sentenseDeleteErr, sentenseDeleteRes) {
          // Set message assertion
          (sentenseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sentense error error
          done(sentenseDeleteErr);
        });

    });
  });

  it('should be able to get a single Sentense that has an orphaned user reference', function (done) {
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

          // Save a new Sentense
          agent.post('/api/sentenses')
            .send(sentense)
            .expect(200)
            .end(function (sentenseSaveErr, sentenseSaveRes) {
              // Handle Sentense save error
              if (sentenseSaveErr) {
                return done(sentenseSaveErr);
              }

              // Set assertions on new Sentense
              (sentenseSaveRes.body.name).should.equal(sentense.name);
              should.exist(sentenseSaveRes.body.user);
              should.equal(sentenseSaveRes.body.user._id, orphanId);

              // force the Sentense to have an orphaned user reference
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

                    // Get the Sentense
                    agent.get('/api/sentenses/' + sentenseSaveRes.body._id)
                      .expect(200)
                      .end(function (sentenseInfoErr, sentenseInfoRes) {
                        // Handle Sentense error
                        if (sentenseInfoErr) {
                          return done(sentenseInfoErr);
                        }

                        // Set assertions
                        (sentenseInfoRes.body._id).should.equal(sentenseSaveRes.body._id);
                        (sentenseInfoRes.body.name).should.equal(sentense.name);
                        should.equal(sentenseInfoRes.body.user, undefined);

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
      Sentense.remove().exec(done);
    });
  });
});
