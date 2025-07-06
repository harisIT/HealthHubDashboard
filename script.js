// script.js

// --- Global Chart Instances ---
// These variables will hold our Chart.js instances so we can destroy them before re-creating.
let genderChart, departmentChart, statusChart, appointmentsTrendChart, bedOccupancyChart, ageChart, bloodTypeChart;

// --- Global FullCalendar Instance ---
let calendar;

// --- Pagination Variables for Patient Records ---
let currentPatientPage = 1;
const patientsPerPage = 10; // Number of patients to display per page

// --- Utility Functions for Local Storage ---

// Function to safely retrieve data from localStorage.
// It takes a 'key' (string) and an optional 'defaultValue' (array, defaults to empty array).
function getLocalStorageItem(key, defaultValue = []) {
    try {
        // Attempt to retrieve the item from localStorage using the provided key.
        const item = localStorage.getItem(key);
        // Check if the item exists (is not null) and then parse it from JSON string to a JavaScript object.
        // If 'item' is null or parsing fails, return the 'defaultValue'.
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        // If an error occurs during parsing (e.g., malformed JSON in localStorage),
        // log the error to the console for debugging.
        console.error(`Error parsing localStorage item "${key}":`, e);
        // Return the default value to prevent application breakage.
        return defaultValue;
    }
}

// Function to safely store data into localStorage.
// It takes a 'key' (string) and the 'value' (any JavaScript object/array).
function setLocalStorageItem(key, value) {
    try {
        // Convert the JavaScript value to a JSON string before storing it.
        // localStorage can only store strings.
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // If an error occurs during storage (e.g., localStorage full),
        // log the error to the console.
        console.error(`Error setting localStorage item "${key}":`, e);
    }
}

// --- Initial Data Setup (if not present) ---
// This function is crucial for populating the application with default demo data
// (users, patients, appointments) if they don't already exist in localStorage.
// This ensures that the application is immediately usable upon first load or
// after a user clears their browser's local storage.
function initializeDemoData() {
    // Retrieve the 'users' array from localStorage. If it doesn't exist, 'getLocalStorageItem' returns null.
    let users = getLocalStorageItem('users', null);
    // Check if 'users' is null (first time loading) or if the array is empty.
    if (!users || users.length === 0) {
        // Define an array of default user objects. Each object contains username, password, role, and full name.
        const defaultUsers = [
            { username: 'emily.white', password: 'password123', role: 'Doctor', fullName: 'Dr. Emily White' },
            { username: 'john.doe', password: 'password123', role: 'Nurse', fullName: 'John Doe, RN' },
            { username: 'admin', password: 'admin123', role: 'Administrator', fullName: 'System Admin' }
        ];
        // Store these default users into localStorage.
        setLocalStorageItem('users', defaultUsers);
        console.log("Default users initialized.");
    }

    // Initialize 'patients' data following the same logic as 'users'.
    let patients = getLocalStorageItem('patients', null);
    if (!patients || patients.length === 0) {
        // Define an array of default patient objects with various details.
        const defaultPatients = [
            { id: 'P-101', name: 'John Doe', dob: '1985-03-15', gender: 'Male', bloodType: 'O+', department: 'Cardiology', status: 'Stable' },
            { id: 'P-102', name: 'Jane Smith', dob: '1992-11-22', gender: 'Female', bloodType: 'A-', department: 'Emergency', status: 'Critical' },
            { id: 'P-103', name: 'Robert Johnson', dob: '1978-07-01', gender: 'Male', bloodType: 'B+', department: 'Pediatrics', status: 'Admitted' },
            { id: 'P-104', name: 'Emily Davis', dob: '2001-02-28', gender: 'Female', bloodType: 'AB+', department: 'Orthopedics', status: 'Awaiting Discharge' },
            { id: 'P-105', name: 'William Garcia', dob: '1965-09-10', gender: 'Male', bloodType: 'O-', department: 'Oncology', status: 'Under Treatment' },
            { id: 'P-106', name: 'Sophia Miller', dob: '1990-05-20', gender: 'Female', bloodType: 'A+', department: 'General Practice', status: 'Stable' },
            { id: 'P-107', name: 'James Brown', dob: '1975-01-01', gender: 'Male', bloodType: 'B-', department: 'Cardiology', status: 'Under Treatment' },
            { id: 'P-108', name: 'Olivia White', dob: '2000-08-12', gender: 'Female', bloodType: 'O+', department: 'Dermatology', status: 'Stable' },
            { id: 'P-109', name: 'David Wilson', dob: '1988-04-25', gender: 'Male', bloodType: 'AB-', department: 'Pediatrics', status: 'Admitted' },
            { id: 'P-110', name: 'Ava Johnson', dob: '1995-12-03', gender: 'Female', bloodType: 'A-', department: 'Emergency', status: 'Critical' },
            { id: 'P-111', name: 'Daniel Davis', dob: '1970-06-18', gender: 'Male', bloodType: 'O+', department: 'Orthopedics', status: 'Awaiting Discharge' },
            { id: 'P-112', name: 'Mia Garcia', dob: '1982-02-07', gender: 'Female', bloodType: 'B+', department: 'Oncology', status: 'Under Treatment' },
            { id: 'P-113', name: 'Noah Miller', dob: '1998-09-29', gender: 'Male', bloodType: 'A+', department: 'General Practice', status: 'Stable' },
            { id: 'P-114', name: 'Isabella Brown', dob: '1960-03-05', gender: 'Female', bloodType: 'B-', department: 'Cardiology', status: 'Under Treatment' },
            { id: 'P-115', name: 'Liam Wilson', dob: '2005-07-11', gender: 'Male', bloodType: 'O+', department: 'Pediatrics', status: 'Stable' },
            { id: 'P-116', name: 'Charlotte Smith', dob: '1993-10-14', gender: 'Female', bloodType: 'AB+', department: 'Dermatology', status: 'Awaiting Discharge' }
        ];
        setLocalStorageItem('patients', defaultPatients);
        console.log("Default patients initialized.");
    }

    // Initialize 'appointments' data following the same logic.
    let appointments = getLocalStorageItem('appointments', null);
    if (!appointments || appointments.length === 0) {
        // Define an array of default appointment objects.
        const defaultAppointments = [
            { id: 'A-001', patientName: 'Michael Brown', date: '2025-06-13', time: '13:00', doctor: 'Dr. Sarah Lee', department: 'General Practice', reason: 'Follow-up' },
            { id: 'A-002', patientName: 'Olivia Wilson', date: '2025-06-13', time: '14:30', doctor: 'Dr. Alex Kim', department: 'Pediatrics', reason: 'Vaccination' },
            { id: 'A-003', patientName: 'David Miller', date: '2025-06-14', time: '09:00', doctor: 'Dr. Jessica Chen', department: 'Dermatology', reason: 'Rash check-up' },
            { id: 'A-004', patientName: 'Sophia Martinez', date: '2025-06-15', time: '10:00', doctor: 'Dr. Robert Green', department: 'Orthopedics', reason: 'Post-surgery check' },
            { id: 'A-005', patientName: 'James Brown', date: '2025-06-20', time: '11:00', doctor: 'Dr. Emily White', department: 'Cardiology', reason: 'Annual check-up' },
            { id: 'A-006', patientName: 'Liam Wilson', date: '2025-06-20', time: '14:00', doctor: 'Dr. Sarah Lee', department: 'Pediatrics', reason: 'Fever' },
            { id: 'A-007', patientName: 'Ava Johnson', date: '2025-06-21', time: '09:30', doctor: 'Dr. Alex Kim', department: 'Emergency', reason: 'Acute pain' },
            { id: 'A-008', patientName: 'Charlotte Smith', date: '2025-06-22', time: '16:00', doctor: 'Dr. Jessica Chen', department: 'Dermatology', reason: 'Skin irritation' }
        ];
        setLocalStorageItem('appointments', defaultAppointments);
        console.log("Default appointments initialized.");
    }
}


// --- Custom Modals for Alerts/Confirms (replacing native alert/confirm) ---
// Get references to the DOM elements for the custom alert/confirm modal.
const customAlertModal = document.getElementById('custom-alert-modal');
const customAlertTitle = document.getElementById('custom-alert-title');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertOkButton = document.getElementById('custom-alert-ok');
const customAlertCancelButton = document.getElementById('custom-alert-cancel');

