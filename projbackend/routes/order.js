const express = require("Express");
const router = express.Router();

const { getUserById ,pushOrderInPurchaseList} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {updateStock } = require("../controllers/product");
const {getOrderById, createOrder,  getAllOrders, getOrderStatus ,updateStatus} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Router
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder );

router.get("order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders );

//Status of ORder
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);


module.exports =router;

