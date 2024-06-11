const mongoose= require("mongoose");
const Listing=require("../models/listingNew");
const initData=require("./data");

ATLASDB_URL="mongodb+srv://mahesh123:mahesh123@cluster0.atd8l1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(ATLASDB_URL);
}

const initDB=async()=>{
await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();