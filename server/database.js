var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


module.exports = function Database(callback) {
  this.db = null;
  var self = this;

  mongo.connect(process.env.MONGO_URI, function(err, db) {
    if (err) return console.log(err);
    self.db = db;
    callback();
  });

  this.removePin = function(id, cb) {
    var pins = db.collection('pins');

    pins.remove({_id : new ObjectId(id)}, function(err, d) {
      if (err) return cb(err);
      cb(null, d);
    });
  }

  this.findPin = function(id, cb) {
    var pins = db.collection('pins');

    pins.findOne({_id : new ObjectId(id)}, function(err, pin) {
      if (err) return cb(err);
      cb(null, pin);
    });
  }

  this.findPins = function(cb) {
    var pins = db.collection('pins');

    pins.find({}).toArray(function(err, data) {
      if (err) return cb(err);
      cb(null, data);
    });
  }

  this.createPin = function(data, cb) {
    var pins = db.collection('pins');

    pins.insert(data, function(err, d) {
      if (err) return cb(err);
      cb(null,data);
    })
  }

  this.createLogin = function(data, cb) {
    var logins = db.collection('logins');
    data = JSON.parse(data);
    var userData = {
      id    : data.id,
      login : data.screen_name,
      image : data.profile_image_url_https,
      name  : data.name
    };

    logins.findOne({id : data.id}, function(err, data) {
      if (err) return cb(err);
      if (data === null) {
        logins.insert(userData, function(err, data) {
          if (err) return cb(err);
          cb(null, userData);
        })
      } else {
        cb(null, userData);
      }
    });
  };

return this;
}
