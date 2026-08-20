document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    const name = document.getElementById("name");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword =
        document.getElementById("confirmPassword");

    const nameError =
        document.getElementById("nameError");

    const usernameError =
        document.getElementById("usernameError");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    const registerMessage =
        document.getElementById("registerMessage");

    const registerButton =
        document.getElementById("registerButton");


    /* ===============================
       VALIDATION FUNCTIONS
    =============================== */

    function validEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    }


    function validUsername(value) {

        return /^[a-zA-Z0-9_]{3,20}$/.test(value);

    }


    function validPassword(value) {

        return value.length >= 8;

    }


    /* ===============================
       PASSWORD SHOW / HIDE
    =============================== */

    function setupPasswordToggle(input, button) {

        button.addEventListener("click", () => {

            const icon = button.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");

            }

        });

    }


    setupPasswordToggle(
        password,
        document.getElementById("togglePassword")
    );


    setupPasswordToggle(
        confirmPassword,
        document.getElementById("toggleConfirmPassword")
    );


    /* ===============================
       FORM SUBMIT
    =============================== */

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        /* Clear previous errors */

        nameError.textContent = "";
        usernameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";

        registerMessage.textContent = "";

        registerMessage.className =
            "register-message";


        let valid = true;


        /* ===============================
           NAME
        =============================== */

        const nameValue =
            name.value.trim();

        if (nameValue.length < 2) {

            nameError.textContent =
                "Please enter your name.";

            valid = false;

        }


        /* ===============================
           USERNAME
        =============================== */

        const usernameValue =
            username.value.trim();

        if (!validUsername(usernameValue)) {

            usernameError.textContent =
                "Username must be 3-20 characters.";

            valid = false;

        }


        /* ===============================
           EMAIL
        =============================== */

        const emailValue =
            email.value.trim().toLowerCase();

        if (!validEmail(emailValue)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* ===============================
           PASSWORD
        =============================== */

        const passwordValue =
            password.value;

        if (!validPassword(passwordValue)) {

            passwordError.textContent =
                "Password must contain at least 8 characters.";

            valid = false;

        }


        /* ===============================
           CONFIRM PASSWORD
        =============================== */

        const confirmPasswordValue =
            confirmPassword.value;

        if (!confirmPasswordValue) {

            confirmPasswordError.textContent =
                "Please confirm your password.";

            valid = false;

        } else if (
            passwordValue !== confirmPasswordValue
        ) {

            confirmPasswordError.textContent =
                "Passwords do not match.";

            valid = false;

        }


        /* Stop if invalid */

        if (!valid) {

            return;

        }


        /* ===============================
           CHECK EXISTING ACCOUNT
        =============================== */

        const existingUser =
            localStorage.getItem("registeredUser");


        if (existingUser) {

            const user =
                JSON.parse(existingUser);


            if (
                user.email.toLowerCase() ===
                emailValue
            ) {

                emailError.textContent =
                    "This email is already registered.";

                return;

            }


            if (
                user.username.toLowerCase() ===
                usernameValue.toLowerCase()
            ) {

                usernameError.textContent =
                    "This username is already taken.";

                return;

            }

        }


        /* ===============================
           CREATE ACCOUNT
        =============================== */

        const user = {

            name: nameValue,

            username: usernameValue,

            email: emailValue,

            password: passwordValue

        };


        localStorage.setItem(
            "registeredUser",
            JSON.stringify(user)
        );


        /* ===============================
           SUCCESS
        =============================== */

        registerMessage.textContent =
            "Account created successfully!";

        registerMessage.className =
            "register-message success";


        registerButton.disabled = true;

        registerButton.classList.add("loading");


        /* ===============================
           REDIRECT TO LOGIN
        =============================== */

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1200);

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const footerLinks =
        document.querySelectorAll(".footer-links a");


    footerLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const target =
                link.getAttribute("href");


            // If the page does not exist yet
            if (!target || target === "#") {

                event.preventDefault();

                showFooterMessage(
                    `${link.textContent.trim()} page is coming soon.`
                );

            }

        });

    });


    /* =========================================
       FOOTER MESSAGE
    ========================================== */

    function showFooterMessage(message) {

        let toast =
            document.getElementById("footerToast");


        // Create toast if it doesn't exist
        if (!toast) {

            toast = document.createElement("div");

            toast.id = "footerToast";

            toast.className = "footer-toast";

            document.body.appendChild(toast);

        }


        toast.textContent = message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }

});