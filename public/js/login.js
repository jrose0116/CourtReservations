let loginForm = document.getElementById("login-form");
let emailAddress = document.getElementById("emailAddressInput");
let password = document.getElementById("passwordInput");
let errorDiv = document.getElementById("error-div");
let serverErrors = document.getElementById("server-errors");

const validStr = (str, varName) => {
	let strName = varName || "String variable";
	if (!str) throw `Error: ${strName} not provided`;
	if (typeof str !== "string" || str.trim().length === 0)
		throw `Error: ${strName} must be a non-empty string.`;
	str = str.trim();
	return str;
};

const validEmail = (email) => {
  validStr(email, "Email");
  email = email.trim();
  let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    throw "Error: Invalid email address";
  }
  return email;
};

const checkPassword = (password) => {
  validStr(password, "Password");

  if (password.split(" ").length > 1) {
      throw `Error: Password cannot contain spaces`;
  }
  if (password.length < 8) {
      throw `Error: Password length must be at least 8`;
  }
  if (!/[A-Z]/.test(password)) {
      throw `Error: Password must contain at least one uppercase character`;
  }
  if (!/\d/.test(password)) {
      throw `Error: Password must contain at least one number`;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw `Error: Password must contain at least one special character`;
  }
  return password;
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    // console.log("login submit js!!!!!!");

    serverErrors.hidden = true;

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
