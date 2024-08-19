// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBAPrtfonDefpDlfCwQ_smWnVjwpL5rh6I",
    authDomain: "upload-af09a.firebaseapp.com",
    projectId: "upload-af09a",
    storageBucket: "upload-af09a.appspot.com",
    messagingSenderId: "120721801820",
    appId: "1:120721801820:web:818cf5f6fab789f8e71c99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Select DOM elements
const uploadForm = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const uploadedFileLink = document.getElementById('uploaded-file-link');
const successModal = document.getElementById('success-modal');
const errorModal = document.getElementById('error-modal');
const closeBtns = document.querySelectorAll('.close-btn');

// Handle file upload automatically
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (!file) {
        console.error("No file selected.");
        displayErrorModal("No file selected.");
        return;
    }

    // Show progress bar
    progressBar.style.display = 'block';

    // Create a storage reference
    const storageRef = ref(storage, 'uploads/' + file.name);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Update progress bar
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = `${progress}%`;
            progressPercentage.textContent = `${Math.floor(progress)}%`;
        },
        (error) => {
            console.error('Upload failed:', error);
            displayErrorModal(error.message);  // Show error modal
            progressBar.style.display = 'none'; // Hide progress bar on error
        },
        () => {
            // Upload completed successfully, now get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                displayFile(downloadURL, file);
                showSuccessModal = true;
                displaySuccessModal(file.name);  // Show success modal
                progressBar.style.display = 'none'; // Hide progress bar after success
            }).catch((error) => {
                console.error('Failed to get download URL:', error);
                showErrorModal = true;
                displayErrorModal(error.message);  // Show error modal if URL retrieval fails
                progressBar.style.display = 'none'; // Hide progress bar on error
            });
        }
    );
});

function displayFile(downloadURL, file) {
    uploadedFileLink.innerHTML = '';

    const fileType = file.type;

    if (fileType.startsWith('image/')) {
        uploadedFileLink.innerHTML = `<img src="${downloadURL}" alt="Uploaded Image" style="max-width: 100%; height: auto;">`;
    } else if (fileType.startsWith('video/')) {
        uploadedFileLink.innerHTML = `<video src="${downloadURL}" controls style="max-width: 100%; height: auto;"></video>`;
    } else if (fileType.startsWith('audio/')) {
        uploadedFileLink.innerHTML = `<audio controls><source src="${downloadURL}" type="${fileType}">Your browser does not support the audio element.</audio>`;
    } else {
        uploadedFileLink.innerHTML = `<a href="${downloadURL}" target="_blank">Download ${file.name}</a>`;
    }
}

function displaySuccessModal(fileName) {
    const modalMessageSuccess = document.getElementById('modal-message-success');
    modalMessageSuccess.textContent = `File "${fileName}" uploaded successfully!`;
    successModal.style.display = "block";  // Show the success modal
}

function displayErrorModal(errorMessage) {
    const modalMessageError = document.getElementById('modal-message-error');
    modalMessageError.textContent = `Error: ${errorMessage}`;
    errorModal.style.display = "block";  // Show the error modal
}

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        successModal.style.display = "none";
        errorModal.style.display = "none";
    });
});

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
