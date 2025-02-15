if (localStorage.getItem("isUserIn") !== "true") {
    // Redirect only if we're not already on login.html
    if (!window.location.href.includes("login.html")) {
        window.location.href = "login.html";
    }
}