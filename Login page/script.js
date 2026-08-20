/* =========================================================
   YOURHOME LOGIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginForm = document.getElementById("loginForm");

    const emailInput = document.getElementById("email");

    const passwordInput = document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const rememberMe =
        document.getElementById("rememberMe");

    const loginButton =
        document.querySelector(".login-button");

    const forgotPassword =
        document.querySelector(".forgot-password");

    const registerLink =
        document.querySelector(".register-section a");

    const socialButtons =
        document.querySelectorAll(".social-button");

    const backgroundVideo =
        document.getElementById("backgroundVideo");


    /* =====================================================
       TOAST SYSTEM
    ===================================================== */

    function showToast(message, type = "success") {

        let toast = document.querySelector(".toast");

        /* Create toast if it doesn't exist */
        if (!toast) {

            toast = document.createElement("div");

            toast.className = "toast";

            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fa-solid fa-check"></i>
                </div>

                <div class="toast-content">
                    <strong>Notification</strong>
                    <p></p>
                </div>

                <button class="toast-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            document.body.appendChild(toast);

            toast.querySelector(".toast-close")
                .addEventListener("click", () => {
                    hideToast();
                });
        }


        const icon =
            toast.querySelector(".toast-icon i");

        const title =
            toast.querySelector(".toast-content strong");

        const text =
            toast.querySelector(".toast-content p");


        /* Remove previous type */
        toast.classList.remove(
            "success",
            "error",
            "warning"
        );


        /* Set notification */
        if (type === "success") {

            title.textContent = "Success";

            icon.className =
                "fa-solid fa-circle-check";

        }

        else if (type === "error") {

            title.textContent = "Error";

            icon.className =
                "fa-solid fa-circle-exclamation";

        }

        else {

            title.textContent = "Notice";

            icon.className =
                "fa-solid fa-circle-info";
        }


        toast.classList.add(type);

        text.textContent = message;

        toast.classList.add("show");


        /* Automatically hide */
        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(() => {

            hideToast();

        }, 3500);
    }


    function hideToast() {

        const toast =
            document.querySelector(".toast");

        if (toast) {

            toast.classList.remove("show");

        }
    }


    /* =====================================================
       SHOW / HIDE PASSWORD
    ===================================================== */

    if (passwordToggle) {

        passwordToggle.addEventListener("click", () => {

            const isPassword =
                passwordInput.type === "password";


            if (isPassword) {

                passwordInput.type = "text";

                passwordToggle.innerHTML =
                    '<i class="fa-regular fa-eye-slash"></i>';

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {

                passwordInput.type = "password";

                passwordToggle.innerHTML =
                    '<i class="fa-regular fa-eye"></i>';

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    function validateEmail(showMessage = true) {

        const email =
            emailInput.value.trim();


        if (email === "") {

            if (showMessage) {

                showInputError(
                    emailInput,
                    "Email is required."
                );

            }

            return false;
        }


        if (!isValidEmail(email)) {

            if (showMessage) {

                showInputError(
                    emailInput,
                    "Please enter a valid email."
                );

            }

            return false;
        }


        clearInputError(emailInput);

        return true;
    }


    /* =====================================================
       PASSWORD VALIDATION
    ===================================================== */

    function validatePassword(showMessage = true) {

        const password =
            passwordInput.value;


        if (password === "") {

            if (showMessage) {

                showInputError(
                    passwordInput,
                    "Password is required."
                );

            }

            return false;
        }


        if (password.length < 6) {

            if (showMessage) {

                showInputError(
                    passwordInput,
                    "Password must contain at least 6 characters."
                );

            }

            return false;
        }


        clearInputError(passwordInput);

        return true;
    }


    /* =====================================================
       INPUT ERROR
    ===================================================== */

    function showInputError(input, message) {

        input.classList.add("input-error");

        let error =
            input.parentElement.parentElement
            .querySelector(".input-error-message");


        if (!error) {

            error =
                document.createElement("small");

            error.className =
                "input-error-message";

            input.parentElement.parentElement
                .appendChild(error);
        }


        error.textContent = message;

    }


    function clearInputError(input) {

        input.classList.remove("input-error");

        const error =
            input.parentElement.parentElement
            .querySelector(".input-error-message");


        if (error) {

            error.remove();

        }
    }


    /* =====================================================
       REAL-TIME EMAIL VALIDATION
    ===================================================== */

    emailInput.addEventListener("input", () => {

        if (emailInput.value.trim() === "") {

            clearInputError(emailInput);

            return;
        }


        if (isValidEmail(emailInput.value.trim())) {

            clearInputError(emailInput);

        }

    });


    /* =====================================================
       PASSWORD INPUT FEEDBACK
    ===================================================== */

    passwordInput.addEventListener("input", () => {

        if (passwordInput.value.length > 0) {

            clearInputError(passwordInput);

        }

    });


    /* =====================================================
       REMEMBER ME
    ===================================================== */

    const savedEmail =
        localStorage.getItem("yourhome_email");


    if (savedEmail) {

        emailInput.value = savedEmail;

        rememberMe.checked = true;

    }


    /* =====================================================
       LOGIN SUBMIT
    ===================================================== */

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const emailValid =
            validateEmail(true);

        const passwordValid =
            validatePassword(true);


        if (!emailValid || !passwordValid) {

            showToast(
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }


        /* Remember email */
        if (rememberMe.checked) {

            localStorage.setItem(
                "yourhome_email",
                emailInput.value.trim()
            );

        }

        else {

            localStorage.removeItem(
                "yourhome_email"
            );

        }


        /* Prevent double click */

        if (loginButton.disabled) {

            return;

        }


        loginButton.disabled = true;

        loginButton.classList.add("loading");


        /* Save original button */
        const originalButton =
            loginButton.innerHTML;


        loginButton.innerHTML = `
            <span class="login-loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Signing in...
            </span>
        `;


        /*
         * Simulated login request.
         *
         * Replace this section later with
         * your actual backend API.
         */

        await new Promise(resolve => {

            setTimeout(resolve, 1500);

        });


        /* Login success */

        loginButton.classList.remove("loading");

        loginButton.disabled = false;

        loginButton.innerHTML =
            originalButton;


        showToast(
            "Login successful! Welcome back.",
            "success"
        );


        /*
         * Later you can redirect:
         *
         * window.location.href = "dashboard.html";
         */

    });


    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();


        const email =
            emailInput.value.trim();


        if (!email) {

            emailInput.focus();

            showToast(
                "Enter your email first to reset your password.",
                "warning"
            );

            return;
        }


        if (!isValidEmail(email)) {

            showToast(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        showToast(
            `Password reset instructions will be sent to ${email}.`,
            "success"
        );

    });


    /* =====================================================
       REGISTER
    ===================================================== */

    registerLink.addEventListener("click", (event) => {

        event.preventDefault();


        showToast(
            "Opening the registration page...",
            "success"
        );


        /*
         * Replace with:
         *
         * window.location.href = "register.html";
         */

    });


    /* =====================================================
       GOOGLE / MICROSOFT LOGIN
    ===================================================== */

    socialButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const text =
                button.textContent.trim();


            if (text.includes("Google")) {

                showToast(
                    "Google login will open here.",
                    "success"
                );

            }

            else if (text.includes("Microsoft")) {

                showToast(
                    "Microsoft login will open here.",
                    "success"
                );

            }

        });

    });


    /* =====================================================
       BACKGROUND VIDEO
    ===================================================== */

    if (backgroundVideo) {

        /* Make sure video starts */
        backgroundVideo.play()
            .catch(() => {

                console.log(
                    "Autoplay was blocked by the browser."
                );

            });


        /* If video cannot load */
        backgroundVideo.addEventListener(
            "error",
            () => {

                document.querySelector(
                    ".video-background"
                ).classList.add("video-error");

                showToast(
                    "Background video could not be loaded.",
                    "warning"
                );

            }
        );


        /*
         * Pause video when browser tab
         * is not visible.
         */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    backgroundVideo.pause();

                }

                else {

                    backgroundVideo.play()
                        .catch(() => {});

                }

            }
        );

    }


    /* =====================================================
       INPUT FOCUS ANIMATION
    ===================================================== */

    const inputs =
        document.querySelectorAll(
            ".input-wrapper input"
        );


    inputs.forEach((input) => {

        input.addEventListener(
            "focus",
            () => {

                input.parentElement
                    .classList.add("focused");

            }
        );


        input.addEventListener(
            "blur",
            () => {

                input.parentElement
                    .classList.remove("focused");

            }
        );

    });


    /* =====================================================
       ENTER KEY SUPPORT
    ===================================================== */

    passwordInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                loginForm.requestSubmit();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                hideToast();

            }

        }
    );


    /* =====================================================
       INITIAL MESSAGE
    ===================================================== */

    console.log(
        "YourHome Login System initialized successfully."
    );

});


