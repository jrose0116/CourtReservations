// TODO: Seed file for testing purposes
import {createCourt, getCourtById, getCourtsByName} from '../data/courts.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import { getSchedule } from '../data/schedule.js';

// TODO: Open Db Connection
const db = await dbConnection();
// !DUMP DB : (careful)
await db.dropDatabase();

let court1 = undefined;
let court2 = undefined;

// TODO: Seed Users

// TODO: Seed Courts
try {
    court1 = await createCourt("Court 1", "basketball", "100 Washington Street", "Hoboken", "NJ", "07030", 8, 50, 100, "09:00", "07:00", "6434bca3a383aa375a96458e");
    let courtId = court1._id.toString();
    let sched = await getSchedule(courtId);
    console.log(court1);
    console.log(sched);
}
catch (e) {
    console.log(e);
}

try {
    court2 = await createCourt("Court 2", "tennis", "500 Jackson Street", "Hoboken", "NJ", "07030", 5, 80, 200, "12:00", "18:00", "6434bca3a383aa375a96458e");
    console.log(court2);
}
catch (e) {
    console.log(e);
}

//TODO Verify User

// TODO: Seed Groups

// TODO: Seed Friends


// find court by id
try {
    let court = await getCourtById(court1._id.toString());
    console.log(court);
}
catch (e) {
    console.log(e);
}

//find court by name
try {
    let court = await getCourtsByName(" cOUrT 2  ");
    console.log(court);
}
catch (e) {
    console.log(e);
}

// TODO: Close Connection
await closeConnection();
console.log('\nDone!');






