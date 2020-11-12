const { Order , ProductCart} = require("../models/order");

exports.getOrderById = (req, res, next, id)=>{
    Order.findById(id)
    .populate("products.product", "name price")
    .exec( (err , order)=>{
        res.status(400).json({ error :" No orde found in DB"});
        req.order = order ;
        next();
    });
}

exports.createOrder = (req, res)=>{
    req.body.order.user = req.profile;
    const order = new Order();
    order.save( (err, order)=>{
        if(err){
            res.status(400).json({ error : "Falied to save you order in DB"});
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res)=>{
    Order.find()
    .populate("user", "_id name email")
    .exec((err, allOrders)=>{
        if(err){
            res.status(400).json({ error :" No Order Found"});
        }
        res.json(allOrders);
    })
}

exports.getOrderStatus = (req , res)=>{
    res.json(Order.schema.path("status").enumValues);
}
exports.updateStatus = (req , res)=>{
    Order.update(
        {
            _id : req.body.orderId 
        },
        {
            $set : { status : req.body.status }
        },
        (err, order)=>{
            if(err){
                return res.status(400).json({ error : "Failed update the status "})
            } 
            res.json(order);
        }
    
    )
}