// Function to show a custom alert or confirmation dialog.
// This is used instead of browser's native alert/confirm to maintain consistent UI/UX.
// It returns a Promise, allowing asynchronous handling of user's choice (OK/Cancel).
function showCustomDialog(title, message, isConfirm = false) {
    return new Promise((resolve) => {
        // Defensive check: Ensure all modal elements are present before proceeding.
        if (!customAlertModal || !customAlertTitle || !customAlertMessage || !customAlertOkButton || !customAlertCancelButton) {
            console.error("Custom alert modal elements not found.");
            // Fallback to native alert/confirm if modal elements are missing.
            // This ensures functionality even if the HTML structure is incomplete.
            if (isConfirm) {
                resolve(confirm(message)); // Native confirm for confirmation
            } else {
                alert(message); // Native alert for simple alerts
                resolve(true); // Resolve as true for alert (as there's no "cancel")
            }
            return; // Exit the function if elements are missing.
        }

        // Set the title and message content for the modal.
        customAlertTitle.textContent = title;
        customAlertMessage.textContent = message;

        // By default, hide the cancel button.
        customAlertCancelButton.classList.add('hidden');
        // If 'isConfirm' is true, it means it's a confirmation dialog, so show the cancel button.
        if (isConfirm) {
            customAlertCancelButton.classList.remove('hidden');
        }

        // Show the modal by removing the 'hidden' Tailwind class.
        customAlertModal.classList.remove('hidden');

        // Clear any previously attached event listeners to prevent unintended multiple calls.
        customAlertOkButton.onclick = null;
        customAlertCancelButton.onclick = null;

        // Attach an event listener for the OK button.
        customAlertOkButton.onclick = () => {
            customAlertModal.classList.add('hidden'); // Hide the modal.
            resolve(true); // Resolve the Promise with 'true' (user clicked OK).
        };

        // If it's a confirmation dialog, attach an event listener for the Cancel button.
        if (isConfirm) {
            customAlertCancelButton.onclick = () => {
                customAlertModal.classList.add('hidden'); // Hide the modal.
                resolve(false); // Resolve the Promise with 'false' (user clicked Cancel).
            };
        }
    });
}

// --- User Authentication Functions ---

// Function to display messages (e.g., success, error) to the user.
// 'elementId': The ID of the HTML element where the message should be displayed.
// 'message': The text content of the message.
// 'type': The type of message ('info', 'success', 'error') to apply appropriate styling.
function displayMessage(elementId, message, type = 'info') {
    // Get the message element by its ID.
    const messageElement = document.getElementById(elementId);
    // Check if the element exists.
    if (messageElement) {
        // Set the text content of the message element.
        messageElement.textContent = message;
        // Remove any existing styling classes to ensure only the new type's style is applied.
        messageElement.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
        // Apply specific styling based on the message type.
        if (type === 'error') {
            messageElement.classList.add('bg-red-100', 'text-red-700'); // Red background and text for errors.
        } else if (type === 'success') {
            messageElement.classList.add('bg-green-100', 'text-green-700'); // Green for success messages.
        } else { // Default to 'info' type.
            messageElement.classList.add('bg-blue-100', 'text-blue-700'); // Blue for informational messages.
        }
        // Make the message element visible.
        messageElement.classList.remove('hidden');
    }
}

// Handles the login form submission.
function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission behavior (page reload).

    // Get references to the username and password input fields.
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');

    // Retrieve and trim whitespace from the input values. Trimming is crucial
    // to prevent login failures due to accidental leading/trailing spaces.
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Retrieve the list of registered users from localStorage.
    const users = getLocalStorageItem('users');
    // Find a user in the 'users' array that matches both the entered username and password.
    const user = users.find(u => u.username === username && u.password === password);

    // If a matching user is found.
    if (user) {
        // Store the logged-in user's details (username, role, fullName) in localStorage.
        // This acts as a session for keeping the user logged in across pages.
        setLocalStorageItem('loggedInUser', { username: user.username, role: user.role, fullName: user.fullName });
        // Display a success message to the user.
        displayMessage('login-message', 'Login successful! Redirecting...', 'success');
        // Redirect the user to the dashboard page after a short delay.
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // If no matching user is found, display an error message.
        displayMessage('login-message', 'Invalid username or password.', 'error');
    }
}

// Handles the registration form submission.
function handleRegister(event) {
    event.preventDefault(); // Prevent default form submission.

    // Get references to input fields for registration.
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const roleSelect = document.getElementById('reg-role');

    // Retrieve and trim whitespace from the input values.
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;

    // Basic validation for username format.
    // Ensures the username contains a dot (e.g., 'first.last') and has at least two parts.
    if (!username.includes('.') || username.split('.').length < 2) {
        displayMessage('register-message', 'Username format should be like first.last', 'error');
        return; // Stop execution if validation fails.
    }

    // Capitalize the first letter of each part of the username to create a full name.
    // E.g., 'john.doe' becomes 'John Doe'.
    const fullNameParts = username.split('.');
    const fullName = fullNameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    // Retrieve the current list of users from localStorage.
    let users = getLocalStorageItem('users');

    // Check if a user with the entered username already exists.
    if (users.some(u => u.username === username)) {
        displayMessage('register-message', 'Username already exists. Please choose a different one.', 'error');
        return; // Stop execution if username is not unique.
    }

    // Add the new user to the 'users' array.
    users.push({ username, password, role, fullName });
    // Save the updated 'users' array back to localStorage.
    setLocalStorageItem('users', users);
    // Display a success message.
    displayMessage('register-message', 'Registration successful! You can now log in.', 'success');

    // Clear the form fields after successful registration.
    usernameInput.value = '';
    passwordInput.value = '';
    roleSelect.value = 'doctor'; // Reset role to default.

    // Redirect to the login page after a short delay.
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Handles the forgot password form submission.
function handleForgotPassword(event) {
    event.preventDefault(); // Prevent default form submission.

    const usernameInput = document.getElementById('recover-username');
    const username = usernameInput.value.trim(); // Get and trim the username.

    const users = getLocalStorageItem('users'); // Get all users.
    const user = users.find(u => u.username === username); // Find the user by username.

    if (user) {
        // If user found, display their password using the custom dialog.
        // In a real application, you would send a password reset email, not display the password directly.
        showCustomDialog('Password Recovery', `Your password for ${user.username} is: "${user.password}". Please log in.`, false);
        usernameInput.value = ''; // Clear the username input.
    } else {
        // If user not found, display an error message.
        displayMessage('forgot-password-message', 'Username not found. Please check the username and try again.', 'error');
    }
}

// Checks authentication status and redirects users accordingly.
// Ensures that only logged-in users can access main application pages and
// redirects logged-in users away from authentication pages.
function checkAuthAndRedirect() {
    // Get the currently logged-in user from localStorage.
    const loggedInUser = getLocalStorageItem('loggedInUser', null);
    // Get the current page filename (e.g., 'login.html', 'index.html').
    const currentPage = window.location.pathname.split('/').pop();
    // Define an array of pages considered authentication-related.
    const authPages = ['login.html', 'register.html', 'forgot_password.html'];

    // If no user is logged in AND the current page is NOT an authentication page.
    if (!loggedInUser && !authPages.includes(currentPage)) {
        // Redirect to the login page.
        window.location.href = 'login.html';
        return false; // Indicate that a redirection occurred.
    }
    // If a user IS logged in AND the current page IS an authentication page.
    else if (loggedInUser && authPages.includes(currentPage)) {
        // Redirect to the dashboard page.
        window.location.href = 'index.html';
        return false; // Indicate that a redirection occurred.
    }
    // If authentication state and current page are consistent (e.g., logged in on a dashboard page,
    // or not logged in on a login/register page).
    return true; // Indicate that no redirection occurred, continue execution.
}

// Updates the displayed current user's full name and role in the header/sidebar,
// and also updates the dynamic avatar with user's initials.
function setupCurrentUserDisplay() {
    // Retrieve the currently logged-in user's data from localStorage.
    const loggedInUser = getLocalStorageItem('loggedInUser', null);

    // Check if a user is logged in.
    if (loggedInUser) {
        // Select all elements whose ID starts with "current-user-display" (e.g., current-user-display-appointments).
        const userDisplays = document.querySelectorAll('[id^="current-user-display"]');
        // Select all elements whose ID starts with "current-user-role" (e.g., current-user-role-appointments).
        const userRoles = document.querySelectorAll('[id^="current-user-role"]');
        // Select all elements with the specific ID "user-initials-avatar".
        const avatarInitialsElements = document.querySelectorAll('[id^="user-initials-avatar"]'); // Use ^="user-initials-avatar" to catch both sidebar and header avatars

        // Update the text content for full name displays across all relevant pages.
        userDisplays.forEach(el => el.textContent = loggedInUser.fullName || loggedInUser.username);
        // Update the text content for role displays across all relevant pages.
        userRoles.forEach(el => el.textContent = loggedInUser.role);

        // --- Logic to calculate and display user initials in the avatar ---
        // Get the full name from the logged-in user object. If full name is not available, use username.
        const fullName = loggedInUser.fullName || loggedInUser.username;
        let initials = ''; // Initialize initials string.

        // Check if full name (or username) exists.
        if (fullName) {
            // Split the full name by space to get individual name parts (e.g., "Dr. Emily White" -> ["Dr.", "Emily", "White"]).
            const nameParts = fullName.split(' ');
            // If there's at least one name part, take the first letter of the first part.
            if (nameParts.length > 0) {
                initials += nameParts[0].charAt(0).toUpperCase(); // Convert to uppercase.
                // If there's more than one name part, take the first letter of the *last* part.
                if (nameParts.length > 1) {
                    initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase(); // Convert to uppercase.
                }
            }
        }
        // Fallback: If initials are still empty (e.g., a very short username or empty fullName),
        // try to use the first letter of the username.
        if (!initials && loggedInUser.username) {
            initials = loggedInUser.username.charAt(0).toUpperCase();
        }
        // Final fallback: If initials are still empty (highly unlikely now), use a default.
        if (!initials) {
            initials = 'US'; // Stands for "User/System" or "Unknown User"
        }

        // Iterate over all found avatar elements and set their text content to the calculated initials.
        avatarInitialsElements.forEach(el => {
            el.textContent = initials;
        });

        // --- Role-based Sidebar Link Visibility ---
        const analyticsLink = document.getElementById('sidebar-analytics-link');
        if (analyticsLink) {
            // Only Administrator and Doctor roles can see Analytics
            if (loggedInUser.role === 'Administrator' || loggedInUser.role === 'Doctor') {
                analyticsLink.classList.remove('hidden');
            } else {
                analyticsLink.classList.add('hidden');
            }
        }
    }
}

// Handles the logout functionality.
function handleLogout() {
    // Remove the 'loggedInUser' item from localStorage, effectively logging out the user.
    setLocalStorageItem('loggedInUser', null);
    // Redirect to the login page.
    window.location.href = 'login.html';
}

// Sets up a toggle functionality for password visibility.
// 'passwordInputId': The ID of the password input field.
// 'toggleButtonId': The ID of the button that toggles visibility.
function setupPasswordToggle(passwordInputId, toggleButtonId) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleButton = document.getElementById(toggleButtonId);

    // Ensure both the input and the button exist before adding the event listener.
    if (passwordInput && toggleButton) {
        toggleButton.addEventListener('click', () => {
            // Determine the new type for the password input: 'text' if currently 'password', 'password' if currently 'text'.
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            // Set the new type attribute for the password input.
            passwordInput.setAttribute('type', type);

            // Get the icon element (assumed to be an 'i' tag inside the button).
            const icon = toggleButton.querySelector('i');
            if (icon) {
                // Toggle the eye icon based on password visibility.
                if (type === 'password') {
                    icon.classList.remove('ph-eye'); // Remove 'eye' icon.
                    icon.classList.add('ph-eye-slash'); // Add 'eye-slash' icon (hidden).
                } else {
                    icon.classList.remove('ph-eye-slash'); // Remove 'eye-slash' icon.
                    icon.classList.add('ph-eye'); // Add 'eye' icon (visible).
                }
            }
        });
    }
}

