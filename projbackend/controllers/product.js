
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const product = require("../models/product");
const { sortBy } = require("lodash");


exports.getProductById =  (req, res, next, id) =>{
    Product.findById(id)
    .populate("category")
    .exec( (err, product) =>{
        if(err){
            //Resonse bUG in frontend
            return res.status(400).json({ error: "Product => "+err+" not found"});
        }
        req.product = product;
        next();
    });
    
};

exports.createProduct = (req, res) =>{
    let form =new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({ error: "Field Error"});
        }

        // destructuring the fields
        const {name, description ,price, category, stock} = fields;
        if( !name || !description || !price || !category || !stock)
        {
            return res.status(400).json({ error: "Please include all fields"});
        }
        //TODO: restriction on fields 
        let product = new Product(fields);

        //handling the file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({ error: "File size exceeding 3 mb! "})
            }
            // taking the photo data in product.photo object created in models
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //save to db;
        product.save( (err, product)=>{
            if(err){
                return res.status(400).json({ error : "Saving the t-shirts fail"})
            }
           res.json(product);
        })

    });
}

exports.getProduct = (req, res)=>{
    req.product.photo =undefined;
    res.json(req.product);
}

exports.photo = (req, res, next)=>{
    if(req.product.photo.data){
         res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req, res) =>{
    let product = req.product;
    product.remove( (err, deletedProduct)=>{
        if(err){
            return res.status(400).json({error: " Fail to delete "+deletedProduct+" product" })
        }
        res.json({ 
            error: "Deletion successfully of "+ deletedProduct
        })
    })
}

exports.updateProduct =(req, res)=>{
    let form =new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file)=>{
        if(err){
            return res.status(400).json({ error: "Field Error"});
        }
       
        //updating the products
        let product = req.product;
        product = _.extend(product, fields);

//TODO: restriction on fields 

        //handling the file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({ error: "File size exceeding 3 mb! "})
            }
            // taking the photo data in product.photo object created in models
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        //save to db;
        product.save( (err, product)=>{
            if(err){
                return res.status(400).json({ error : "updation the t-shirts fail"})
            }
           res.json(product);
        })

    });
}

exports.getAllUniqueCategories = (req, res)=>{
    Product.distinct("category", {}, (err, category)=>{
        if(err){
            return res.status(400).json( { error : "No Category Found"});
        }
        res.json(category);
    })
}
//product listing
exports.getAllProducts = (req, res) =>{
    let limit = req.query.limit ? parseInt(eq.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";


    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec( (err, allItems) => {
        if(err){
            return res.status(400).json({error : "No Product Found "})
        }
        res.json(allItems);
    })
}

exports.updateStock = (req, res, next) => {
    let myoperations = req.body.order.products.map( prod => { 
        return {
            updateOne: {
                filter : {_id : prod._id},
                update : {$inc : {stock: -prod.count, sold: +prod.count}}
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) =>{
        if(err){
            return res.status(400).json({ error: "Bulk Operation failed! "});
        }
        next();
    })
}
