// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Handle image upload
const uploadForm = document.getElementById('upload-form');
const uploader = document.getElementById('uploader');
const uploadedImg = document.getElementById('uploaded-img');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the file
    const file = document.getElementById('file').files[0];

    // Create a storage reference
    const storageRef = ref(storage, 'images/' + file.name);

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
                uploadedImg.src = downloadURL; // Display the uploaded image
            });
        }
    );
});
