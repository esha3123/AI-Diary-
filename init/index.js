const mongoose = require("mongoose");
const sampleEntries = require("./data.js").entries;
const DiaryEntry = require("../models/schema.js");

const mongo_url ="mongodb://127.0.0.1:27017/Dear-diary";

main().then((res)=>{
    console.log("connected-db");
    return initdb(); 
})
.catch((err)=>{
    console.log(err);
});

async function main() {
   await mongoose.connect(mongo_url);
}

const initdb = async()=>{
    try {
        await DiaryEntry.deleteMany({});
        const dataWithOwner = sampleEntries.data.map((obj)=>({
        ...obj , owner:"6891957344c46a7866e69a69"
    }));
        await DiaryEntry.insertMany(dataWithOwner);
        console.log("data was initialized");
    } catch (error) {
        console.log("Error initializing data:", error);
    }
}