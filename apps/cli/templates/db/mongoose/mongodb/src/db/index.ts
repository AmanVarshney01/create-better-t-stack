import mongoose from 'mongoose';

await mongoose.connect(process.env.DATABASE_URL || "");
const client = mongoose.connection.getClient();

export { client };