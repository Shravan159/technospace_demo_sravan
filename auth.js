// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCom2aTnD7qyr39NmHtozv19k_M8ITpjgI",
  authDomain: "frontend-withbackend.firebaseapp.com",
  projectId: "frontend-withbackend",
  storageBucket: "frontend-withbackend.firebasestorage.app",
  messagingSenderId: "767017769325",
  appId: "1:767017769325:web:e2cb8112ecce2e42d4e264",
  measurementId: "G-2MP07ZY7QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loading = document.getElementById('loading');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const signupLink = document.getElementById('signupLink');

// Utility functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

function showLoading(show = true) {
    loading.style.display = show ? 'block' : 'none';
    loginBtn.disabled = show;
    googleBtn.disabled = show;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Email/Password Sign In
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validation
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    hideMessages();
    showLoading(true);
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        showSuccess('Successfully signed in!');
        console.log('User signed in:', user);
        
        // Redirect to dashboard or main page
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to main page
        }, 1500);
        
    } catch (error) {
        console.error('Sign in error:', error);
        
        // Handle specific error codes
        switch (error.code) {
            case 'auth/user-not-found':
                showError('No account found with this email address');
                break;
            case 'auth/wrong-password':
                showError('Incorrect password');
                break;
            case 'auth/invalid-email':
                showError('Invalid email address');
                break;
            case 'auth/user-disabled':
                showError('This account has been disabled');
                break;
            case 'auth/too-many-requests':
                showError('Too many failed attempts. Please try again later');
                break;
            case 'auth/network-request-failed':
                showError('Network error. Please check your connection');
                break;
            default:
                showError('Sign in failed. Please try again');
        }
    } finally {
        showLoading(false);
    }
});

// Google Sign In
googleBtn.addEventListener('click', async () => {
    hideMessages();
    showLoading(true);
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        showSuccess('Successfully signed in with Google!');
        console.log('User signed in with Google:', user);
        
        // Redirect to dashboard or main page
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to main page
        }, 1500);
        
    } catch (error) {
        console.error('Google sign in error:', error);
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                showError('Sign in cancelled');
                break;
            case 'auth/popup-blocked':
                showError('Popup blocked. Please allow popups and try again');
                break;
            case 'auth/network-request-failed':
                showError('Network error. Please check your connection');
                break;
            default:
                showError('Google sign in failed. Please try again');
        }
    } finally {
        showLoading(false);
    }
});

// Forgot Password
forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showError('Please enter your email address first');
        emailInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    hideMessages();
    showLoading(true);
    
    try {
        await sendPasswordResetEmail(auth, email);
        showSuccess('Password reset email sent! Check your inbox');
    } catch (error) {
        console.error('Password reset error:', error);
        
        switch (error.code) {
            case 'auth/user-not-found':
                showError('No account found with this email address');
                break;
            case 'auth/invalid-email':
                showError('Invalid email address');
                break;
            case 'auth/too-many-requests':
                showError('Too many requests. Please try again later');
                break;
            default:
                showError('Failed to send reset email. Please try again');
        }
    } finally {
        showLoading(false);
    }
});

// Sign Up Link (you can create a separate signup page)
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Redirect to signup page or show signup form
    window.location.href = 'signup.html'; // Create this page if needed
});

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        // User is signed in, you might want to redirect
        // window.location.href = 'index.html';
    } else {
        console.log('User is signed out');
    }
});

// Expose auth functions globally for testing
window.auth = auth;
window.signOut = () => signOut(auth);

// Add input event listeners for real-time validation
emailInput.addEventListener('input', () => {
    if (errorMessage.style.display === 'block') {
        hideMessages();
    }
});

passwordInput.addEventListener('input', () => {
    if (errorMessage.style.display === 'block') {
        hideMessages();
    }
});

// Show password toggle (optional)
function addPasswordToggle() {
    const passwordGroup = passwordInput.parentElement;
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    toggleBtn.style.cssText = `
        position: absolute;
        right: 45px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        margin-top: 14px;
    `;
    
    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
    
    passwordGroup.appendChild(toggleBtn);
}

// Initialize password toggle
addPasswordToggle();