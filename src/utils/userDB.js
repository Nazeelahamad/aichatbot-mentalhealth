// demo/src/utils/userDB.js

const USER_ACCOUNTS_KEY = 'mh_companion_accounts';
const CURRENT_USER_KEY = 'mh_companion_currentUser';

// --- Account Management ---

// Loads all registered accounts from local storage
const loadAccounts = () => {
    const accounts = localStorage.getItem(USER_ACCOUNTS_KEY);
    return accounts ? JSON.parse(accounts) : [];
};

// Saves the updated list of accounts
const saveAccounts = (accounts) => {
    localStorage.setItem(USER_ACCOUNTS_KEY, JSON.stringify(accounts));
};

// Finds an account by name
export const findAccount = (userName) => {
    const accounts = loadAccounts();
    return accounts.find(acc => acc.userName.toLowerCase() === userName.toLowerCase());
};

// Creates a new user account (simulates registration)
export const registerNewUser = (userName, password) => {
    const accounts = loadAccounts();
    if (findAccount(userName)) {
        return { success: false, error: 'User already exists.' };
    }
    
    const newAccount = { 
        userName, 
        passwordHash: password, // In a real app, this would be a secure hash!
        userId: Date.now().toString() 
    };
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    // Initialize empty data for the new user
    saveUserData(userName, { 
        activities: 0, 
        messages: [],
        currentMood: 'Not tracked',
    });
    
    return { success: true, account: newAccount };
};

// --- Session Management ---

// Sets the logged-in user session
export const loginSession = (userName) => {
    localStorage.setItem(CURRENT_USER_KEY, userName);
};

// Clears the logged-in user session
export const logoutSession = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Retrieves the logged-in user's name
export const getCurrentUser = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
};


// --- Data Persistence ---

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