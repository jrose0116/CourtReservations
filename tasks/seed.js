// TODO: Seed file for testing purposes
import {createCourt} from '../data/courts.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import { getSchedule } from '../data/schedule.js';

// TODO: Open Db Connection
const db = await dbConnection();
// !DUMP DB : (careful)
await db.dropDatabase();

// TODO: Seed Users

// TODO: Seed Courts
try {
    let court = await createCourt("Best Field", "basketball", "100 Washington Street", "Hoboken", "NJ", "07030", "8", "50", "100", "9:00", "7:00", "shd");
    let courtId = court._id.toString();
    let sched = await getSchedule(courtId);
    console.log(court);
    console.log(sched);
}
catch (e) {
    console.log(e);
}

//TODO Verify User

// TODO: Seed Groups

// TODO: Seed Friends

// TODO: Close Connection
await closeConnection();
console.log('\nDone!');






