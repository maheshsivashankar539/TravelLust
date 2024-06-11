
const Listing=require("../models/listing");
const Review=require("../models/reviews");


//create review
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview.author);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New post was created");
    res.redirect(`/listings/${listing._id}`);
}

//destroy Review
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success","review deleted");

    
    res.redirect(`/listings/${id}`);
};