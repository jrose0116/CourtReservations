//import moment from 'moment';

let makeReservationForm = document.getElementById("makeReservationForm");

let selectedDate = document.getElementById("selectedDate");
let startTime = document.getElementById("startTime");
let endTime = document.getElementById("endTime");
let capacity = document.getElementById("capacity");

let errorDiv = document.getElementById("error");

if (makeReservationForm) {
  makeReservationForm.addEventListener("submit", (event) => {
    try {
      console.log("Reservation Form fired");
      errorDiv.innerHTML = "";
      if (capacity.value == 6) throw "6";
    } catch (e) {
      console.log(e);
      event.preventDefault();
      //errorDiv.innerHTML = 'Invalid Input: ' + e;
      errorDiv.hidden = false;
      errorDiv.innerHTML = e;
    }
  });
}
