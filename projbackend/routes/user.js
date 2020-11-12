const express = require("express");
const router = express.Router();

const { getUserById, getUser, getUserUpdate,  userPurchaseList} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// router.get("/getUser", getAllUser);

router.put("/user/:userId", isSignedIn, isAuthenticated, getUserUpdate);
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
