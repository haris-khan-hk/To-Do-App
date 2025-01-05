// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjIfG3ANwvNalcFtr-xAgXoT_grPdqrNg",
  authDomain: "jawanpakistan-14622.firebaseapp.com",
  projectId: "jawanpakistan-14622",
  storageBucket: "jawanpakistan-14622.firebasestorage.app",
  messagingSenderId: "643437359251",
  appId: "1:643437359251:web:3e4b0b4720eff5f1fe9d66",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const signUpButton = document.getElementById("signUpButton");
const signInButton = document.getElementById("signInButton");
const signInForm = document.getElementById("signIn");
const signUpForm = document.getElementById("signup");

signUpButton.addEventListener("click", function () {
  signInForm.style.display = "none";
  signUpForm.style.display = "block";
});
signInButton.addEventListener("click", function () {
  signInForm.style.display = "block";
  signUpForm.style.display = "none";
});

// Sign Up Start
document.getElementById("submitSignUp").onclick = function (event) {
  event.preventDefault();

  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;

  createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        firstName,
        lastName,
      });
      window.location.href = "index.html";
    }
  );
};
// Sign Up End

// Sign In Start
document.getElementById("submitSignIn").onclick = function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    localStorage.setItem("loggedInUserId", userCredential.user.uid);
    window.location.href = "ToDoApp.html";
  });
};
// Sign In End
