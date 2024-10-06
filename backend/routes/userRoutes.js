const express = require("express");
const router = express.Router();
// import controllers

const {
  registerUser,
  authUser,
  allUser,
} = require("../controllers/userControllers");
const{protect} =require("../middleware/authMiddleware");



router.post('/',registerUser);
router.get('/',protect,allUser);
router.post('/login',authUser);

module.exports = router;