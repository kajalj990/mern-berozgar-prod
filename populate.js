import { readFile } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/connection.js";
import Job from "./models/Job.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    const jsonData = JSON.parse(
      await readFile(new URL("./mock-data.json", import.meta.url))
    );
    await Job.create(jsonData);
    console.log("Success!!");
    process.exit(0);
  } catch (error) {
    console.log("Error!!");
    process.exit(1);
  }
};

start();
