const mongoose= require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");

const mongo_url="mongodb://127.0.0.1:27017/travellust";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"665f375666785463a1f18a8f"})),
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();