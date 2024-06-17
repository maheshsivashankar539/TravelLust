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
    owner:
    {
        type: Schema.Types.ObjectId,
        ref:"user",
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
        }
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in :listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;