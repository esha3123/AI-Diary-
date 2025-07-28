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
        await DiaryEntry.insertMany(sampleEntries.data);
        console.log("data was initialized");
    } catch (error) {
        console.log("Error initializing data:", error);
    }
}