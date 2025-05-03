import mongoose from "mongoose";

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) => {
  console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db("myDB");

export { client };