// --- Common Modal Handling for all dynamic modals ---
// Centralized function to set up closing behavior for any modal.
// 'modalId': The ID of the modal div element.
function setupModalHandling(modalId) {
    const modal = document.getElementById(modalId);
    // Ensure the modal element exists.
    if (modal) {
        // Select all elements within this modal that have the class 'close-modal-button'.
        const closeButtons = modal.querySelectorAll('.close-modal-button');
        // Add a click event listener to each close button.
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.add('hidden'); // Hide the modal.
                // Find and reset any form within the modal to clear its fields.
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                }
            });
        });

        // Add a click event listener to the modal itself (the backdrop).
        modal.addEventListener('click', (event) => {
            // If the click target is exactly the modal (not a child element within the modal content).
            if (event.target === modal) {
                modal.classList.add('hidden'); // Hide the modal.
                // Reset any form within the modal.
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                }
            }
        });
    }
}

// --- Settings Page Logic: Profile Update ---
// Initializes the profile settings form and handles its submission.
function setupProfileSettings() {
    // Get references to the profile settings form elements.
    const profileSettingsForm = document.getElementById('profile-settings-form');
    const profileFullNameInput = document.getElementById('profile-full-name');
    const profileUsernameInput = document.getElementById('profile-username'); // Username is disabled/non-editable in UI
    const profileRoleInput = document.getElementById('profile-role'); // Role is disabled/non-editable in UI
    const profileNewPasswordInput = document.getElementById('profile-new-password');
    const profileConfirmPasswordInput = document.getElementById('profile-confirm-password');
    const profileMessage = document.getElementById('profile-message'); // Element to display messages to the user

    // Get the currently logged-in user from localStorage.
    const loggedInUser = getLocalStorageItem('loggedInUser', null);

    // Proceed only if the profile form and a logged-in user exist.
    if (profileSettingsForm && loggedInUser) {
        // Populate the form fields with the current user's data.
        profileFullNameInput.value = loggedInUser.fullName || ''; // Display current full name
        profileUsernameInput.value = loggedInUser.username || ''; // Display current username (disabled)
        profileRoleInput.value = loggedInUser.role || ''; // Display current role (disabled)

        // Add an event listener for the form submission.
        profileSettingsForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission.

            // Get new values from the form inputs.
            const newFullName = profileFullNameInput.value.trim();
            const newPassword = profileNewPasswordInput.value.trim();
            const confirmPassword = profileConfirmPasswordInput.value.trim();

            // Validate new password and confirmation.
            if (newPassword && newPassword !== confirmPassword) {
                displayMessage('profile-message', 'New password and confirmation do not match.', 'error');
                return; // Stop if passwords don't match.
            }

            // Retrieve the full list of users from localStorage.
            let users = getLocalStorageItem('users');
            // Find the index of the current logged-in user in the users array.
            const userIndex = users.findIndex(u => u.username === loggedInUser.username);

            // If the user is found in the array.
            if (userIndex > -1) {
                // Update the user's full name in the 'users' array.
                users[userIndex].fullName = newFullName;

                // If a new password was provided, update it in the 'users' array.
                if (newPassword) {
                    users[userIndex].password = newPassword;
                }

                // Save the modified 'users' array back to localStorage.
                setLocalStorageItem('users', users);

                // IMPORTANT: Also update the 'loggedInUser' object in localStorage.
                // This ensures that the user's details (like full name) are immediately
                // reflected across all pages without requiring a re-login.
                const updatedLoggedInUser = { ...loggedInUser, fullName: newFullName };
                if (newPassword) {
                    updatedLoggedInUser.password = newPassword; // Update password in session as well for demo purposes
                }
                setLocalStorageItem('loggedInUser', updatedLoggedInUser);

                // Display a success message.
                displayMessage('profile-message', 'Profile updated successfully!', 'success');
                // Call setupCurrentUserDisplay() again to refresh the displayed name/role in the header/sidebar.
                setupCurrentUserDisplay();
                // Clear the password fields after successful update for security.
                profileNewPasswordInput.value = '';
                profileConfirmPasswordInput.value = '';

            } else {
                // Should ideally not happen if checkAuthAndRedirect works correctly.
                displayMessage('profile-message', 'Error: User not found for update.', 'error');
            }
        });
    }
}

// Function to load and inject HTML partials into a placeholder.
// 'placeholderId': The ID of the div where the partial HTML will be inserted.
// 'filePath': The path to the HTML partial file (e.g., '_sidebar.html', '_header.html').
// 'callback': An optional function to execute after the HTML content is successfully loaded and injected.
async function loadHtmlPartial(placeholderId, filePath, callback) {
    const placeholder = document.getElementById(placeholderId);
    // Ensure the placeholder element exists on the current page.
    if (placeholder) {
        try {
            // Fetch the HTML content from the specified file path.
            const response = await fetch(filePath);
            // Check if the network request was successful.
            if (!response.ok) {
                // If not successful, throw an error with status text.
                throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
            }
            // Get the response body as plain text (HTML string).
            const html = await response.text();
            // Inject the fetched HTML content into the placeholder element.
            placeholder.innerHTML = html;
            // If a callback function was provided, execute it.
            // This is crucial for initializing JavaScript that depends on the newly injected DOM elements.
            if (typeof callback === 'function') {
                callback();
            }
        } catch (error) {
            // Catch any errors during the fetch or injection process.
            console.error(error);
            // Display a user-friendly error message in the placeholder.
            placeholder.innerHTML = `<p class="text-red-500">Error loading ${filePath}.</p>`;
        }
    }
}

