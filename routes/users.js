var express = require("express");
const userController = require("../controller/user");
const verifyToken = require("../middleware/authmiddleware");
var router = express.Router();

/* GET users listing. */
router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/validateToken", verifyToken, userController.validateToken);

module.exports = router;
