// Ensures that the user can only enter one screen (Login / Sign Up) at a time
let screenActive = false;
function enterScreen() {
    return (screenActive ? false : screenActive = true);
}

// Runs the login animation and loads the appropriate div
function logIn() {
    if (!enterScreen()) return;
    let content = $(".container");
    content.find("#main").fadeOut(400);
    content.find("#login").delay(500).fadeIn(200, function() {
        screenActive = false;
    });
}

// Runs the signup animation and loads the appropriate div
function signUp() {
    if (!enterScreen()) return;
    let content = $(".container");
    content.find("#main").fadeOut(400);
    content.find("#signup").delay(500).fadeIn(200, function() {
        screenActive = false;
    });
}

// Hides open divs and brings the user back to the main page
function returnHome() {
    let content = $(".container");
    content.find("#login").fadeOut(400);
    content.find("#signup").fadeOut(400);
    content.find("#main").delay(500).fadeIn(200, function() {
        screenActive = false;
    });
}

function showContactForm() {
    if (!enterScreen()) return;
    let content = $(".container");
    content.find("#contact-handler").fadeOut(400);
    content.find("#contact-holder").fadeOut(400);
    content.find("#add-contact-form").delay(500).fadeIn(200, function() {
        screenActive = false;
    });
}

$(document).ready(function() {
    $("#loginButton").on("click", logIn);
    $("#signupButton").on("click", signUp);
    $("#addContactButton").on("click", showContactForm);
});