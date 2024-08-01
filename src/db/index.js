import mongoose from "mongoose";
import {DB_name} from "../constants.js"
// const { DB_name } = require("../constants.js");
//  const DB_name ="mytube";

const connectDB= async()=>{
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`\n MONGODB CONNECTED !! DB HOST :${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MONGODB CONNECTION ERROR",error);
        process.exit(1);
    }
}

export default connectDB;

// console.log(connectionInstance) what will be output
// {
//     connection: MongooseConnection {
//       base: Mongoose {
//         connections: [ [Circular] ],
//         models: {},
//         modelSchemas: {},
//         options: {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//           ... // Other Mongoose options
//         },
//         ...
//       },
//       ... // More properties of the MongooseConnection instance
//       host: 'your-mongodb-host',
//       port: your-mongodb-port,
//       user: 'your-mongodb-user',
//       db: Db {
//         _events: {},
//         _eventsCount: 0,
//         ...
//       },
//       ...
//     },
//     ...
//     otherMetadata: ... // Other metadata related to the connection instance
//   }
  