const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const loginMessage = document.getElementById("loginMessage");

const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const loadingText = document.getElementById("loadingText");

const togglePassword = document.getElementById("togglePassword");


// ===============================
// EMAIL VALIDATION
// ===============================

function validateEmail(email) {

    const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
}


// ===============================
// CLEAR ERRORS
// ===============================

function clearErrors() {

    emailError.textContent = "";
    passwordError.textContent = "";

    document.querySelectorAll(".input-box").forEach(box => {
        box.classList.remove("error");
        box.classList.remove("success");
    });

    loginMessage.textContent = "";
    loginMessage.className = "login-message";
}


// ===============================
// EMAIL REAL-TIME VALIDATION
// ===============================

emailInput.addEventListener("input", function () {

    const email = emailInput.value.trim();

    if (email === "") {

        emailError.textContent = "Email is required";

        emailInput.parentElement.classList.add("error");
        emailInput.parentElement.classList.remove("success");

    } else if (!validateEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address";

        emailInput.parentElement.classList.add("error");
        emailInput.parentElement.classList.remove("success");

    } else {

        emailError.textContent = "";

        emailInput.parentElement.classList.remove("error");
        emailInput.parentElement.classList.add("success");
    }
});


// ===============================
// PASSWORD VALIDATION
// ===============================

passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    if (password === "") {

        passwordError.textContent = "Password is required";

        passwordInput.parentElement.classList.add("error");
        passwordInput.parentElement.classList.remove("success");

    } else {

        passwordError.textContent = "";

        passwordInput.parentElement.classList.remove("error");
        passwordInput.parentElement.classList.add("success");
    }
});


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";
    }
});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let valid = true;


    // Check email

    if (email === "") {

        emailError.textContent = "Email is required";

        emailInput.parentElement.classList.add("error");

        valid = false;

    } else if (!validateEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address";

        emailInput.parentElement.classList.add("error");

        valid = false;
    }


    // Check password

    if (password === "") {

        passwordError.textContent =
            "Password is required";

        passwordInput.parentElement.classList.add("error");

        valid = false;
    }


    // Stop if basic validation fails

    if (!valid) {
        return;
    }


    // ===============================
    // GET REGISTERED USER
    // ===============================

    const registeredUser =
        JSON.parse(localStorage.getItem("registeredUser"));


    // No registered account

    if (!registeredUser) {

        loginMessage.textContent =
            "No account found. Please register first.";

        loginMessage.classList.add("error");

        return;
    }


    // ===============================
    // CHECK EMAIL
    // ===============================

    if (email !== registeredUser.email.toLowerCase()) {

        emailError.textContent =
            "This email is not registered.";

        emailInput.parentElement.classList.add("error");

        return;
    }


    // ===============================
    // CHECK PASSWORD
    // ===============================

    if (password !== registeredUser.password) {

        passwordError.textContent =
            "Incorrect password.";

        passwordInput.parentElement.classList.add("error");

        return;
    }


    // ===============================
    // LOGIN SUCCESS
    // ===============================

    loginBtn.disabled = true;

    loginText.style.display = "none";
    loadingText.style.display = "inline";


    loginMessage.textContent =
        "Login successful! Redirecting...";

    loginMessage.classList.add("success");


    // Save login status

    localStorage.setItem("isLoggedIn", "true");


    // Redirect after 1.5 seconds

    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1500);

});