import mongoose from "mongoose";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DBNAME,
    });
    console.log("Connecté à MongoDB");
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err);
  }
};

module.exports=connectMongo;