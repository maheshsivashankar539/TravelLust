const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./reviews")
const user=require("./user");
const { required } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required: true,
    },
    description:String,
    image: {   
        url:String,
        filename:String,
      },    
    location:String,
    price:Number,
    country:String,

});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;