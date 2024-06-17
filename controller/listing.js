const { response } = require("express");
const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

//index contorller
module.exports.index=async(req,res)=>{
    let listings= await Listing.find({});
    let currUser=res.locals.currUser;
    res.render("listings/index.ejs",{listings,currUser});
    }

//new listing controller
module.exports.renderListing=(req,res)=>{
    res.render("listings/new.ejs");
}

//show listing controller
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path: "author"}}).populate("owner");
    let currUser=res.locals.currUser;

    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing, currUser});
}

//create listing controller
module.exports.createListing=async(req,res,next)=>{
    let coordinates= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    newListing.geometry=coordinates.body. features[0].geometry;
    newListing.owner=req.user._id;   
    await newListing.save();
        req.flash("success","New Listing was created");
        res.redirect("/listings");    
}

//edit listing controller
module.exports.editListing=async(req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings")
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_25");

    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

//update listing controller
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.filS.filename;
    listing.image={ url,filename};
    listing.save();
}
    req.flash("success","Listing edited");
    res.redirect(`/listings/${id}`);
}

//destroy listing controller
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was deleted");
    console.log(listing);
    res.redirect("/listings");
}