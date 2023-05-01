let loginForm = document.getElementById("login-form");
let emailAddress = document.getElementById("emailAddressInput");
let password = document.getElementById("passwordInput");
let errorDiv = document.getElementById("error-div");

const validEmail = (email) => {
  validStr(email);
  email = email.trim();
  let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    throw "Error: Invalid email address";
  }
  return email;
};

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    console.log("login submit js!!!!!!");

    errorDiv.hidden = false;
    errorDiv.innerHTML = "";
    let emptyEmail = false;
    let emptyPassword = false;

    if (emailAddress.value.trim() === "") {
      console.log("empty");
      event.preventDefault();
      emptyEmail = true;
      let message = document.createElement("p");
      message.innerHTML = "Email is required";
      errorDiv.appendChild(message);
    }

    if (!emptyEmail) {
      try {
        emailAddress.value = validEmail(emailAddress.value);
      } catch (e) {
        event.preventDefault();
        let message = document.createElement("p");
        message.innerHTML = "Email is not valid";
        errorDiv.appendChild(message);
      }
    }

    if (password.value.trim() === "") {
      event.preventDefault();
      emptyPassword = true;
      let message = document.createElement("p");
      message.innerHTML = "Password is required";
      errorDiv.appendChild(message);
    }

    // if (!emptyPassword) {
    //     try {
    //         password.value = checkPassword(password.value);
    //     }
    //     catch (e) {
    //         event.preventDefault();
    //         let message = document.createElement('p');
    //         message.innerHTML = "Password is not valid"
    //         errorDiv.appendChild(message);
    //     }
    // }
  });
}
