const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const User =require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController=require("../controller/user");


router.route("/signup").get(userController.signUpRoute).post(wrapAsync(userController.signInRoute));

router.route("/login").get(userController.logUp).post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),userController.login);

//logout
router.get("/logout",userController.logout);

module.exports=router;