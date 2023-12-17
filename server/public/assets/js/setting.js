function previewImage(event) {
    const input = event.target;
    const profilePicture = document.getElementById('profilePicture');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            profilePicture.querySelector('img').src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function saveChanges() {
    event.preventDefault(); // Prevent the default form submission

    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    const nameValue = document.getElementById('name').value;

    // Create a FormData object to store the form data
    const formData = new FormData(document.getElementById("adminPostForm"));

    // Send the form data using an AJAX request
    fetch('/administrator/posts', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Data was successfully stored in the database
                return response.text();
            } else {
                throw new Error('Data was not stored in the database');
            }
        })
        .then(data => {
            // Display a success message for a specific duration
            Swal.fire({
                icon: 'success',
                title: 'Saved Successfully',
                text: 'Your changes have been saved successfully!',
                showConfirmButton: false,
            });

            // Automatically close the success message and reload the page after 3 seconds (3000 milliseconds)
            setTimeout(() => {
                Swal.close();
                location.reload(); // Reload the page
            }, 1700);
        })
        .catch(error => {
            // Handle any errors here
            console.error(error);
        });
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const passwordStrengthIndicator = document.getElementById('passwordStrength');

    // Define your password strength criteria here
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;

    if (password.length >= minLength) {
        strength++;
    }

    if (hasUppercase) {
        strength++;
    }

    if (hasLowercase) {
        strength++;
    }

    if (hasNumber) {
        strength++;
    }

    if (hasSpecialChar) {
        strength++;
    }

    // Update the password strength indicator
    switch (strength) {
        case 0:
        case 1:
            passwordStrengthIndicator.innerHTML = 'Weak';
            passwordStrengthIndicator.style.color = '#d9534f'; // Red color
            break;
        case 2:
            passwordStrengthIndicator.innerHTML = 'Moderate';
            passwordStrengthIndicator.style.color = '#f0ad4e'; // Orange color
            break;
        case 3:
        case 4:
        case 5:
            passwordStrengthIndicator.innerHTML = 'Strong';
            passwordStrengthIndicator.style.color = '#5bc0de'; // Blue color
            break;
        default:
            break;
    }
    // Validate the password and enable/disable the "Save Changes" button

    if (password.length < minLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        passwordError.innerHTML = 'Password must be at least 8 characters long and contain: ';
        passwordError.innerHTML += `<span class="requirement-item">one uppercase letter,</span>`;
        passwordError.innerHTML += `<span class="requirement-item">one lowercase letter,</span>`;
        passwordError.innerHTML += `<span class="special-char">one special character,</span>`;
        passwordError.innerHTML += `<span class="requirement-item">and one number.</span>`;
        saveButton.disabled = true;
    } else {
        passwordError.innerHTML = '';
        saveButton.disabled = false;
    }

}


function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');

    // Toggle the type attribute of the password input
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Change the eye icon based on the password visibility
    passwordToggle.innerHTML = type === 'password' ? '&#x1F512;' : '&#x1F513;';
}