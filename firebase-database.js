// Firebase Authentication Database
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
    getFirestore, 
    doc, 
    setDoc,
    getDoc,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase configuration
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
const db = getFirestore(app);

// Save user profile
export async function saveUserProfile(userId, profileData) {
    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            ...profileData,
            createdAt: new Date(),
            updatedAt: new Date()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error saving profile:", error);
        throw error;
    }
}

// Get user profile
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
        console.error("Error getting profile:", error);
        return null;
    }
}

// Update user profile
export async function updateUserProfile(userId, updateData) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            ...updateData,
            updatedAt: new Date()
        });
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
}

// Initialize user profile
export async function initializeUserProfile(userId, authData) {
    const profile = {
        userId,
        email: authData.email || '',
        displayName: authData.displayName || '',
        photoURL: authData.photoURL || '',
        provider: authData.providerData?.[0]?.providerId || 'password',
        createdAt: new Date(),
        lastLogin: new Date()
    };
    return await saveUserProfile(userId, profile);
}

// Update last login
export async function updateLastLogin(userId) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { lastLogin: new Date() });
        return true;
    } catch (error) {
        console.error("Error updating login:", error);
        return false;
    }
}

export { db };