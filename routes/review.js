const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const Review=require("../models/reviews");
const Listing=require("../models/listing");
const { isReviewAuthor, validateReview, isLogedIn } = require("../middleware");

const reviewController=require("../controller/review");

//post 
router.post("/",validateReview,wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
