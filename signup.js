// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithPopup, 
    GoogleAuthProvider,
    updateProfile,
    onAuthStateChanged
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
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const googleBtn = document.getElementById('googleBtn');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const loading = document.getElementById('loading');

// Password requirement elements
const lengthReq = document.getElementById('length');
const uppercaseReq = document.getElementById('uppercase');
const lowercaseReq = document.getElementById('lowercase');
const numberReq = document.getElementById('number');

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
    signupBtn.disabled = show;
    googleBtn.disabled = show;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password)
    };
}

function updatePasswordRequirements(password) {
    const requirements = validatePassword(password);
    
    updateRequirement(lengthReq, requirements.length);
    updateRequirement(uppercaseReq, requirements.uppercase);
    updateRequirement(lowercaseReq, requirements.lowercase);
    updateRequirement(numberReq, requirements.number);
    
    return Object.values(requirements).every(req => req);
}

function updateRequirement(element, isValid) {
    const icon = element.querySelector('i');
    
    if (isValid) {
        element.classList.add('valid');
        element.classList.remove('invalid');
        icon.className = 'fas fa-check';
    } else {
        element.classList.add('invalid');
        element.classList.remove('valid');
        icon.className = 'fas fa-times';
    }
}

function validateForm() {
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!fullName) {
        showError('Please enter your full name');
        fullNameInput.focus();
        return false;
    }
    
    if (fullName.length < 2) {
        showError('Full name must be at least 2 characters long');
        fullNameInput.focus();
        return false;
    }
    
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return false;
    }
    
    if (!updatePasswordRequirements(password)) {
        showError('Password does not meet all requirements');
        passwordInput.focus();
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        confirmPasswordInput.focus();
        return false;
    }
    
    return true;
}

// Password input event listener for real-time validation
passwordInput.addEventListener('input', (e) => {
    updatePasswordRequirements(e.target.value);
    if (errorMessage.style.display === 'block') {
        hideMessages();
    }
});

// Confirm password validation
confirmPasswordInput.addEventListener('input', (e) => {
    const password = passwordInput.value;
    const confirmPassword = e.target.value;
    
    if (confirmPassword && password !== confirmPassword) {
        e.target.style.borderColor = '#dc3545';
    } else {
        e.target.style.borderColor = '#e1e5e9';
    }
});

// Sign Up with Email/Password
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    hideMessages();
    showLoading(true);
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile with display name
        await updateProfile(user, {
            displayName: fullName
        });
        
        showSuccess('Account created successfully! Redirecting...');
        console.log('User created:', user);
        
        // Redirect to main page or dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Sign up error:', error);
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError('An account with this email already exists');
                break;
            case 'auth/invalid-email':
                showError('Invalid email address');
                break;
            case 'auth/operation-not-allowed':
                showError('Email/password accounts are not enabled');
                break;
            case 'auth/weak-password':
                showError('Password is too weak');
                break;
            case 'auth/network-request-failed':
                showError('Network error. Please check your connection');
                break;
            default:
                showError('Failed to create account. Please try again');
        }
    } finally {
        showLoading(false);
    }
});

// Google Sign Up
googleBtn.addEventListener('click', async () => {
    hideMessages();
    showLoading(true);
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        showSuccess('Account created successfully with Google! Redirecting...');
        console.log('User created with Google:', user);
        
        // Redirect to main page or dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        console.error('Google sign up error:', error);
        
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                showError('Sign up cancelled');
                break;
            case 'auth/popup-blocked':
                showError('Popup blocked. Please allow popups and try again');
                break;
            case 'auth/account-exists-with-different-credential':
                showError('An account already exists with this email');
                break;
            case 'auth/network-request-failed':
                showError('Network error. Please check your connection');
                break;
            default:
                showError('Google sign up failed. Please try again');
        }
    } finally {
        showLoading(false);
    }
});

// Clear error messages when inputs change
[fullNameInput, emailInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('input', () => {
        if (errorMessage.style.display === 'block') {
            hideMessages();
        }
    });
});

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        // User is signed in, redirect to main page
        // window.location.href = 'index.html';
    } else {
        console.log('User is signed out');
    }
});
// Add password toggle functionality
function addPasswordToggles() {
    [passwordInput, confirmPasswordInput].forEach(input => {
        const passwordGroup = input.parentElement;
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
            z-index: 10;
        `;
        
        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
        });
        
        passwordGroup.appendChild(toggleBtn);
    });
}

// Initialize password toggles
addPasswordToggles();