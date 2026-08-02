// Initialize and handle navigation - Dashboard
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";  // Added signOut for logout

// Use the same config as login — storageBucket corrected
const firebaseConfig = {
    apiKey: "AIzaSyDmNVvciSiEQHEk_RyEZIsTRcdQtAzDMJk",
    authDomain: "price-comparison-website-7274d.firebaseapp.com",
    projectId: "price-comparison-website-7274d",
    databaseURL: "https://price-comparison-website-7274d-default-rtdb.asia-southeast1.firebasedatabase.app/", // ADD THIS!
    storageBucket: "price-comparison-website-7274d.appspot.com", // Corrected
    messagingSenderId: "394357508099",
    appId: "1:394357508099:web:1d37bda0aff88d85002636",
    measurementId: "G-6BXHREXWGC"
};

// Initialize app & auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM ready (ensures elements exist)
window.addEventListener("DOMContentLoaded", () => {
    const userPhotoEl = document.getElementById("user-photo");
    const welcomeEl = document.getElementById("welcome-message");
    const nextBtn = document.getElementById("next-btn");

    // Keep UI in sync with actual auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // If user signed in, prefer live auth info; fallback to localStorage
            const name = user.displayName || localStorage.getItem("userName") || "User";
            const photo = user.photoURL || localStorage.getItem("userPhoto") || "";


            if (userPhotoEl) userPhotoEl.src = photo;
            if (welcomeEl) welcomeEl.textContent = ` ${name}!`;
        } else {
            // Not signed in -> redirect to login
            console.log("No user is signed in. Redirecting to login.");
            localStorage.clear();
            window.location.href = "index.html";
        }
    });

    // Hook next button
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            // Redirect to the next page (e.g., main app page)
            window.location.href = "dashboard2.html";  // Assumed; update if different
        });
    } else {
        console.warn("Next button not found in DOM.");
    }

    });


    