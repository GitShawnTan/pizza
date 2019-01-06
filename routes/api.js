var express = require('express');
var router = express.Router();
var db = require('../db');
var axios = require('axios');
router.post('/cart',function(req,res,next){
   const query=('SELECT Name, ID FROM Product WHERE ID=?')
    const query2=('SELECT * FROM Customizations')
 var found = false
   for(let i = 0; i<req.session.cart.length; i++){
       console.log(i);
       console.log(req.session.cart[i])
       console.log(req.body.id)
    
        if(req.body.id==req.session.cart[i].productId)
        {
            req.session.cart[i].quantity+=req.body.quantity;
            found = true
            req.session.cartcount++
            res.json({cart:req.session.cart,cartcount:req.session.cartcount})
        }   
    }
   if(!found){
   db.get().query(query,[req.body.id],function(err,row){
       console.log(err);
       console.log(row);
       console.log(req.body);
    let item={
        productId: row[0].ID, quantity:req.body.quantity, Name:row[0].Name, CartId:req.session.nextcartid
    };
    if(req.body.id==0){
        db.get().query(query2, function(err,row2){   
        let customizations = [];
        for(let i = 0; i<req.body.customizations.length; i++){
                for(let j = 0; j<row2.length; j++){
                    if(req.body.customizations[i] == row2[j].ID){
                        customizations.push({ id: row2[j].ID, topping:row2[j].Topping})                }
        }

    }

    item.customizations = customizations;
    req.session.cart.push(item);
    req.session.nextcartid++;
    req.session.cartcount+=req.body.quantity;
    res.json({cart:req.session.cart,cartcount:req.session.cartcount})
    

})
    }
    else{
    req.session.cart.push(item);
    req.session.nextcartid++;
    req.session.cartcount+=req.body.quantity;
    res.json({cart:req.session.cart,cartcount:req.session.cartcount})
   }
   });
   }


})  

//update
 router.put('/cart/:CartId', function(req,res,next){
    for(let i = 0; i < req.session.cart.length; i++ ){
        if(req.session.cart[i].CartId==req.params.CartId){
            if(parseInt(req.body.quantity)>req.session.cart[i].quantity){
                req.session.cartcount += parseInt(req.body.quantity)-req.session.cart[i].quantity
        }else{
            req.session.cartcount -= req.session.cart[i].quantity-parseInt(req.body.quantity)
        }
        req.session.cart[i].quantity=parseInt(req.body.quantity)
 }
}
res.json({cart:req.session.cart,cartcount:req.session.cartcount})

});

//update
router.delete('/cart/:CartId',function(req,res,next){
    for(let i = 0;i<req.session.cart.length; i++){
        if(req.session.cart[i].CartId==req.params.CartId){
            req.session.cartcount-=req.session.cart[i].quantity
            req.session.cart.splice(i,1)
    }

    }
    res.json({cart:req.session.cart,cartcount:req.session.cartcount})

})
router.delete('/cart',function(req,res,next){
    req.session.cart=[]
    req.session.cartcount = 0
    req.session.nextcartid =1
    res.json({cart:req.session.cart,cartcount:req.session.cartcount})

})







module.exports = router;
