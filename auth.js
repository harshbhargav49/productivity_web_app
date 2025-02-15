// Function to toggle between login and sign-up
function showLogin() {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");
}

function showSignup() {
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
}

// Function for User Sign-Up
function signup() {
    let name = document.getElementById("signupName").value;
    let email = document.getElementById("signupEmail").value;
    let password = document.getElementById("signupPassword").value;
    let errorMsg = document.getElementById("signupError");

    if (!name || !email || !password) {
        errorMsg.textContent = "All fields are required!";
        return;
    }

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        errorMsg.textContent = "Email is already registered!";
        return;
    }

    // Save user details
    users.push({ name, email, password });
    // localStorage.setItem("users", JSON.stringify(users));

    let URL = `${SERVER.HOST}${SERVER.SERVER_BASEURL}:${SERVER.PORT}${AUTH.SIGNUP}`

    let body = { name: name, email: email, password: password }

    let method = "POST"
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    fetch(URL, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Success:', responseData);
            alert("Sign-Up Successful! You can now log in.");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Erro: 404");
        });

    showLogin();

}

// Function for User Login
function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let errorMsg = document.getElementById("loginError");
    let loginBtn = document.getElementById("myButton");
    

    if (!email || !password) {
        errorMsg.textContent = "All fields are required!";
        return;
    }

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let validUser = users.find(user => user.email === email && user.password === password);

    // Save user details
    users.push({ email, password });
    // localStorage.setItem("users", JSON.stringify(users));
    let URL = `${SERVER.HOST}${SERVER.SERVER_BASEURL}:${SERVER.PORT}${AUTH.LOGIN}`
    let body = { email: email, password: password }

    let method = "POST"
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    loginBtn.disabled = true;
    loginBtn.innerText = "Loading...";

    fetch(URL, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Success:', responseData);
            
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";

            localStorage.setItem("token", responseData.token)
            localStorage.setItem("isUserIn", true)

            window.location.href = "/index.html"; 

        })
        .catch(error => {
            console.error('Error:', error);
            loginBtn.disabled = false;
            loginBtn.innerText = "Login";
            alert("User Not Found! Please Sign-Up");
        });

    showLogin();
}

function logout() {
    localStorage.clear("isUserIn")
    localStorage.clear("token")
    window.location.href = "login.html"
}
