import express from 'express'
import userRouter from "./routes/user.routes.js "
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from './mongodb/connect.js';
import session from "express-session"

dotenv.config();
const app=express()
app.use(session({ secret: 'key', cookie: { maxAge: 160000 }}))
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.use("/api/v1/users", userRouter);

  connectDB(process.env.MONGO_URL)

  app.listen(process.env.PORT, () => {
    console.log(`Now listening on port ${process.env.PORT}`);
  });