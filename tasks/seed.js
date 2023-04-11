// TODO: Seed file for testing purposes
import {createCourt} from '../data/courts.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';

// TODO: Open Db Connection
const db = await dbConnection();
// !DUMP DB : (careful)
await db.dropDatabase();

// TODO: Seed Users

// TODO: Seed Courts
let court = await createCourt("Court1");
console.log(court);

//TODO Verify User

// TODO: Seed Groups

// TODO: Seed Friends

// TODO: Close Connection
await closeConnection();
console.log('\nDone!');






