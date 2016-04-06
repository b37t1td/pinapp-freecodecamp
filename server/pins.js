
var request = require('request').defaults({ encoding: null });
var md5 = require('md5');
var fs = require('fs');
var path = require('path');

module.exports = function(app, db) {

  function saveImage(buffer, ext) {
    var fileName = md5(buffer) + '-' + new Date().getTime() + '.' + ext;
    var name = path.resolve(__dirname + '/../public/images/') + fileName;
    var wstream = fs.createWriteStream(name);
    wstream.write(buffer);
    wstream.end();

    return {
      url : '/images/' + fileName,
      file : name
    };
  }

  function validateImage(url, cb) {
    request.get(url,  function(err, resp, body) {
      try {
        var contentType = resp.headers['content-type'];
        if (contentType.match(/image/)) {
          var paths = saveImage(body, contentType.replace('image/', ''));
          return cb(paths);
        }

      } catch(e) {}
      cb(null);
    });
  }

  app.delete('/api/pins/:id', function(req,res) {
    if (!req.session.user || !req.session.user.id) {
      return res.status(403).end();
    }

    db.findPin(req.params.id, function(err, pin) {
      if (err) return res.status(404).end();

      if (Number(pin.userId) === Number(req.session.user.id)) {

        fs.exists(pin.file, function(exists) {
            if (exists) {
                try { fs.unlink(pin.file); } catch(e) {}
            }
        });

        db.removePin(pin._id, function(err, d) {
          if (err) return res.status(500).end();
          res.send({}).end();
        });
      } else {
        res.status(403).end();
      }
    });
  });

  app.get('/api/pins', function(req, res) {
    db.findPins(function(err, data) {
      if (err) return res.status(500).end();
      var pins = data.map(function(pin) {
        pin.id = pin._id;
        return pin;
      });
      res.send({pins : pins}).end();
    });
  });

  app.post('/api/pins' , function(req, res) {
    if (!req.session.user || !req.session.user.id) {
      return res.status(403).end();
    }

    var pin = req.body.pin;
    pin.userId = req.session.user.id;
    validateImage(pin.image, function(paths) {
      if (paths === null) {
        pin.file = null;
        pin.image = null;
      } else {
        pin.image = paths.url;
        pin.file = paths.file;
      }

      db.createPin(pin, function(err,d) {
        if (err) return res.status(500).end();

        d.id = d._id;
        var out = {
          pin : d
        }
        res.send(out).end();
      });
    });
  });
}
