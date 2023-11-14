import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // throw new Error('Oh no!');
  } catch (err) {
    // handle the error
    if (err instanceof Error) {
      console.log(err.name); // the type of error
      console.log(err.message); // the description of the error
      console.log(err.stack); // the stack trace of the error
      process.exit(1);
    } else {
      console.log('Unknown error');
      process.exit(1);
    }
  }
};

export default connectDB;
