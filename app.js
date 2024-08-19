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

// Handle file upload
const uploadForm = document.getElementById('upload-form');
const uploader = document.getElementById('uploader');
const uploadedFileLink = document.getElementById('uploaded-file-link');
const modal = document.getElementById('success-modal');
const closeModalBtn = document.querySelector('.close-btn');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the file
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    // Check if a file is selected
    if (!file) {
        console.error("No file selected.");
        return;
    }

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
        },
        () => {
            // Upload completed successfully, now get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                displayFile(downloadURL, file);
                displaySuccessModal(file.name);  // Show modal on success
            });
        }
    );
});

function displayFile(downloadURL, file) {
    // Clear previous output
    uploadedFileLink.innerHTML = '';

    // Check the file type and display accordingly
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
        // Display image
        uploadedFileLink.innerHTML = `<img src="${downloadURL}" alt="Uploaded Image">`;
    } else if (fileType.startsWith('video/')) {
        // Display video
        uploadedFileLink.innerHTML = `<video src="${downloadURL}" controls></video>`;
    } else if (fileType.startsWith('audio/')) {
        // Display audio
        uploadedFileLink.innerHTML = `<audio controls><source src="${downloadURL}" type="${fileType}">Your browser does not support the audio element.</audio>`;
    } else {
        // Provide a link for other file types (documents, etc.)
        uploadedFileLink.innerHTML = `<a href="${downloadURL}" target="_blank">Download ${file.name}</a>`;
    }
}

function displaySuccessModal(fileName) {
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = `File "${fileName}" uploaded successfully!`;
    modal.style.display = "block";  // Show the modal
}

// Close the modal when the user clicks on the close button
closeModalBtn.addEventListener('click', () => {
    modal.style.display = "none";
});

// Close the modal when the user clicks outside of the modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});
