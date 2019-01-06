var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../db');

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', function (req, res, next) {
  var errors = [];
  var user;

  if (req.body.password !== req.body.passwordConf) {
    errors.push("The provided passwords do not match.");
  }

  if (!(req.body.email && req.body.username && req.body.password && req.body.passwordConf && req.body.name && req.body.address)) {
    errors.push("All fields are required.");
  }

  var selectQuery = 'SELECT * FROM Customers WHERE Name = ?';
  db.get().query(selectQuery, [req.body.username], async function(err, rows) {
    console.log(err);
    if (err) {
      errors.push(err);
    }

    if (rows.length) {
      errors.push("That username is already taken.");
    } 
      
    if (!errors.length) {
      var insertQuery = 'INSERT INTO Customers (Username, Email, Password, Name, Address) VALUES (?, ?, ?, ?, ?)';
      var password = await bcrypt.hash(req.body.password, 10)
      db.get().query(insertQuery, [req.body.username, req.body.email, password, req.body.name, req.body.address], function(err, result) {
        if (err) {
          errors.push(err);
        }

        if (errors.length) {
          res.render('register', { errors: errors });
        }else{
          res.redirect('login');
        }

      })
    } else {
      res.render('register', { errors: errors });
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', async function (req, res, next) {
  var errors = [];
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
  }

  var selectQuery = 'SELECT * FROM Customers WHERE Username = ?';
  db.get().query(selectQuery, [req.body.username], async function (err, rows) {
    console.log(rows)
    if (rows.length === 1) {
      var auth = await bcrypt.compare(password, rows[0].Password);

      if (auth) {
        req.session.user = rows[0];
        req.session.cart=[];//emtpy cart
        req.session.nextcartid = 1;
        req.session.cartcount = 0;
        res.redirect('/menu');
      } else {
        errors.push('Incorrect username/password');
        res.render('login', { errors: errors });
      }
    } else {
      errors.push('Incorrect username/password');
      res.render('login', { errors: errors });
    }
  });
})

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
