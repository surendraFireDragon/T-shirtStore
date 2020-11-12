const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const ProductCartScheme = new mongoose.Schema({
    product :{
        type : ObjectId,
        ref : "Product"
    },
    name : String,
    count :Number,
    price :Number
});
const ProductCart = mongoose.model("ProductCart", ProductCartScheme);

const OrderSchema =new  mongoose.Schema({
        products:[ ProductCartScheme ],
        trasaction_id: {},
        amount : {
            type : Number
        },
        address:{
            type :String
        },
        updated : Date,
        status:{
            type: String,
            default: "Received",
            enum:["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
        },
        user:{
            type :ObjectId,
            ref: "User"
        }
},
{ timestamps : true});


const Order = mongoose.model("Order", OrderSchema);

module.exports={ Order , ProductCart};