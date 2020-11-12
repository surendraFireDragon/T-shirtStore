const User = require("../models/user");
const Order = require("../models/order");
const { request } = require("express");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  
  req.profile.salt = undefined;
  req.profile.encry_password =  undefined;  
  return res.json(req.profile);
 
};
exports.userPurchaseList = (req,res) =>{

}
exports.getUserUpdate = (req, res) => {
  User.findByIdAndUpdate(
    { _id : req.profile.id},
    { $set : req.body},
    {new : true, useFindAndModify : false },
     (error, user) =>{
       if(error){
         return res.status(400).json({
           error: "Not authorized to update this info"
         })
       }
       user.salt = undefined;
       user.encry_password =  undefined; 
       res.json(user);

  })
}
exports.userPurchaseList = (req, res) =>{
  Order.find({
    user : req.profile._id
  }).populate("user", "_id name" )
  .exec( (err ,order) =>{
    if(err){
      return res.status(400).json({ error : "No Order in this account"})
    }
    return res.json(order);
  })  
}
exports.pushOrderInPurchaseList = (req, res, next) =>{
  let purchase =[];
  req.body.order.products.forEach(product =>{
      purchase.push({
        _id : product._id,
        name : product.name,
        description: product.description,
        category : product.category,
        quantity : product.quantity,
        amount : request.body.order.amount,
        trasaction_id: product.request.body.order.trasaction_id
       })
  }) 
  // Store in DB
  User.findOneAndUpdate(
    { _id : request.profile._id},
    { $push : {purchases : purchase}},
    { new: true},
    (err, purchase ) =>{
      if(err){
        return res.status(400).json({ error: "unable to save purchase list"})
      }
    }
  )
  next();
}
// exports.getAllUser = (req, res) =>{

//   User.find().exec((err, users) =>{
//     if(err || !users){
//       return res.status(400).json({
//         error: "No User Found"
//       })
//     }
//    return res.json(users);
//   } )

// }

