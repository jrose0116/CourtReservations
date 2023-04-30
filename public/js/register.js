let registerForm = document.getElementById('registration-form');

let firstName = document.getElementById('firstNameInput');
let lastName = document.getElementById('lastNameInput');
let emailAddress = document.getElementById('emailAddressInput');
let password = document.getElementById('passwordInput');
let confirmPassword = document.getElementById('confirmPasswordInput');
let role = document.getElementById('roleInput');
let errorDiv = document.getElementById('error-div');

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    //event.preventDefault();
    errorDiv.hidden = false;
    errorDiv.innerHTML = "";
    let emptyFirst = false;
    let emptyLast = false;
    let emptyEmail = false;
    let emptyPassword = false;
    let emptyConfirmPassword = false;

    if (firstName.value.trim() === "") {
        event.preventDefault();
        emptyFirst = true;
        let message = document.createElement('p');
        message.innerHTML = "First name is required"
        errorDiv.appendChild(message);
    }

    if (!emptyFirst) {
        try {
            firstName.value = checkName(firstName.value, "First name");
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "First name is not valid"
            console.log(e)
            errorDiv.appendChild(message);
        }
    }

    if (lastName.value.trim() === "") {
        event.preventDefault();
        emptyLast = true;
        let message = document.createElement('p');
        message.innerHTML = "Last name is required"
        errorDiv.appendChild(message);
    }

    if (!emptyLast) {
        try {
            lastName.value = checkName(lastName.value, "Last name");
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Last name is not valid"
            errorDiv.appendChild(message);        
        }
    }

    if (emailAddress.value.trim() === "") {
        event.preventDefault();
        emptyEmail = true;
        let message = document.createElement('p');
        message.innerHTML = "Email is required"
        errorDiv.appendChild(message);
    }

    if (!emptyEmail) {
        try {
            emailAddress.value = checkEmail(emailAddress.value);
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Email is not valid"
            errorDiv.appendChild(message);        
        }
    }

    if (password.value.trim() === "") {
        event.preventDefault();
        emptyPassword = true;
        let message = document.createElement('p');
        message.innerHTML = "Password is required"
        errorDiv.appendChild(message);
    }

    if (!emptyPassword) {
        try {
            password.value = checkPassword(password.value);
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Password is not valid"
            errorDiv.appendChild(message);        
        }
    }

    if (confirmPassword.value.trim() === "") {
        event.preventDefault();
        emptyConfirmPassword = true;
        let message = document.createElement('p');
        message.innerHTML = "Confirm password is required"
        errorDiv.appendChild(message);
    }

    if (!emptyConfirmPassword) {
        try {
            confirmPassword.value = checkPassword(confirmPassword.value);
        }
        catch (e) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Confirm password is not valid"
            errorDiv.appendChild(message);        
        }
    }

    if (!emptyPassword && !emptyConfirmPassword) {
        if (emptyPassword !== emptyConfirmPassword) {
            event.preventDefault();
            let message = document.createElement('p');
            message.innerHTML = "Password and confirm password do not match"
            errorDiv.appendChild(message);  
        }
    }
  });
}