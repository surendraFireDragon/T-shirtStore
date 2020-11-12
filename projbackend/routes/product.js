const express = require("Express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, createProduct, getProduct, photo,deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product");

router.param("userId", getUserById);
router.param("productId", getProductById);

// all actual router
router.get("/product/:productId", getProductById);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin , createProduct);

router.delete("/product/:productId/:userId", isSignedIn, isAdmin, isAuthenticated, deleteProduct );

router.put("/product/:productId/:userId", isSignedIn, isAdmin, isAuthenticated, updateProduct );

router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