// --- Patient Records Page Logic ---
let filteredPatients = []; // Global to hold current filtered/searched patients
// currentPatientPage is already a global variable declared at the top

function setupPatientRecordsPage() {
    const patientsTableBody = document.getElementById('patients-table-body');
    const addPatientButton = document.getElementById('add-patient-button');
    const newPatientModal = document.getElementById('new-patient-modal');
    const newPatientForm = document.getElementById('new-patient-form');
    const viewPatientModal = document.getElementById('view-patient-modal');
    const editPatientModal = document.getElementById('edit-patient-modal');
    const editPatientForm = document.getElementById('edit-patient-form');
    // const deletePatientButton = document.getElementById('delete-patient-button'); // This button is inside the edit modal, handled there

    const patientSearchInput = document.getElementById('patient-search-input');
    const patientGenderFilter = document.getElementById('patient-gender-filter');
    const patientDepartmentFilter = document.getElementById('patient-department-filter');
    const patientStatusFilter = document.getElementById('patient-status-filter');
    const patientBloodTypeFilter = document.getElementById('patient-bloodtype-filter');
    const resetPatientFiltersButton = document.getElementById('reset-patient-filters');

    const patientPrevPageButton = document.getElementById('patient-prev-page');
    const patientNextPageButton = document.getElementById('patient-next-page');
    const patientPaginationInfo = document.getElementById('patient-pagination-info');

    const loggedInUser = getLocalStorageItem('loggedInUser');
    const currentUserRole = loggedInUser ? loggedInUser.role : '';

    // Role-based visibility for "Add New Patient" button
    if (addPatientButton) {
        if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor') {
            addPatientButton.classList.remove('hidden');
        } else {
            addPatientButton.classList.add('hidden');
        }
    }

    // Function to apply filters and search, then render patients
    function applyPatientFiltersAndRender() {
        let allPatients = getLocalStorageItem('patients');
        const searchTerm = patientSearchInput ? patientSearchInput.value.toLowerCase() : '';
        const genderFilter = patientGenderFilter ? patientGenderFilter.value : '';
        const departmentFilter = patientDepartmentFilter ? patientDepartmentFilter.value : '';
        const statusFilter = patientStatusFilter ? patientStatusFilter.value : '';
        const bloodTypeFilter = patientBloodTypeFilter ? patientBloodTypeFilter.value : '';

        filteredPatients = allPatients.filter(patient => {
            const matchesSearch = !searchTerm || patient.name.toLowerCase().includes(searchTerm) || patient.id.toLowerCase().includes(searchTerm);
            const matchesGender = !genderFilter || patient.gender === genderFilter;
            const matchesDepartment = !departmentFilter || patient.department === departmentFilter;
            const matchesStatus = !statusFilter || patient.status === statusFilter;
            const matchesBloodType = !bloodTypeFilter || patient.bloodType === bloodTypeFilter;

            return matchesSearch && matchesGender && matchesDepartment && matchesStatus && matchesBloodType;
        });

        currentPatientPage = 1; // Always reset to first page on new filter/search
        renderPatientsTable();
    }

    // Function to render the patient table with pagination
    function renderPatientsTable() {
        if (!patientsTableBody) return;

        patientsTableBody.innerHTML = ''; // Clear existing rows before rendering

        const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
        const startIndex = (currentPatientPage - 1) * patientsPerPage;
        const endIndex = startIndex + patientsPerPage;
        const patientsToDisplay = filteredPatients.slice(startIndex, endIndex);

        patientsToDisplay.forEach(patient => {
            const row = patientsTableBody.insertRow();
            const statusClass = patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                                patient.status === 'Critical' ? 'bg-orange-100 text-orange-800' :
                                patient.status === 'Admitted' ? 'bg-blue-100 text-blue-800' :
                                patient.status === 'Awaiting Discharge' ? 'bg-yellow-100 text-yellow-800' :
                                patient.status === 'Under Treatment' ? 'bg-red-100 text-red-800' : '';

            let actionsHtml = `<a href="#" class="text-blue-600 hover:text-blue-900 mr-4 view-patient-btn" data-patient-id="${patient.id}">View</a>`;

            // Conditional rendering of Edit and Delete buttons based on role
            if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor') {
                actionsHtml += `<a href="#" class="text-indigo-600 hover:text-indigo-900 mr-4 edit-patient-btn" data-patient-id="${patient.id}">Edit</a>`;
            }
            if (currentUserRole === 'Administrator') {
                actionsHtml += `<a href="#" class="text-red-600 hover:text-red-900 delete-patient-btn" data-patient-id="${patient.id}">Delete</a>`;
            }

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${patient.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.dob}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.gender}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.bloodType || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.department}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${patient.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${actionsHtml}
                </td>
            `;
        });

        // Update pagination info
        if (patientPaginationInfo) {
            patientPaginationInfo.textContent = `Page ${filteredPatients.length === 0 ? 0 : currentPatientPage} of ${totalPages || 1}`;
        }
        if (patientPrevPageButton) {
            patientPrevPageButton.disabled = currentPatientPage === 1;
        }
        if (patientNextPageButton) {
            patientNextPageButton.disabled = currentPatientPage === totalPages || totalPages === 0;
        }
    }

    // Add event listeners for search and filter controls
    if (patientSearchInput) patientSearchInput.addEventListener('input', applyPatientFiltersAndRender);
    if (patientGenderFilter) patientGenderFilter.addEventListener('change', applyPatientFiltersAndRender);
    if (patientDepartmentFilter) patientDepartmentFilter.addEventListener('change', applyPatientFiltersAndRender);
    if (patientStatusFilter) patientStatusFilter.addEventListener('change', applyPatientFiltersAndRender);
    if (patientBloodTypeFilter) patientBloodTypeFilter.addEventListener('change', applyPatientFiltersAndRender);
    if (resetPatientFiltersButton) {
        resetPatientFiltersButton.addEventListener('click', () => {
            if (patientSearchInput) patientSearchInput.value = '';
            if (patientGenderFilter) patientGenderFilter.value = '';
            if (patientDepartmentFilter) patientDepartmentFilter.value = '';
            if (patientStatusFilter) patientStatusFilter.value = '';
            if (patientBloodTypeFilter) patientBloodTypeFilter.value = '';
            applyPatientFiltersAndRender();
        });
    }

    // Event listeners for pagination buttons
    if (patientPrevPageButton) {
        patientPrevPageButton.addEventListener('click', () => {
            if (currentPatientPage > 1) {
                currentPatientPage--;
                renderPatientsTable(); // Re-render only, filters/search already applied
            }
        });
    }
    if (patientNextPageButton) {
        patientNextPageButton.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
            if (currentPatientPage < totalPages) {
                currentPatientPage++;
                renderPatientsTable(); // Re-render only, filters/search already applied
            }
        });
    }

    // Delegated event listener for patient table action buttons (View, Edit, Delete)
    // IMPORTANT: Attach listener to a stable parent element (patientsTableBody)
    if (patientsTableBody) {
        patientsTableBody.addEventListener('click', async (e) => {
            // Check if the clicked element or its parent is an action button
            const target = e.target.closest('a'); // Use closest to find the 'a' tag

            if (target && target.dataset.patientId) {
                e.preventDefault(); // Prevent default link behavior
                const patientId = target.dataset.patientId;

                if (target.classList.contains('view-patient-btn')) {
                    openViewPatientModal(patientId);
                } else if (target.classList.contains('edit-patient-btn')) {
                    // Check role for edit permission
                    if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor') {
                        openEditPatientModal(patientId);
                    } else {
                        await showCustomDialog('Permission Denied', 'You do not have permission to edit patient records.', false);
                    }
                } else if (target.classList.contains('delete-patient-btn')) {
                    // Check role for delete permission
                    if (currentUserRole === 'Administrator') {
                        handleDeletePatient(patientId);
                    } else {
                        await showCustomDialog('Permission Denied', 'You do not have permission to delete patient records.', false);
                    }
                }
            }
        });
    }


    // Add Patient Form Submission
    if (newPatientForm) {
        newPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newPatient = {
                id: document.getElementById('patient-id').value.trim(),
                name: document.getElementById('patient-name').value.trim(),
                dob: document.getElementById('patient-dob').value,
                gender: document.getElementById('patient-gender').value,
                bloodType: document.getElementById('patient-bloodtype').value,
                department: document.getElementById('patient-department').value,
                status: document.getElementById('patient-status').value
            };

            let patients = getLocalStorageItem('patients');
            if (patients.some(p => p.id === newPatient.id)) {
                await showCustomDialog('Error', 'Patient ID already exists! Please use a unique ID.', false);
                return;
            }
            patients.push(newPatient);
            setLocalStorageItem('patients', patients);
            applyPatientFiltersAndRender(); // Re-filter and render after adding
            newPatientModal.classList.add('hidden');
            newPatientForm.reset();
            await showCustomDialog('Success', 'New patient added successfully!', false);
            const totalPatientsCount = document.getElementById('total-patients-count');
            if (totalPatientsCount) {
                totalPatientsCount.textContent = patients.length.toLocaleString();
            }
            // Trigger analytics chart re-render
            if (document.getElementById('genderDistributionChart')) {
                renderAnalyticsCharts();
            }
        });
    }

    // Edit Patient Form Submission
    if (editPatientForm) {
        editPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const originalId = document.getElementById('edit-patient-original-id').value;
            const updatedPatient = {
                id: document.getElementById('edit-patient-id').value.trim(), // ID is disabled but included for consistency
                name: document.getElementById('edit-patient-name').value.trim(),
                dob: document.getElementById('edit-patient-dob').value,
                gender: document.getElementById('edit-patient-gender').value,
                bloodType: document.getElementById('edit-patient-bloodtype').value,
                department: document.getElementById('edit-patient-department').value,
                status: document.getElementById('edit-patient-status').value
            };

            let patients = getLocalStorageItem('patients');
            const patientIndex = patients.findIndex(p => p.id === originalId);

            if (patientIndex > -1) {
                patients[patientIndex] = updatedPatient;
                setLocalStorageItem('patients', patients);
                applyPatientFiltersAndRender(); // Re-filter and render after editing
                editPatientModal.classList.add('hidden');
                editPatientForm.reset();
                await showCustomDialog('Success', 'Patient record updated successfully!', false);
                // Trigger analytics chart re-render
                if (document.getElementById('genderDistributionChart')) {
                    renderAnalyticsCharts();
                }
            } else {
                await showCustomDialog('Error', 'Patient not found for update.', false);
            }
        });
    }

    // Delete Patient Function
    async function handleDeletePatient(patientId) {
        // Find the actual delete button inside the modal to attach click listener
        const deletePatientButton = document.getElementById('delete-patient-button');
        if (deletePatientButton) { // Ensure button exists before attaching event
            // Temporarily store the patientId to be deleted for the modal's context
            deletePatientButton.dataset.currentPatientId = patientId;

            const confirmDelete = await showCustomDialog('Confirm Deletion', `Are you sure you want to delete patient ID: ${patientId}? This action cannot be undone.`, true);
            if (confirmDelete) {
                let patients = getLocalStorageItem('patients');
                const initialLength = patients.length;
                patients = patients.filter(p => p.id !== patientId);
                if (patients.length < initialLength) {
                    setLocalStorageItem('patients', patients);
                    applyPatientFiltersAndRender(); // Re-filter and render after deletion
                    await showCustomDialog('Success', `Patient ID: ${patientId} deleted successfully!`, false);
                    const totalPatientsCount = document.getElementById('total-patients-count');
                    if (totalPatientsCount) {
                        totalPatientsCount.textContent = patients.length.toLocaleString();
                    }
                    // Trigger analytics chart re-render
                    if (document.getElementById('genderDistributionChart')) {
                        renderAnalyticsCharts();
                    }
                } else {
                    await showCustomDialog('Error', 'Patient not found for deletion.', false);
                }
            }
             // Clear the temporary data attribute
             deletePatientButton.dataset.currentPatientId = '';
        }
    }

    // Initial render when the page loads
    applyPatientFiltersAndRender();
}

// Function to open the "View Patient" modal and populate it with data.
function openViewPatientModal(patientId) {
    const patients = getLocalStorageItem('patients'); // Get all patients.
    const patient = patients.find(p => p.id === patientId); // Find the specific patient.
    const viewPatientModal = document.getElementById('view-patient-modal');
    // If patient found and modal exists.
    if (patient && viewPatientModal) {
        // Populate display elements within the modal with patient's data.
        document.getElementById('view-patient-name-display').textContent = patient.name;
        document.getElementById('view-patient-id-display').textContent = patient.id;
        document.getElementById('view-patient-dob-display').textContent = patient.dob;
        document.getElementById('view-patient-gender-display').textContent = patient.gender;
        document.getElementById('view-patient-bloodtype-display').textContent = patient.bloodType || 'N/A';
        document.getElementById('view-patient-department-display').textContent = patient.department;
        document.getElementById('view-patient-status-display').textContent = patient.status;
        viewPatientModal.classList.remove('hidden'); // Show the modal.
    }
}

// Function to open the "Edit Patient" modal and populate it with data.
function openEditPatientModal(patientId) {
    const patients = getLocalStorageItem('patients'); // Get all patients.
    const patient = patients.find(p => p.id === patientId); // Find the specific patient.
    const editPatientModal = document.getElementById('edit-patient-modal');
    const deletePatientButton = document.getElementById('delete-patient-button'); // Get button within the modal

    // If patient found and modal exists.
    if (patient && editPatientModal) {
        // Store the original patient ID in a hidden field for lookup during save.
        document.getElementById('edit-patient-original-id').value = patient.id;
        // Populate form fields with patient's current data.
        document.getElementById('edit-patient-name').value = patient.name;
        document.getElementById('edit-patient-id').value = patient.id; // Display ID (disabled)
        document.getElementById('edit-patient-dob').value = patient.dob;
        document.getElementById('edit-patient-gender').value = patient.gender;
        document.getElementById('edit-patient-bloodtype').value = patient.bloodType || '';
        document.getElementById('edit-patient-department').value = patient.department;
        document.getElementById('edit-patient-status').value = patient.status;

        // Set visibility and functionality of delete button based on role
        const loggedInUser = getLocalStorageItem('loggedInUser');
        const currentUserRole = loggedInUser ? loggedInUser.role : '';

        if (deletePatientButton) {
            if (currentUserRole === 'Administrator') { // Only Admin can delete patients
                deletePatientButton.classList.remove('hidden');
                // Remove previous listener before adding to prevent duplicates
                deletePatientButton.onclick = null;
                deletePatientButton.onclick = async () => {
                    // Confirm and then call handleDeletePatient
                    handleDeletePatient(patient.id);
                    editPatientModal.classList.add('hidden'); // Close modal after action
                };
            } else {
                deletePatientButton.classList.add('hidden');
                deletePatientButton.onclick = null; // Ensure no listener for hidden button
            }
        }
        editPatientModal.classList.remove('hidden'); // Show the modal.
    }
}


// --- Appointments Page Logic (FullCalendar Integration) ---
function setupAppointmentsPage() {
    const scheduleAppointmentButton = document.getElementById('schedule-appointment-button');
    const newAppointmentModal = document.getElementById('new-appointment-modal');
    const newAppointmentForm = document.getElementById('new-appointment-form');
    const editAppointmentModal = document.getElementById('edit-appointment-modal');
    const editAppointmentForm = document.getElementById('edit-appointment-form');
    const deleteApptButton = document.getElementById('delete-appt-button'); // Delete button in edit modal

    const apptSearchInput = document.getElementById('appt-search-input');
    const apptSearchButton = document.getElementById('appt-search-button'); // New: Get the search button
    const apptDepartmentFilter = document.getElementById('appt-department-filter');
    const resetApptFiltersButton = document.getElementById('reset-appt-filters');

    const loggedInUser = getLocalStorageItem('loggedInUser');
    const currentUserRole = loggedInUser ? loggedInUser.role : '';

    // Role-based visibility for "Schedule New Appointment" button
    if (scheduleAppointmentButton) {
        // Administrator, Doctor, Nurse can schedule appointments
        if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor' || currentUserRole === 'Nurse') {
            scheduleAppointmentButton.classList.remove('hidden');
        } else {
            scheduleAppointmentButton.classList.add('hidden');
        }
    }

    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Default view
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: (currentUserRole === 'Administrator' || currentUserRole === 'Doctor'), // Only Admin and Doctor can drag/resize
            selectable: (currentUserRole === 'Administrator' || currentUserRole === 'Doctor' || currentUserRole === 'Nurse'), // Only permitted roles can select dates
            events: fetchAppointmentsForCalendar, // Custom function to fetch events
            eventClick: function(info) { // When an event is clicked
                // Only Admin, Doctor, Nurse can view/edit appointment details
                if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor' || currentUserRole === 'Nurse') {
                    openEditAppointmentModal(info.event.id);
                } else {
                    showCustomDialog('Permission Denied', 'You do not have permission to view appointment details.', false);
                }
            },
            dateClick: function(info) { // When a date is clicked to add a new event
                // Only Admin, Doctor, Nurse can schedule new appointments
                if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor' || currentUserRole === 'Nurse') {
                    if (newAppointmentModal) {
                        document.getElementById('appt-date').value = info.dateStr; // Pre-fill date
                        newAppointmentModal.classList.remove('hidden');
                    }
                } else {
                     showCustomDialog('Permission Denied', 'You do not have permission to schedule new appointments.', false);
                }
            },
            eventDrop: async function(info) { // When an event is dragged to a new date/time
                // Only Admin and Doctor can reschedule
                if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor') {
                    const confirmMove = await showCustomDialog('Confirm Reschedule', `Move appointment for ${info.event.title} to ${info.event.startStr.split('T')[0]}?`, true);
                    if (confirmMove) {
                        let appointments = getLocalStorageItem('appointments');
                        const apptIndex = appointments.findIndex(a => a.id === info.event.id);
                        if (apptIndex > -1) {
                            appointments[apptIndex].date = info.event.startStr.split('T')[0];
                            // If it's a timed event, keep the time, otherwise default or let user set
                            if (info.event.startStr.includes('T')) {
                                 // Ensure time is extracted correctly, handling potential lack of time component in info.event.start
                                 const newTime = info.event.startStr.split('T')[1];
                                 if (newTime) {
                                    appointments[apptIndex].time = newTime.substring(0, 5); // HH:MM
                                 }
                            }
                            setLocalStorageItem('appointments', appointments);
                            await showCustomDialog('Success', 'Appointment rescheduled!', false);
                            // No need to refetch events here as FullCalendar updates automatically on eventDrop if not reverted
                            if (document.getElementById('genderDistributionChart')) { renderAnalyticsCharts(); }
                        } else {
                            await showCustomDialog('Error', 'Appointment not found.', false);
                            info.revert(); // Revert the drag if update fails
                        }
                    } else {
                        info.revert(); // Revert the drag if user cancels
                    }
                } else {
                    await showCustomDialog('Permission Denied', 'You do not have permission to reschedule appointments.', false);
                    info.revert(); // Revert the drag if permission denied
                }
            },
            eventContent: function(arg) { // Custom event content to include more details
                let title = arg.event.title;
                let time = arg.timeText ? `<div class="fc-event-time">${arg.timeText}</div>` : '';
                let patientName = arg.event.extendedProps.patientName || '';
                let doctor = arg.event.extendedProps.doctor || '';
                let department = arg.event.extendedProps.department || '';

                // Ensure patientName and doctor are part of the title if not already
                if (!title.includes(patientName) && patientName) title = `${patientName} (${doctor})`;
                if (!title.includes(doctor) && doctor) title = `${patientName} (${doctor})`;


                return {
                    html: `
                        <div class="p-1 text-sm md:text-xs lg:text-sm">
                            ${time}
                            <div class="fc-event-title font-semibold">${title}</div>
                            <div class="text-xs text-gray-600">${department}</div>
                        </div>
                    `
                };
            }
        });
        calendar.render(); // Render the calendar
    }

    // Function to fetch and filter appointments for FullCalendar
    function fetchAppointmentsForCalendar(fetchInfo, successCallback, failureCallback) {
        let allAppointments = getLocalStorageItem('appointments');
        const searchTerm = apptSearchInput ? apptSearchInput.value.toLowerCase() : '';
        const departmentFilter = apptDepartmentFilter ? apptDepartmentFilter.value : '';

        const filteredEvents = allAppointments.filter(appt => {
            const matchesSearch = !searchTerm ||
                                  appt.patientName.toLowerCase().includes(searchTerm) ||
                                  appt.doctor.toLowerCase().includes(searchTerm) ||
                                  appt.reason.toLowerCase().includes(searchTerm);
            const matchesDepartment = !departmentFilter || appt.department === departmentFilter;
            return matchesSearch && matchesDepartment;
        }).map(appt => ({
            id: appt.id,
            title: `${appt.patientName} - Dr. ${appt.doctor}`, // Display patient and doctor in title
            start: `${appt.date}T${appt.time}`, // Combine date and time for FullCalendar
            extendedProps: { // Store extra data here
                patientName: appt.patientName,
                doctor: appt.doctor,
                department: appt.department,
                reason: appt.reason
            }
        }));
        successCallback(filteredEvents);
    }

    // Event listeners for search and filter on appointments page
    // The input listener provides "live" search as you type
    if (apptSearchInput) apptSearchInput.addEventListener('input', () => calendar.refetchEvents());
    // The new button click also triggers the search
    if (apptSearchButton) apptSearchButton.addEventListener('click', () => calendar.refetchEvents());

    if (apptDepartmentFilter) apptDepartmentFilter.addEventListener('change', () => calendar.refetchEvents());
    if (resetApptFiltersButton) {
        resetApptFiltersButton.addEventListener('click', () => {
            if (apptSearchInput) apptSearchInput.value = '';
            if (apptDepartmentFilter) apptDepartmentFilter.value = '';
            calendar.refetchEvents();
        });
    }

    // New Appointment Form Submission
    if (newAppointmentForm) {
        newAppointmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newAppointment = {
                id: 'A-' + Date.now(),
                patientName: document.getElementById('appt-patient-name').value.trim(),
                date: document.getElementById('appt-date').value,
                time: document.getElementById('appt-time').value,
                doctor: document.getElementById('appt-doctor').value.trim(),
                department: document.getElementById('appt-department').value,
                reason: document.getElementById('appt-reason').value.trim()
            };

            let appointments = getLocalStorageItem('appointments');
            appointments.push(newAppointment);
            setLocalStorageItem('appointments', appointments);
            newAppointmentModal.classList.add('hidden');
            newAppointmentForm.reset();
            await showCustomDialog('Success', 'New appointment scheduled successfully!', false);
            calendar.refetchEvents(); // Refresh calendar after adding
            if (document.getElementById('genderDistributionChart')) { renderAnalyticsCharts(); }
        });
    }

    // Edit Appointment Form Submission
    if (editAppointmentForm) {
        editAppointmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const updatedAppt = {
                id: document.getElementById('edit-appt-id').value,
                patientName: document.getElementById('edit-appt-patient-name').value.trim(),
                date: document.getElementById('edit-appt-date').value,
                time: document.getElementById('edit-appt-time').value,
                doctor: document.getElementById('edit-appt-doctor').value.trim(),
                department: document.getElementById('edit-appt-department').value,
                reason: document.getElementById('edit-appt-reason').value.trim()
            };

            let appointments = getLocalStorageItem('appointments');
            const apptIndex = appointments.findIndex(a => a.id === updatedAppt.id);

            if (apptIndex > -1) {
                appointments[apptIndex] = updatedAppt;
                setLocalStorageItem('appointments', appointments);
                editAppointmentModal.classList.add('hidden');
                editAppointmentForm.reset();
                await showCustomDialog('Success', 'Appointment updated successfully!', false);
                calendar.refetchEvents(); // Refresh calendar after editing
                if (document.getElementById('genderDistributionChart')) { renderAnalyticsCharts(); }
            } else {
                await showCustomDialog('Error', 'Appointment not found for update.', false);
            }
        });
    }

    // Function to open the "Edit Appointment" modal and populate it with data.
    function openEditAppointmentModal(apptId) {
        const appointments = getLocalStorageItem('appointments');
        const appointment = appointments.find(a => a.id === apptId);
        const editAppointmentModal = document.getElementById('edit-appointment-modal');
        const deleteApptButton = document.getElementById('delete-appt-button'); // Get button within the modal

        if (appointment && editAppointmentModal) {
            document.getElementById('edit-appt-id').value = appointment.id;
            document.getElementById('edit-appt-patient-name').value = appointment.patientName;
            document.getElementById('edit-appt-date').value = appointment.date;
            document.getElementById('edit-appt-time').value = appointment.time;
            document.getElementById('edit-appt-doctor').value = appointment.doctor;
            document.getElementById('edit-appt-department').value = appointment.department;
            document.getElementById('edit-appt-reason').value = appointment.reason;

            // Set visibility and functionality of delete button based on role
            if (deleteApptButton) {
                // Only Administrator and Doctor can delete appointments
                if (currentUserRole === 'Administrator' || currentUserRole === 'Doctor') {
                    deleteApptButton.classList.remove('hidden');
                    // Remove previous listener before adding to prevent duplicates
                    deleteApptButton.onclick = null;
                    deleteApptButton.onclick = async () => {
                        const confirmDelete = await showCustomDialog('Confirm Deletion', `Are you sure you want to delete this appointment for ${appointment.patientName}?`, true);
                        if (confirmDelete) {
                            handleDeleteAppointment(appointment.id); // Call delete function
                            editAppointmentModal.classList.add('hidden'); // Close modal after action
                        }
                    };
                } else {
                    deleteApptButton.classList.add('hidden');
                    deleteApptButton.onclick = null; // Ensure no listener for hidden button
                }
            }
            editAppointmentModal.classList.remove('hidden');
        }
    }

    // Function to handle deleting an appointment (renamed from cancel for clarity with FullCalendar eventDrop)
    async function handleDeleteAppointment(apptId) {
        let appointments = getLocalStorageItem('appointments');
        const initialLength = appointments.length;
        appointments = appointments.filter(appt => appt.id !== apptId);
        if (appointments.length < initialLength) {
            setLocalStorageItem('appointments', appointments);
            await showCustomDialog('Success', 'Appointment deleted successfully!', false);
            calendar.refetchEvents(); // Refresh calendar after deletion
            if (document.getElementById('genderDistributionChart')) { renderAnalyticsCharts(); }
        } else {
            await showCustomDialog('Error', 'Appointment not found for deletion.', false);
        }
    }
}


// --- Analytics Page Logic (Chart.js) ---
// Function to render all analytics charts using Chart.js.
function renderAnalyticsCharts() {
    // Exit if not on the analytics page (check for a specific chart canvas).
    if (!document.getElementById('genderDistributionChart')) return;

    const patients = getLocalStorageItem('patients'); // Get patient data.
    const appointments = getLocalStorageItem('appointments'); // Get appointment data.

    // Destroy existing chart instances if they exist to prevent memory leaks and redraw issues.
    if (genderChart) genderChart.destroy();
    if (departmentChart) departmentChart.destroy();
    if (statusChart) statusChart.destroy();
    if (appointmentsTrendChart) appointmentsTrendChart.destroy();
    if (bedOccupancyChart) bedOccupancyChart.destroy();
    if (ageChart) ageChart.destroy();
    if (bloodTypeChart) bloodTypeChart.destroy();

    // --- Chart 1: Patient Demographics (Gender) ---
    // Count occurrences of each gender.
    const genderCounts = patients.reduce((acc, p) => {
        acc[p.gender] = (acc[p.gender] || 0) + 1; // Increment count for each gender.
        return acc;
    }, {});
    const genderChartCtx = document.getElementById('genderDistributionChart'); // Get canvas context.
    if (genderChartCtx) { // Ensure canvas exists.
        genderChart = new Chart(genderChartCtx, { // Create new Chart.js instance.
            type: 'pie', // Pie chart type.
            data: {
                labels: Object.keys(genderCounts), // Labels are gender names.
                datasets: [{
                    data: Object.values(genderCounts), // Data points are gender counts.
                    backgroundColor: ['#3b82f6', '#ef4444', '#6b7280'], // Colors for segments.
                }]
            },
            options: {
                responsive: true, // Make chart responsive to container size.
                maintainAspectRatio: false, // Don't force aspect ratio, let it fill container.
                plugins: {
                    title: { display: false }, // No chart title within the chart.
                    legend: { position: 'bottom' } // Legend below the chart.
                }
            }
        });
    }


    // --- Chart 2: Departmental Patient Volume (Bar Chart) ---
    // Count patients per department.
    const departmentCounts = patients.reduce((acc, p) => {
        acc[p.department] = (acc[p.department] || 0) + 1;
        return acc;
    }, {});
    const departmentChartCtx = document.getElementById('departmentVolumeChart');
    if (departmentChartCtx) {
        departmentChart = new Chart(departmentChartCtx, { // Assign to global variable
            type: 'bar', // Bar chart type.
            data: {
                labels: Object.keys(departmentCounts), // Labels are department names.
                datasets: [{
                    label: 'Number of Patients', // Label for the dataset.
                    data: Object.values(departmentCounts), // Data points are patient counts.
                    backgroundColor: '#10b981', // Green color for bars.
                    borderColor: '#059669', // Darker green border.
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }, // Hide legend.
                scales: { y: { beginAtZero: true } } // Y-axis starts at zero.
            }
        });
    }


    // --- Chart 3: Patient Status Distribution (Doughnut Chart) ---
    // Count patients per status.
    const statusCounts = patients.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {});
    const statusChartCtx = document.getElementById('patientStatusChart');
    if (statusChartCtx) {
        statusChart = new Chart(statusChartCtx, { // Assign to global variable
            type: 'doughnut', // Doughnut chart type.
            data: {
                labels: Object.keys(statusCounts), // Labels are status names.
                datasets: [{
                    data: Object.values(statusCounts), // Data points are status counts.
                    backgroundColor: ['#22c55e', '#f97316', '#3b82f6', '#eab308', '#ef4444'], // Colors for segments.
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: false },
                    legend: { position: 'right' } // Legend on the right side.
                }
            }
        });
    }

    // --- Chart 4: Appointments Over Time (Line Chart for Last 7 Days) ---
    const today = new Date(); // Get current date.
    // Generate an array of date strings for the last 7 days.
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i)); // Calculate each day.
        return d.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'.
    });

    // Count appointments for each of the last 7 days.
    const apptCountsPerDay = dates.map(d => appointments.filter(a => a.date === d).length);
    const appointmentsTrendChartCtx = document.getElementById('appointmentsTrendChart');
    if (appointmentsTrendChartCtx) {
        appointmentsTrendChart = new Chart(appointmentsTrendChartCtx, { // Assign to global variable
            type: 'line', // Line chart type.
            data: {
                labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), // Formatted dates for labels.
                datasets: [{
                    label: 'Appointments',
                    data: apptCountsPerDay, // Data points are appointment counts per day.
                    borderColor: '#a855f7', // Purple line color.
                    backgroundColor: 'rgba(168, 85, 247, 0.2)', // Light purple fill under line.
                    fill: true, // Fill area under the line.
                    tension: 0.3 // Smoothness of the line.
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // --- Chart 5: Overall Bed Occupancy (Horizontal Bar Chart) ---
    const totalPatients = patients.length; // Total current patients.
    const totalBeds = 1500; // Example total bed capacity (a static value for demo).
    const bedOccupancyChartCtx = document.getElementById('bedOccupancyChart');
    if (bedOccupancyChartCtx) {
        bedOccupancyChart = new Chart(bedOccupancyChartCtx, { // Assign to global variable
            type: 'bar', // Bar chart type.
            data: {
                labels: ['Occupancy'], // Single label for the bar.
                datasets: [
                    {
                        label: 'Occupied Beds',
                        data: [totalPatients], // Data for occupied beds.
                        backgroundColor: '#0ea5e9', // Sky blue.
                    },
                    {
                        label: 'Available Beds',
                        data: [totalBeds - totalPatients], // Data for available beds.
                        backgroundColor: '#e2e8f0', // Light gray.
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Makes the bar horizontal.
                plugins: {
                    title: { display: false },
                    legend: { position: 'top' } // Legend at the top.
                },
                scales: {
                    x: {
                        stacked: true, // Stack the bars for occupied and available beds.
                        max: totalBeds, // Max value for x-axis.
                        ticks: {
                            callback: function(value) {
                                return value; // Display tick values as numbers.
                            }
                        }
                    },
                    y: {
                        stacked: true // Stack on y-axis as well (necessary for horizontal stacked bars).
                    }
                }
            }
        });
    }

    // --- New Chart: Age Distribution Chart (Bar Chart) ---
    // Initialize age groups counter.
    const ageGroups = {
        '0-18': 0,
        '19-45': 0,
        '46-65': 0,
        '65+': 0
    };

    // Calculate age for each patient and increment respective age group count.
    patients.forEach(patient => {
        const birthDate = new Date(patient.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--; // Adjust age if birthday hasn't occurred yet this year.
        }

        // Assign to age group.
        if (age <= 18) {
            ageGroups['0-18']++;
        } else if (age <= 45) {
            ageGroups['19-45']++;
        } else if (age <= 65) {
            ageGroups['46-65']++;
        } else {
            ageGroups['65+']++;
        }
    });

    const ageChartCtx = document.getElementById('ageDistributionChart');
    if (ageChartCtx) {
        ageChart = new Chart(ageChartCtx, { // Assign to global variable
            type: 'bar', // Bar chart.
            data: {
                labels: Object.keys(ageGroups), // Labels are age group strings.
                datasets: [{
                    label: 'Number of Patients',
                    data: Object.values(ageGroups), // Data points are counts in each age group.
                    backgroundColor: '#8b5cf6', // Indigo color.
                    borderColor: '#7c3aed',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // --- New Chart: Blood Type Distribution Chart (Doughnut Chart) ---
    // Count occurrences of each blood type.
    const bloodTypeCounts = patients.reduce((acc, p) => {
        if (p.bloodType) { // Only count if blood type is defined.
            acc[p.bloodType] = (acc[p.bloodType] || 0) + 1;
        }
        return acc;
    }, {});

    const bloodTypeChartCtx = document.getElementById('bloodTypeDistributionChart');
    if (bloodTypeChartCtx) {
        bloodTypeChart = new Chart(bloodTypeChartCtx, { // Assign to global variable
            type: 'doughnut', // Doughnut chart.
            data: {
                labels: Object.keys(bloodTypeCounts), // Labels are blood type strings.
                datasets: [{
                    data: Object.values(bloodTypeCounts), // Data points are counts per blood type.
                    backgroundColor: [
                        '#dc2626', // red-600
                        '#2563eb', // blue-700
                        '#f59e0b', // yellow-500
                        '#16a34a', // green-600
                        '#be185d', // pink-700
                        '#4c1d95', // purple-800
                        '#0d9488', // teal-600
                        '#fb923c'  // orange-400
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: false },
                    legend: { position: 'right' }
                }
            }
        });
    }
}


// --- Main DOM Content Loaded Event Listener ---
// This code runs once the entire HTML document has been completely loaded and parsed.
// The 'async' keyword allows us to use 'await' inside, making asynchronous operations sequential.
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Demo Data: Ensures default data is present in localStorage.
    initializeDemoData();
    // 2. Authentication Check and Redirection: Prevents unauthorized access or unnecessary display of auth pages.
    // If redirection occurs, the script stops execution for the current page.
    if (!checkAuthAndRedirect()) {
        return; // Stop execution if redirection occurred.
    }

    // --- Add Event Listeners for Login and Register Forms (only if on their respective pages) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }


    // --- Load HTML Partials First (Header and Sidebar) ---
    // These need to be loaded *before* other scripts try to access elements within them.
    // The 'await' keyword ensures that the execution pauses until the partial is loaded.
    await loadHtmlPartial('sidebar-placeholder', '_sidebar.html', () => {
        // No specific callbacks needed for sidebar for now, as dynamic elements (user info) are primarily in header.
        // If you add dynamic elements *to the sidebar* later (e.g., dynamic menu items), their setup would go here.
    });

    // Determine the page title dynamically based on the current HTML file.
    const currentPageFilename = window.location.pathname.split('/').pop();
    let pageTitleText = 'Dashboard'; // Default title for index.html

    if (currentPageFilename === 'appointments.html') {
        pageTitleText = 'Appointments Schedule';
    } else if (currentPageFilename === 'patient_records.html') {
        pageTitleText = 'Patient Records';
    } else if (currentPageFilename === 'analytics.html') {
        pageTitleText = 'Hospital Analytics';
    } else if (currentPageFilename === 'settings.html') {
        pageTitleText = 'Settings';
    } else if (currentPageFilename === 'help.html') {
        pageTitleText = 'Help & Support';
    }

    // Load the header partial.
    await loadHtmlPartial('header-placeholder', '_header.html', () => {
        // Callback function executed once _header.html is loaded and injected.
        // Now, we can safely access elements within the header.

        // Set the dynamic page title.
        const pageTitleElement = document.getElementById('page-title');
        if (pageTitleElement) {
            pageTitleElement.textContent = pageTitleText;
        }

        // 3. Setup Current User Display: Populates user's name, role, and avatar initials.
        // This is called here because the elements it targets are now in the DOM.
        setupCurrentUserDisplay();

        // 6. Notification Dropdown Toggle Logic.
        // These elements are part of the header, so their setup must occur after the header is loaded.
        const notificationButton = document.getElementById('notification-button');
        const notificationDropdown = document.getElementById('notification-dropdown');
        if (notificationButton && notificationDropdown) {
            notificationButton.addEventListener('click', (event) => {
                event.stopPropagation();
                notificationDropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', (event) => {
                if (!notificationDropdown.contains(event.target) && !notificationButton.contains(event.target)) {
                    notificationDropdown.classList.add('hidden');
                }
            });
        }

        // 7. Logout Button Listeners.
        // The logout button is now part of the dynamically loaded header.
        const logoutButtons = document.querySelectorAll('[id^="logout-button"]');
        logoutButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', handleLogout);
            }
        });

        // 10. Real-time Clock in Header.
        // The date/time display element is now part of the dynamically loaded header.
        const dateTimeDisplay = document.getElementById('current-date-time');
        function updateDateTime() {
            const now = new Date();
            const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
            const formattedDate = now.toLocaleDateString('en-US', optionsDate);
            const formattedTime = now.toLocaleTimeString('en-US', optionsTime);
            if (dateTimeDisplay) { // Check if element exists before updating.
                dateTimeDisplay.innerHTML = `<p>${formattedDate}</p><p>${formattedTime}</p>`;
            }
        }
        if (dateTimeDisplay) { // Check if element exists before initializing interval.
            updateDateTime();
            setInterval(updateDateTime, 1000);
        }
    });


    // --- Rest of the page-specific logic ---
    // These functions typically depend on elements that are always present on their respective pages
    // (not dynamically loaded common components) or on data from localStorage. They can run after
    // the common header/sidebar is loaded.

    // 4. Setup Password Toggle for Login and Register forms.
    // These only run on login/register pages which do not dynamically load header/sidebar, so no change needed here.
    setupPasswordToggle('login-password', 'toggle-login-password');
    setupPasswordToggle('reg-password', 'toggle-reg-password');

    // 5. Setup Common Modal Handling for all modals (page-specific modals).
    // These modals are defined directly in each main HTML file.
    if (document.getElementById('custom-alert-modal')) { setupModalHandling('custom-alert-modal'); }
    if (document.getElementById('dynamic-modal')) { setupModalHandling('dynamic-modal'); }
    if (document.getElementById('new-appointment-modal')) { setupModalHandling('new-appointment-modal'); }
    if (document.getElementById('edit-appointment-modal')) { setupModalHandling('edit-appointment-modal'); }
    if (document.getElementById('new-patient-modal')) { setupModalHandling('new-patient-modal'); }
    if (document.getElementById('view-patient-modal')) { setupModalHandling('view-patient-modal'); }
    if (document.getElementById('edit-patient-modal')) { setupModalHandling('edit-patient-modal'); }


    // --- Dashboard Card Modals Logic (Specific to index.html) ---
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    const dynamicModal = document.getElementById('dynamic-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    // Data for the dynamic modal based on which dashboard card is clicked.
    const modalData = {
        'total-patients': {
            title: 'Total Patients Overview',
            content: `<p><strong>Current Active Patients:</strong> ${getLocalStorageItem('patients').length}</p><p>The total patient count includes all currently admitted patients across all departments. This number is updated daily and reflects both new admissions and discharges.</p>`
        },
        'admissions': {
            title: 'New Admissions Today',
            content: `<p><strong>Today's New Admissions:</strong> 45</p><p>Today's new admissions include patients from the Emergency Room, scheduled surgeries, and direct transfers. The average waiting time for admission is currently 1.5 hours.</p>`
        },
        'discharges': {
            title: 'Today\'s Discharges',
            content: `<p><strong>Today's Discharges:</strong> 28</p><p>A total of 28 patients have been successfully discharged today. Ensuring a smooth discharge process is crucial for patient flow and bed availability.</p>`
        },
        'bed-occupancy': {
            title: 'Bed Occupancy Details',
            content: `<p><strong>Overall Occupancy Rate:</strong> 85%</p><p><strong>Available Beds:</strong> 150</p><p>The bed occupancy rate provides a snapshot of available resources. High occupancy in critical care units requires careful management and foresight for upcoming admissions.</p>`
        }
    };

    if (dashboardCards.length > 0 && dynamicModal && modalTitle && modalContent) {
        dashboardCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardType = card.dataset.card;
                const data = modalData[cardType];
                if (data) {
                    modalTitle.innerHTML = data.title;
                    modalContent.innerHTML = data.content;
                    dynamicModal.classList.remove('hidden');
                }
            });
        });
    }

    // --- Page-specific function calls ---
    

    if (currentPageFilename === 'patient_records.html') {
        setupPatientRecordsPage();
    } else if (currentPageFilename === 'appointments.html') {
        setupAppointmentsPage();
    } else if (currentPageFilename === 'analytics.html') {
        renderAnalyticsCharts();
    } else if (currentPageFilename === 'settings.html') {
        setupProfileSettings();
    }

    // --- Update KPI counts on Dashboard from local storage (on index.html only) ---
    const totalPatientsCount = document.getElementById('total-patients-count');
    // If the total patients count element exists (i.e., on the dashboard page).
    if (totalPatientsCount) {
        // Update its text content with the current number of patients.
        totalPatientsCount.textContent = getLocalStorageItem('patients').length.toLocaleString();
    }
});
