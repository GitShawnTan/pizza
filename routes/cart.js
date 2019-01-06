var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/item/:ID/delete', function(req, res, next){
    let query = "DELETE FROM Product WHERE ID = ?"
  
    db.get().query(query, [req.params.ID], function(err, row){
      if (err) {
        res.send("There was a database error: " + err);
      }
      res.redirect('/')
  
    })
  })


  router.post('/item/:ID', function(req,res,next){
    let query = "UPDATE Product SET Name=?, Recipe=?, Country=? WHERE id=?";
    
    db.get().query(query,[req.body.Name,req.body.Recipe,req.body.Country, req.params.ID], function(err,row){
     
      if(err){
        res.send("There was a database error: " + err);
      }
      res.redirect('/')
    });
  
  
  });