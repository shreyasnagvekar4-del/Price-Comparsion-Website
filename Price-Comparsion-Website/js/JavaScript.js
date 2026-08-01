import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ✅ Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDmNVvciSiEQHEk_RyEZIsTRcdQtAzDMJk",
    authDomain: "price-comparison-website-7274d.firebaseapp.com",
    projectId: "price-comparison-website-7274d",
    databaseURL: "https://price-comparison-website-7274d-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "price-comparison-website-7274d.appspot.com",
    messagingSenderId: "394357508099",
    appId: "1:394357508099:web:1d37bda0aff88d85002636",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

// ✅ Add event listener (after DOM is ready)
const loginBtn = document.getElementById("google-login-btn");

loginBtn.addEventListener("click", async () => {
    console.log("Login button clicked!");
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User signed in:", user);

        // Save user info to Realtime Database
        await set(ref(db, "users/" + user.uid), {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            lastLogin: new Date().toISOString()
        });
        
        // Save user data to localStorage for the next page
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userPhoto", user.photoURL);
        localStorage.setItem("userEmail", user.email);

        // Redirect to the next page
        window.location.href = "dashboard.html";  // Change to your desired page name

    } catch (error) {
        console.error("❌ Error:", error);
        alert("Login failed: " + error.message);
    }
});