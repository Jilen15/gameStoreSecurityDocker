import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
    console.log("Chargement des variables depuis .env.test");
} else {
    dotenv.config();
    console.log("Chargement des variables depuis .env");
}

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

export default connectMongo;