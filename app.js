// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwBCRuY2xVwYwwj7CkQS4K0_U3fUFZbQ0",
    authDomain: "website-test-2022.firebaseapp.com",
    projectId: "website-test-2022",
    storageBucket: "website-test-2022.appspot.com",
    messagingSenderId: "420972701466",
    appId: "1:420972701466:web:a4063b695212efcb8deea3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Select DOM elements
const uploader = document.getElementById('uploader');
const uploadedFileLink = document.getElementById('uploaded-file-link');
const successModal = document.getElementById('success-modal');
const errorModal = document.getElementById('error-modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Flags to handle modal display
let showSuccessModal = false;
let showErrorModal = false;

// Hide progress bar on page load
document.addEventListener('DOMContentLoaded', () => {
    uploader.value = 0; // Reset progress bar value
    uploader.style.display = 'none'; // Hide progress bar
    successModal.style.display = "none"; // Hide success modal
    errorModal.style.display = "none"; // Hide error modal
});

// Handle file selection
const fileInput = document.getElementById('file');
fileInput.addEventListener('change', (e) => {
    // Reset flags
    showSuccessModal = false;
    showErrorModal = false;

    // Get the file
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
        console.error("No file selected.");
        showErrorModal = true;
        displayErrorModal("No file selected.");
        return;
    }

    // Show progress bar
    uploader.style.display = 'block';

    // Create a storage reference
    const storageRef = ref(storage, 'uploads/' + file.name);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Update progress bar
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = progress;
        },
        (error) => {
            console.error('Upload failed:', error);
            showErrorModal = true;
            displayErrorModal(error.message);  // Show error modal
            uploader.style.display = 'none'; // Hide progress bar on error
        },
        () => {
            // Upload completed successfully, now get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                displayFile(downloadURL, file);
                showSuccessModal = true;
                displaySuccessModal(file.name);  // Show success modal
                uploader.style.display = 'none'; // Hide progress bar after success
            }).catch((error) => {
                console.error('Failed to get download URL:', error);
                showErrorModal = true;
                displayErrorModal(error.message);  // Show error modal if URL retrieval fails
                uploader.style.display = 'none'; // Hide progress bar on error
            });
        }
    );
});






// Function to display the uploaded file (image, video, audio, or link)
async function createShortIoLink(longUrl) {
    const apiKey = 'pk_OWheBUKROk7TL0nY'; // Your Short.io API key
    const requestUrl = 'https://api.short.io/links/public';

    const requestBody = {
        originalURL: longUrl,
        domain: 'eaf4.short.gy' // Your Short.io domain
    };

    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.shortURL) {
            return data.shortURL;
        } else {
            console.error('Error creating short link:', data);
            return longUrl; // Return the original URL if shortening fails
        }
    } catch (error) {
        console.error('Error:', error);
        return longUrl; // Return the original URL if there's an error
    }
}

async function displayFile(downloadURL, file) {
    // Clear previous output
    uploadedFileLink.innerHTML = '';

    // Create the copy button container
    const container = document.createElement('div');
    container.className = 'copy-url-button';

    // Create the short link
    const shortLink = await createShortIoLink(downloadURL);

    // Create the span for the shortened URL
    const urlSpan = document.createElement('span');
    urlSpan.className = 'download-url';
    urlSpan.textContent = shortLink;

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.type = 'button';
    copyButton.id = 'copyButton';

    // Add event listener to copy the short link
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(shortLink).then(() => {
            copyButton.textContent = 'Copied'; // Change button text
            setTimeout(() => {
                copyButton.textContent = 'Copy'; // Revert to original text after 2 seconds
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Append the elements to the container only if there's a short link
    if (shortLink) {
        container.appendChild(urlSpan);
        container.appendChild(copyButton);
        uploadedFileLink.appendChild(container);
        container.style.display = 'flex'; // Show the container
    } else {
        container.style.display = 'none'; // Hide the container if no URL
    }
}








// Function to display the success modal with the file name
function displaySuccessModal(fileName) {
    if (showSuccessModal) {
        const modalMessageSuccess = document.getElementById('modal-message-success');
        modalMessageSuccess.textContent = `File "${fileName}" uploaded successfully!`;
        successModal.style.display = "block";  // Show the success modal
    }
}

// Function to display the error modal with the error message
function displayErrorModal(errorMessage) {
    if (showErrorModal) {
        const modalMessageError = document.getElementById('modal-message-error');
        modalMessageError.textContent = `Error: ${errorMessage}`;
        errorModal.style.display = "block";  // Show the error modal
    }
}

// Close the modals when the user clicks on the close buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        successModal.style.display = "none";
        errorModal.style.display = "none";
    });
});

// Close the modals when the user clicks outside of the modal
window.addEventListener('click', (event) => {
    if (event.target == successModal) {
        successModal.style.display = "none";
    }
    if (event.target == errorModal) {
        errorModal.style.display = "none";
    }
});

// Ensure modals are hidden on page load
document.addEventListener('DOMContentLoaded', () => {
    successModal.style.display = "none";
    errorModal.style.display = "none";
});




// Responsive menu

const toggleButton = document.querySelector('.toggle-button');
const navbarLinks = document.querySelector('.navbar-links');

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});
