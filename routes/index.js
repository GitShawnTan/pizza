var express = require('express');
var router = express.Router();
var db = require('../db');
var axios = require('axios');
/* GET home page. */
router.get('/',function(req,res,next){
  res.render('index',{user:req.session.user});
})
router.get('/menu', function(req, res, next){

    if(req.session.user) {
      const query = "SELECT * FROM Product WHERE ID > 0";
      db.get().query(query,function(err, row){
        const query = "SELECT * FROM Customizations"
        db.get().query(query,function(err,row2){
          if (err) {
            res.send("There was a database error: " + err);
          }
        res.render('menu',{items:row,customization:row2,cartcount:req.session.cartcount, user:req.session.user})
    
        });
       
      });    
    }

       else {
      res.redirect('users/login');
    }

  
});
router.get('/cart', function(req, res, next){
    res.render('cart',{cart:req.session.cart,cartcount:req.session.cartcount, user:req.session.user})
});






module.exports = router;
