const express=require("express");
const router=express.Router();
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const {isLogedIn,isOwner, validateListing}=require("../middleware");
const multer  = require('multer')
const {storage}=require("../cloudConfig");
const upload = multer({storage});
const listingController=require("../controller/listing")

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLogedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLogedIn,listingController.renderListing);

//search route
router.post("/search",wrapAsync(listingController.searchListing));

//show route
router.route("/:id").get( wrapAsync(listingController.showListing)).put(isLogedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)).delete(isLogedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(listingController.editListing));

module.exports=router;