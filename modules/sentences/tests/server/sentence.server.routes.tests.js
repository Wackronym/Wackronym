'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sentence = mongoose.model('Sentence'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sentence;

/**
 * Sentence routes tests
 */
describe('Sentence CRUD tests', function () {

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

    // Save a user to the test db and create new Sentence
    user.save(function () {
      sentence = {
        name: 'Sentence name'
      };

      done();
    });
  });

  it('should be able to save a Sentence if logged in', function (done) {
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

        // Save a new Sentence
        agent.post('/api/sentences')
          .send(sentence)
          .expect(200)
          .end(function (sentenceSaveErr, sentenceSaveRes) {
            // Handle Sentence save error
            if (sentenceSaveErr) {
              return done(sentenceSaveErr);
            }

            // Get a list of Sentences
            agent.get('/api/sentences')
              .end(function (sentencesGetErr, sentencesGetRes) {
                // Handle Sentences save error
                if (sentencesGetErr) {
                  return done(sentencesGetErr);
                }

                // Get Sentences list
                var sentences = sentencesGetRes.body;

                // Set assertions
                (sentences[0].user._id).should.equal(userId);
                (sentences[0].name).should.match('Sentence name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sentence if not logged in', function (done) {
    agent.post('/api/sentences')
      .send(sentence)
      .expect(403)
      .end(function (sentenceSaveErr, sentenceSaveRes) {
        // Call the assertion callback
        done(sentenceSaveErr);
      });
  });

  it('should not be able to save an Sentence if no name is provided', function (done) {
    // Invalidate name field
    sentence.name = '';

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

        // Save a new Sentence
        agent.post('/api/sentences')
          .send(sentence)
          .expect(400)
          .end(function (sentenceSaveErr, sentenceSaveRes) {
            // Set message assertion
            (sentenceSaveRes.body.message).should.match('Please fill Sentence name');

            // Handle Sentence save error
            done(sentenceSaveErr);
          });
      });
  });

  it('should be able to update an Sentence if signed in', function (done) {
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

        // Save a new Sentence
        agent.post('/api/sentences')
          .send(sentence)
          .expect(200)
          .end(function (sentenceSaveErr, sentenceSaveRes) {
            // Handle Sentence save error
            if (sentenceSaveErr) {
              return done(sentenceSaveErr);
            }

            // Update Sentence name
            sentence.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sentence
            agent.put('/api/sentences/' + sentenceSaveRes.body._id)
              .send(sentence)
              .expect(200)
              .end(function (sentenceUpdateErr, sentenceUpdateRes) {
                // Handle Sentence update error
                if (sentenceUpdateErr) {
                  return done(sentenceUpdateErr);
                }

                // Set assertions
                (sentenceUpdateRes.body._id).should.equal(sentenceSaveRes.body._id);
                (sentenceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sentences if not signed in', function (done) {
    // Create new Sentence model instance
    var sentenceObj = new Sentence(sentence);

    // Save the sentence
    sentenceObj.save(function () {
      // Request Sentences
      request(app).get('/api/sentences')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sentence if not signed in', function (done) {
    // Create new Sentence model instance
    var sentenceObj = new Sentence(sentence);

    // Save the Sentence
    sentenceObj.save(function () {
      request(app).get('/api/sentences/' + sentenceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sentence.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sentence with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sentences/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sentence is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sentence which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sentence
    request(app).get('/api/sentences/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sentence with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sentence if signed in', function (done) {
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

        // Save a new Sentence
        agent.post('/api/sentences')
          .send(sentence)
          .expect(200)
          .end(function (sentenceSaveErr, sentenceSaveRes) {
            // Handle Sentence save error
            if (sentenceSaveErr) {
              return done(sentenceSaveErr);
            }

            // Delete an existing Sentence
            agent.delete('/api/sentences/' + sentenceSaveRes.body._id)
              .send(sentence)
              .expect(200)
              .end(function (sentenceDeleteErr, sentenceDeleteRes) {
                // Handle sentence error error
                if (sentenceDeleteErr) {
                  return done(sentenceDeleteErr);
                }

                // Set assertions
                (sentenceDeleteRes.body._id).should.equal(sentenceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sentence if not signed in', function (done) {
    // Set Sentence user
    sentence.user = user;

    // Create new Sentence model instance
    var sentenceObj = new Sentence(sentence);

    // Save the Sentence
    sentenceObj.save(function () {
      // Try deleting Sentence
      request(app).delete('/api/sentences/' + sentenceObj._id)
        .expect(403)
        .end(function (sentenceDeleteErr, sentenceDeleteRes) {
          // Set message assertion
          (sentenceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sentence error error
          done(sentenceDeleteErr);
        });

    });
  });

  it('should be able to get a single Sentence that has an orphaned user reference', function (done) {
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

          // Save a new Sentence
          agent.post('/api/sentences')
            .send(sentence)
            .expect(200)
            .end(function (sentenceSaveErr, sentenceSaveRes) {
              // Handle Sentence save error
              if (sentenceSaveErr) {
                return done(sentenceSaveErr);
              }

              // Set assertions on new Sentence
              (sentenceSaveRes.body.name).should.equal(sentence.name);
              should.exist(sentenceSaveRes.body.user);
              should.equal(sentenceSaveRes.body.user._id, orphanId);

              // force the Sentence to have an orphaned user reference
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

                    // Get the Sentence
                    agent.get('/api/sentences/' + sentenceSaveRes.body._id)
                      .expect(200)
                      .end(function (sentenceInfoErr, sentenceInfoRes) {
                        // Handle Sentence error
                        if (sentenceInfoErr) {
                          return done(sentenceInfoErr);
                        }

                        // Set assertions
                        (sentenceInfoRes.body._id).should.equal(sentenceSaveRes.body._id);
                        (sentenceInfoRes.body.name).should.equal(sentence.name);
                        should.equal(sentenceInfoRes.body.user, undefined);

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
      Sentence.remove().exec(done);
    });
  });
});
