// demo/src/utils/authStorage.js

const USER_KEY = 'currentUser';

// Saves the user's name to indicate they are logged in
export const loginUser = (userName) => {
    localStorage.setItem(USER_KEY, userName);
    // Initialize data for this user if it doesn't exist
    if (!localStorage.getItem(`data_${userName}`)) {
        localStorage.setItem(`data_${userName}`, JSON.stringify({ 
            activities: 0, 
            messages: [],
            currentMood: 'Not tracked',
        }));
    }
};

// Retrieves the logged-in user's name
export const getCurrentUser = () => {
    return localStorage.getItem(USER_KEY);
};

// Removes the user from storage
export const logoutUser = () => {
    localStorage.removeItem(USER_KEY);
};

// Loads user-specific progress data
export const loadUserData = (userName) => {
    const data = localStorage.getItem(`data_${userName}`);
    return data ? JSON.parse(data) : { 
        activities: 0, 
        messages: [],
        currentMood: 'Not tracked',
    };
};

// Saves user-specific progress data
export const saveUserData = (userName, data) => {
    localStorage.setItem(`data_${userName}`, JSON.stringify(data));
};