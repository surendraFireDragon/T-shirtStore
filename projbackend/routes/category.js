const express= require("express");
const router = express.Router();

// const {} = require("../models/category");
const { getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory } = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes for category
router.post("/category/create/:userId",isSignedIn, isAuthenticated, isAdmin, createCategory);

router.get("/category/:catgoryId", getCategory);
router.get("/categories", getAllCategory);

router.put("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, updateCategory);

router.delete("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, removeCategory);


module.exports = router