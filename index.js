import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

//-----------------------------

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => {
      console.log("Servidor en puerto " + process.env.PORT);
    });
  })
  .catch(err => console.log(err));
