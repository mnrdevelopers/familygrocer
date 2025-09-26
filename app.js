// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRaFGI6r7WrRy-uhRapVbsLw5JllZYHNU",
    authDomain: "mnr-grocery.firebaseapp.com",
    projectId: "mnr-grocery",
    storageBucket: "mnr-grocery.firebasestorage.app",
    messagingSenderId: "40213820077",
    appId: "1:40213820077:web:5ef71592f3a347b47d8c24",
    measurementId: "G-7RRDLTWZHX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const authScreen = document.getElementById('authScreen');
const familySetupScreen = document.getElementById('familySetupScreen');
const appScreen = document.getElementById('appScreen');

// Authentication elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const forgotPassword = document.getElementById('forgotPassword');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const backToLogin = document.getElementById('backToLogin');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const resetEmail = document.getElementById('resetEmail');

// Family setup elements
const createFamilyBtn = document.getElementById('createFamilyBtn');
const joinFamilyBtn = document.getElementById('joinFamilyBtn');
const familyCodeInput = document.getElementById('familyCodeInput');
const logoutFromSetup = document.getElementById('logoutFromSetup');

// Main app elements
const itemInput = document.getElementById('itemInput');
const qtyInput = document.getElementById('qtyInput');
const priceInput = document.getElementById('priceInput');
const categorySelect = document.getElementById('categorySelect');
const dateInput = document.getElementById('dateInput');
const urgentCheckbox = document.getElementById('urgentCheckbox');
const repeatCheckbox = document.getElementById('repeatCheckbox');
const addItemBtn = document.getElementById('addItemBtn');
const pendingItemsContainer = document.getElementById('pending-items');
const completedItemsContainer = document.getElementById('completed-items');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const categoryButtons = document.querySelectorAll('.category-btn');
const totalItemsSpan = document.getElementById('total-items');
const completedItemsSpan = document.getElementById('completed-items');
const estimatedTotalSpan = document.getElementById('estimated-total');
const pendingCountSpan = document.getElementById('pending-count');
const completedCountSpan = document.getElementById('completed-count');
const monthlyExpenseSpan = document.getElementById('monthly-expense');
const monthlySavingsSpan = document.getElementById('monthly-savings');
const budgetProgressSpan = document.getElementById('budget-progress');
const familyMembersContainer = document.getElementById('familyMembers');
const familyMembersList = document.getElementById('familyMembersList');
const familyCodeDisplay = document.getElementById('familyCodeDisplay');
const copyFamilyCodeBtn = document.getElementById('copyFamilyCode');
const userNameDisplay = document.getElementById('userNameDisplay');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const userAvatarLarge = document.getElementById('userAvatarLarge');
const changeNameBtn = document.getElementById('changeNameBtn');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const leaveFamilyBtn = document.getElementById('leaveFamilyBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const logoutBtn = document.getElementById('logoutBtn');
const headerLogout = document.getElementById('headerLogout');
const clearCompleted = document.getElementById('clearCompleted');
const toggleCompleted = document.getElementById('toggleCompleted');
const toast = document.getElementById('toast');

// Analytics elements
const totalSpentSpan = document.getElementById('totalSpent');
const itemsBoughtSpan = document.getElementById('itemsBought');
const avgSpendSpan = document.getElementById('avgSpend');
const savingsSpan = document.getElementById('savings');
const categoryChart = document.getElementById('categoryChart');
const recentPurchases = document.getElementById('recentPurchases');
const topShopperSpan = document.getElementById('topShopper');
const familyTotalItemsSpan = document.getElementById('familyTotalItems');

// AI Elements
const aiSuggestions = document.getElementById('aiSuggestions');
const suggestionItems = document.getElementById('suggestionItems');
const aiAssistBtn = document.getElementById('aiAssistBtn');
const closeSuggestions = document.getElementById('closeSuggestions');
const pricePrediction = document.getElementById('pricePrediction');

// Tab elements
const tabContents = document.querySelectorAll('.tab-content');
const navButtons = document.querySelectorAll('.nav-btn');

// State variables
let currentUser = null;
let currentFamily = null;
let groceryItems = [];
let familyMembers = [];
let currentFilter = 'all';
let currentSearch = '';
let itemsUnsubscribe = null;
let familyUnsubscribe = null;
let userBudget = 5000; // Default monthly budget
let completedVisible = false;
let monthlyExpenses = [];
let userPreferences = {};

// AI Configuration
const AI_CONFIG = {
    useLocalML: true,
};

// AI Service
const AIService = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    predictCategory(itemName) {
        const categories = {
            'fruits': ['apple', 'banana', 'orange', 'mango', 'grape', 'berry', 'fruit', 'pineapple', 'watermelon'],
            'vegetables': ['potato', 'tomato', 'onion', 'carrot', 'spinach', 'vegetable', 'cabbage', 'broccoli'],
            'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy', 'curd', 'paneer'],
            'meat': ['chicken', 'beef', 'fish', 'pork', 'meat', 'seafood', 'mutton', 'egg'],
            'bakery': ['bread', 'cake', 'cookie', 'pastry', 'bun', 'biscuit', 'croissant'],
            'beverages': ['water', 'juice', 'soda', 'coffee', 'tea', 'drink', 'cola'],
            'snacks': ['chips', 'chocolate', 'biscuit', 'cracker', 'snack', 'popcorn', 'nuts'],
            'household': ['soap', 'detergent', 'cleaner', 'tissue', 'paper', 'shampoo'],
            'personal': ['shampoo', 'toothpaste', 'deodorant', 'cream', 'lotion', 'perfume'],
            'frozen': ['ice cream', 'frozen', 'pizza', 'fries', 'vegetables'],
            'grains': ['rice', 'wheat', 'flour', 'pasta', 'noodles', 'cereal', 'oats'],
            'other': []
        };

        itemName = itemName.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => itemName.includes(keyword))) {
                return category;
            }
        }
        
        return 'other';
    },

    async predictPrice(itemName, category) {
        const priceRanges = {
            'fruits': { avg: 80 },
            'vegetables': { avg: 40 },
            'dairy': { avg: 100 },
            'meat': { avg: 300 },
            'bakery': { avg: 80 },
            'beverages': { avg: 60 },
            'snacks': { avg: 50 },
            'household': { avg: 120 },
            'personal': { avg: 200 },
            'frozen': { avg: 150 },
            'grains': { avg: 100 },
            'other': { avg: 100 }
        };

        const range = priceRanges[category] || priceRanges.other;
        
        let multiplier = 1;
        const lowerName = itemName.toLowerCase();
        
        if (lowerName.includes('organic')) multiplier *= 1.5;
        if (lowerName.includes('premium')) multiplier *= 2;
        if (lowerName.includes('imported')) multiplier *= 1.8;
        
        // Specific item prices
        const specificPrices = {
            'milk': 50, 'bread': 35, 'rice': 80, 'egg': 60, 'apple': 120,
            'banana': 40, 'chicken': 200, 'fish': 300, 'oil': 150, 'sugar': 40
        };

        for (const [item, price] of Object.entries(specificPrices)) {
            if (lowerName.includes(item)) return price.toString();
        }
        
        return Math.round(range.avg * multiplier).toString();
    },

    getSmartSuggestions(itemName) {
        const suggestionMap = {
            'milk': [
                { name: 'Curd', price: 40, category: 'dairy' },
                { name: 'Butter', price: 50, category: 'dairy' },
                { name: 'Cheese', price: 120, category: 'dairy' },
                { name: 'Bread', price: 35, category: 'bakery' },
                { name: 'Eggs', price: 60, category: 'meat' }
            ],
            'bread': [
                { name: 'Butter', price: 50, category: 'dairy' },
                { name: 'Jam', price: 80, category: 'snacks' },
                { name: 'Eggs', price: 60, category: 'meat' },
                { name: 'Milk', price: 50, category: 'dairy' },
                { name: 'Cheese', price: 120, category: 'dairy' }
            ],
            'rice': [
                { name: 'Lentils', price: 100, category: 'grains' },
                { name: 'Oil', price: 150, category: 'other' },
                { name: 'Spices', price: 50, category: 'other' },
                { name: 'Vegetables', price: 80, category: 'vegetables' },
                { name: 'Flour', price: 40, category: 'grains' }
            ],
            'default': [
                { name: 'Cooking Oil', price: 150, category: 'other' },
                { name: 'Salt', price: 20, category: 'other' },
                { name: 'Sugar', price: 40, category: 'other' },
                { name: 'Tea', price: 50, category: 'beverages' },
                { name: 'Milk', price: 50, category: 'dairy' }
            ]
        };

        itemName = itemName.toLowerCase();
        for (const [key, suggestions] of Object.entries(suggestionMap)) {
            if (itemName.includes(key)) return suggestions;
        }
        return suggestionMap.default;
    }
};

// Initialize the app
function init() {
    console.log('🚀 Initializing FamilyGrocer...');
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (dateInput) dateInput.value = formattedDate;
    
    setupEventListeners();
    initAI();
    
    // Check auth state after a brief loading period
    setTimeout(() => {
        checkAuthState();
    }, 1500);
}

// Set up event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Authentication
    if (loginTab) loginTab.addEventListener('click', () => switchAuthTab('login'));
    if (signupTab) signupTab.addEventListener('click', () => switchAuthTab('signup'));
    if (loginBtn) loginBtn.addEventListener('click', loginUser);
    if (signupBtn) signupBtn.addEventListener('click', signupUser);
    if (googleLoginBtn) googleLoginBtn.addEventListener('click', () => signInWithGoogle('login'));
    if (googleSignupBtn) googleSignupBtn.addEventListener('click', () => signInWithGoogle('signup'));
    if (forgotPassword) forgotPassword.addEventListener('click', showResetPassword);
    if (resetPasswordBtn) resetPasswordBtn.addEventListener('click', resetPassword);
    if (backToLogin) backToLogin.addEventListener('click', showLoginForm);
    
    // Family setup
    if (createFamilyBtn) createFamilyBtn.addEventListener('click', createFamily);
    if (joinFamilyBtn) joinFamilyBtn.addEventListener('click', joinFamily);
    if (logoutFromSetup) logoutFromSetup.addEventListener('click', logoutUser);
    
    // Main app
    if (addItemBtn) addItemBtn.addEventListener('click', addItem);
    if (itemInput) itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (clearSearch) clearSearch.addEventListener('click', clearSearchInput);
    
    // Categories
    if (categoryButtons) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.category;
                renderItems();
            });
        });
    }
    
    // Navigation
    if (navButtons) {
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });
    }
    
    // Actions
    if (copyFamilyCodeBtn) copyFamilyCodeBtn.addEventListener('click', copyFamilyCode);
    if (changeNameBtn) changeNameBtn.addEventListener('click', changeUserName);
    if (setBudgetBtn) setBudgetBtn.addEventListener('click', setMonthlyBudget);
    if (leaveFamilyBtn) leaveFamilyBtn.addEventListener('click', leaveFamily);
    if (exportDataBtn) exportDataBtn.addEventListener('click', exportShoppingData);
    if (logoutBtn) logoutBtn.addEventListener('click', logoutUser);
    if (headerLogout) headerLogout.addEventListener('click', logoutUser);
    if (clearCompleted) clearCompleted.addEventListener('click', clearCompletedItems);
    if (toggleCompleted) toggleCompleted.addEventListener('click', toggleCompletedVisibility);
}

// Initialize AI functionality
function initAI() {
    console.log('🤖 Initializing AI features...');
    
    if (!itemInput || !aiAssistBtn) {
        console.log('AI elements not found');
        return;
    }

    const handleInput = AIService.debounce(async (e) => {
        const itemName = e.target.value.trim();
        
        if (itemName.length < 2) {
            hideAISuggestions();
            if (pricePrediction) pricePrediction.textContent = '';
            return;
        }

        if (pricePrediction) {
            pricePrediction.innerHTML = '<div class="loading-spinner"></div> Predicting price...';
        }

        try {
            const category = AIService.predictCategory(itemName);
            const predictedPrice = await AIService.predictPrice(itemName, category);
            
            if (pricePrediction) {
                pricePrediction.textContent = `Estimated price: ₹${predictedPrice}`;
            }
            
            if (categorySelect) {
                categorySelect.value = category;
            }
            
            if (priceInput && !priceInput.value) {
                priceInput.value = predictedPrice;
            }
        } catch (error) {
            console.error('Price prediction error:', error);
            if (pricePrediction) pricePrediction.textContent = 'Price prediction unavailable';
        }
    }, 800);

    aiAssistBtn.addEventListener('click', async () => {
        const itemName = itemInput.value.trim();
        if (!itemName) {
            showToast('Please enter an item name first');
            return;
        }
        showAISuggestions(itemName);
    });

    if (closeSuggestions) {
        closeSuggestions.addEventListener('click', hideAISuggestions);
    }

    itemInput.addEventListener('input', handleInput);

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (aiSuggestions && !aiSuggestions.contains(e.target) && e.target !== itemInput && e.target !== aiAssistBtn) {
            hideAISuggestions();
        }
    });
}

function showAISuggestions(itemName) {
    if (!aiSuggestions || !suggestionItems) return;
    
    aiSuggestions.classList.add('active');
    suggestionItems.innerHTML = '<div class="ai-loading"><div class="loading-spinner"></div>Getting smart suggestions...</div>';

    setTimeout(() => {
        const suggestions = AIService.getSmartSuggestions(itemName);
        displaySuggestions(suggestions);
    }, 500);
}

function hideAISuggestions() {
    if (aiSuggestions) {
        aiSuggestions.classList.remove('active');
    }
}

function displaySuggestions(suggestions) {
    if (!suggestions || !suggestionItems) return;
    
    if (suggestions.length === 0) {
        suggestionItems.innerHTML = '<div class="ai-loading">No suggestions available</div>';
        return;
    }

    suggestionItems.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" data-name="${suggestion.name.replace(/"/g, '&quot;')}" data-price="${suggestion.price}" data-category="${suggestion.category}">
            <div class="suggestion-name">${suggestion.name}</div>
            <div class="suggestion-price">₹${suggestion.price}</div>
            <div class="suggestion-category">${suggestion.category}</div>
        </div>
    `).join('');

    // Add event listeners to suggestion items
    suggestionItems.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const category = this.getAttribute('data-category');
            applySuggestion(name, price, category);
        });
    });
}

function applySuggestion(name, price, category) {
    if (itemInput) itemInput.value = name;
    if (priceInput) priceInput.value = price;
    if (categorySelect) categorySelect.value = category;
    hideAISuggestions();
    if (itemInput) itemInput.focus();
    showToast(`Added "${name}" to form`);
}

// Authentication functions
function switchAuthTab(tab) {
    if (loginForm && signupForm && resetPasswordForm) {
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        resetPasswordForm.classList.remove('active');
    }
    
    if (tab === 'login') {
        if (loginTab) loginTab.classList.add('active');
        if (signupTab) signupTab.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
    } else {
        if (signupTab) signupTab.classList.add('active');
        if (loginTab) loginTab.classList.remove('active');
        if (signupForm) signupForm.classList.add('active');
    }
}

function showResetPassword() {
    if (loginForm && signupForm && resetPasswordForm) {
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        resetPasswordForm.classList.add('active');
    }
}

function showLoginForm() {
    if (resetPasswordForm && loginForm) {
        resetPasswordForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

function signInWithGoogle(context) {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log('Google sign-in successful:', user.email);
            
            if (context === 'signup') {
                // Create user document for new signups
                return db.collection('users').doc(user.uid).set({
                    name: user.displayName || 'User',
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: user.photoURL || null
                });
            }
        })
        .then(() => {
            showToast('Signed in successfully with Google!');
        })
        .catch((error) => {
            console.error('Google sign-in error:', error);
            showToast('Google sign-in failed: ' + error.message);
        });
}

function resetPassword() {
    const email = resetEmail ? resetEmail.value.trim() : '';
    if (!email) {
        showToast('Please enter your email address');
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showToast('Password reset email sent! Check your inbox.');
            showLoginForm();
        })
        .catch((error) => {
            showToast('Error sending reset email: ' + error.message);
        });
}

// Check authentication state
function checkAuthState() {
    console.log('🔐 Checking authentication state...');
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('✅ User is authenticated:', user.email);
            currentUser = user;
            checkUserFamily();
        } else {
            console.log('❌ No user authenticated');
            showScreen('auth');
            hideLoadingScreen();
        }
    }, (error) => {
        console.error('Auth state error:', error);
        showScreen('auth');
        hideLoadingScreen();
    });
}

function checkUserFamily() {
    if (!currentUser) {
        showScreen('auth');
        return;
    }

    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists && doc.data().familyId) {
                currentFamily = doc.data().familyId;
                console.log('🏠 User has family:', currentFamily);
                loadFamilyData();
                showScreen('app');
            } else {
                console.log('👥 User needs family setup');
                showScreen('familySetup');
            }
            hideLoadingScreen();
        })
        .catch((error) => {
            console.error("Error getting user document:", error);
            showToast('Error loading user data');
            showScreen('familySetup');
            hideLoadingScreen();
        });
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

function showScreen(screen) {
    console.log('🖥️ Showing screen:', screen);
    
    // Hide all screens first
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (authScreen) authScreen.style.display = 'none';
    if (familySetupScreen) familySetupScreen.style.display = 'none';
    if (appScreen) appScreen.style.display = 'none';
    
    // Show the requested screen
    switch(screen) {
        case 'auth':
            if (authScreen) authScreen.style.display = 'flex';
            break;
        case 'familySetup':
            if (familySetupScreen) familySetupScreen.style.display = 'block';
            break;
        case 'app':
            if (appScreen) appScreen.style.display = 'block';
            // Load user preferences and analytics when app screen is shown
            loadUserPreferences();
            loadAnalytics();
            break;
    }
}

// User authentication functions
function loginUser() {
    const email = loginEmail ? loginEmail.value.trim() : '';
    const password = loginPassword ? loginPassword.value.trim() : '';
    
    if (!email || !password) {
        showToast('Please enter email and password');
        return;
    }
    
    showToast('Signing in...');
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showToast('Login successful!');
        })
        .catch((error) => {
            console.error('Login error:', error);
            showToast('Login failed: ' + error.message);
        });
}

function signupUser() {
    const name = signupName ? signupName.value.trim() : '';
    const email = signupEmail ? signupEmail.value.trim() : '';
    const password = signupPassword ? signupPassword.value.trim() : '';
    
    if (!name || !email || !password) {
        showToast('Please fill all fields');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    showToast('Creating account...');
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Create user document
            return db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                preferences: {
                    budget: 5000,
                    notifications: true
                }
            });
        })
        .then(() => {
            showToast('Account created successfully!');
        })
        .catch((error) => {
            console.error('Signup error:', error);
            showToast('Sign up failed: ' + error.message);
        });
}

// Family management functions
function createFamily() {
    const familyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userName = currentUser.displayName || (signupName ? signupName.value : 'My');
    
    const familyData = {
        name: `${userName}'s Family`,
        createdBy: currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        members: [currentUser.uid],
        monthlyBudget: 5000
    };
    
    showToast('Creating family...');
    
    db.collection('families').doc(familyCode).set(familyData)
    .then(() => {
        // Update user document with family ID
        return db.collection('users').doc(currentUser.uid).set({
            familyId: familyCode,
            name: signupName ? signupName.value : currentUser.displayName || 'User',
            email: currentUser.email
        }, { merge: true });
    })
    .then(() => {
        currentFamily = familyCode;
        showScreen('app');
        loadFamilyData();
        showToast(`Family created! Code: ${familyCode}`);
    })
    .catch((error) => {
        console.error('Error creating family:', error);
        showToast('Error creating family: ' + error.message);
    });
}

function joinFamily() {
    const familyCode = familyCodeInput ? familyCodeInput.value.toUpperCase().trim() : '';
    
    if (!familyCode) {
        showToast('Please enter a family code');
        return;
    }
    
    if (familyCode.length !== 6) {
        showToast('Family code must be 6 characters');
        return;
    }
    
    showToast('Joining family...');
    
    // Check if family exists
    db.collection('families').doc(familyCode).get()
        .then((doc) => {
            if (!doc.exists) {
                throw new Error('Family not found. Check the code and try again.');
            }
            
            // Add user to family members
            return db.collection('families').doc(familyCode).update({
                members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
        })
        .then(() => {
            // Update user document with family ID
            return db.collection('users').doc(currentUser.uid).update({
                familyId: familyCode
            });
        })
        .then(() => {
            currentFamily = familyCode;
            showScreen('app');
            loadFamilyData();
            showToast('Joined family successfully!');
        })
        .catch((error) => {
            console.error('Error joining family:', error);
            showToast('Error joining family: ' + error.message);
        });
}

// Load family data
function loadFamilyData() {
    if (!currentFamily) return;
    
    console.log('📦 Loading family data for:', currentFamily);
    
    // Unsubscribe from previous listeners
    if (itemsUnsubscribe) itemsUnsubscribe();
    if (familyUnsubscribe) familyUnsubscribe();
    
    // Set up real-time listener for grocery items
    itemsUnsubscribe = db.collection('items')
        .where('familyId', '==', currentFamily)
        .onSnapshot((snapshot) => {
            groceryItems = [];
            snapshot.forEach((doc) => {
                groceryItems.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Sort items by creation date (newest first)
            groceryItems.sort((a, b) => {
                const dateA = a.createdAt?.toDate() || new Date(0);
                const dateB = b.createdAt?.toDate() || new Date(0);
                return dateB - dateA;
            });
            
            renderItems();
            updateStats();
            updateMonthlyExpenses();
            loadAnalytics();
        }, (error) => {
            console.error('Error listening to items:', error);
            showToast('Error loading items');
        });
    
    // Set up real-time listener for family members
    familyUnsubscribe = db.collection('families').doc(currentFamily)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const familyData = doc.data();
                loadFamilyMembers(familyData.members);
                if (familyCodeDisplay) familyCodeDisplay.textContent = currentFamily;
                
                // Update family budget
                if (familyData.monthlyBudget) {
                    userBudget = familyData.monthlyBudget;
                }
            }
        }, (error) => {
            console.error('Error listening to family:', error);
            showToast('Error loading family data');
        });
}

function loadFamilyMembers(memberIds) {
    if (!memberIds || !Array.isArray(memberIds)) return;
    
    familyMembers = [];
    if (familyMembersContainer) familyMembersContainer.innerHTML = '';
    
    memberIds.forEach((memberId) => {
        db.collection('users').doc(memberId).get()
            .then((doc) => {
                if (doc.exists) {
                    const member = {
                        id: memberId,
                        ...doc.data()
                    };
                    familyMembers.push(member);
                    
                    if (familyMembersContainer) {
                        const avatar = document.createElement('div');
                        avatar.className = 'member-avatar';
                        avatar.textContent = member.name ? member.name.charAt(0).toUpperCase() : '?';
                        avatar.title = member.name || 'Unknown User';
                        familyMembersContainer.appendChild(avatar);
                    }
                }
            })
            .catch(error => {
                console.error('Error loading member:', error);
            });
    });
}

// Item management functions
function addItem() {
    const name = itemInput ? itemInput.value.trim() : '';
    const quantity = parseInt(qtyInput ? qtyInput.value : 1) || 1;
    const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
    const category = categorySelect ? categorySelect.value : 'uncategorized';
    const dateNeeded = dateInput ? dateInput.value : '';
    const isUrgent = urgentCheckbox ? urgentCheckbox.checked : false;
    const isRecurring = repeatCheckbox ? repeatCheckbox.checked : false;
    
    if (name === '') {
        showToast('Please enter an item name');
        return;
    }
    
    if (category === 'uncategorized') {
        showToast('Please select a category');
        return;
    }
    
    const itemData = {
        name,
        quantity,
        price,
        category,
        dateNeeded,
        isUrgent,
        isRecurring,
        completed: false,
        addedBy: currentUser.uid,
        addedByName: 'User', // Show generic name instead of actual user name
        familyId: currentFamily,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('items').add(itemData)
    .then(() => {
        // Reset form
        if (itemInput) itemInput.value = '';
        if (qtyInput) qtyInput.value = '1';
        if (priceInput) priceInput.value = '';
        if (categorySelect) categorySelect.value = 'uncategorized';
        if (urgentCheckbox) urgentCheckbox.checked = false;
        if (repeatCheckbox) repeatCheckbox.checked = false;
        if (itemInput) itemInput.focus();
        
        showToast('Item added successfully');
    })
    .catch((error) => {
        console.error('Error adding item:', error);
        showToast('Error adding item: ' + error.message);
    });
}

function toggleItem(id) {
    const item = groceryItems.find(item => item.id === id);
    if (item) {
        const newCompletedState = !item.completed;
        
        db.collection('items').doc(id).update({
            completed: newCompletedState,
            completedBy: newCompletedState ? currentUser.uid : null,
            completedAt: newCompletedState ? firebase.firestore.FieldValue.serverTimestamp() : null,
            completedByName: newCompletedState ? 'User' : null // Generic name
        })
        .catch((error) => {
            console.error('Error updating item:', error);
            showToast('Error updating item: ' + error.message);
        });
    }
}

function claimItem(id) {
    db.collection('items').doc(id).update({
        claimedBy: currentUser.uid,
        claimedByName: 'User', // Generic name
        claimedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        showToast('Item claimed');
    })
    .catch((error) => {
        console.error('Error claiming item:', error);
        showToast('Error claiming item: ' + error.message);
    });
}

function unclaimItem(id) {
    db.collection('items').doc(id).update({
        claimedBy: null,
        claimedByName: null,
        claimedAt: null
    })
    .then(() => {
        showToast('Item unclaimed');
    })
    .catch((error) => {
        console.error('Error unclaiming item:', error);
        showToast('Error unclaiming item: ' + error.message);
    });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        db.collection('items').doc(id).delete()
            .then(() => {
                showToast('Item deleted');
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
                showToast('Error deleting item: ' + error.message);
            });
    }
}

// Render items based on current filter and search
function renderItems() {
    if (!pendingItemsContainer || !completedItemsContainer) return;
    
    let filteredItems = groceryItems.filter(item => {
        const matchesCategory = currentFilter === 'all' || 
                              (currentFilter === 'urgent' ? item.isUrgent : 
                              (currentFilter === 'claimed' ? item.claimedBy : 
                              (currentFilter === 'recurring' ? item.isRecurring : item.category === currentFilter)));
        const matchesSearch = item.name.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });
    
    const pendingItems = filteredItems.filter(item => !item.completed);
    const completedItems = filteredItems.filter(item => item.completed);
    
    // Render pending items
    if (pendingItems.length > 0) {
        pendingItemsContainer.innerHTML = pendingItems.map(item => createItemHTML(item)).join('');
    } else {
        pendingItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <p>No items to buy</p>
                <button class="outline" onclick="focusItemInput()">Add Your First Item</button>
            </div>
        `;
    }
    
    // Render completed items
    if (completedItems.length > 0) {
        completedItemsContainer.innerHTML = completedItems.map(item => createItemHTML(item)).join('');
    } else {
        completedItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <p>No completed items yet</p>
            </div>
        `;
    }
    
    // Add event listeners to the newly created elements
    addItemEventListeners();
    
    // Update counts
    if (pendingCountSpan) pendingCountSpan.textContent = `(${pendingItems.length})`;
    if (completedCountSpan) completedCountSpan.textContent = `(${completedItems.length})`;
}

function focusItemInput() {
    if (itemInput) itemInput.focus();
}

function addItemEventListeners() {
    // Checkbox event listeners
    document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.grocery-item');
            if (itemElement) {
                const id = itemElement.dataset.id;
                toggleItem(id);
            }
        });
    });
    
    // Claim button event listeners
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.grocery-item');
            if (itemElement) {
                const id = itemElement.dataset.id;
                claimItem(id);
            }
        });
    });
    
    // Unclaim button event listeners
    document.querySelectorAll('.unclaim-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.grocery-item');
            if (itemElement) {
                const id = itemElement.dataset.id;
                unclaimItem(id);
            }
        });
    });
    
    // Delete button event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemElement = e.target.closest('.grocery-item');
            if (itemElement) {
                const id = itemElement.dataset.id;
                deleteItem(id);
            }
        });
    });
}

function createItemHTML(item) {
    const categoryLabels = {
        'uncategorized': 'Uncategorized',
        'fruits': 'Fruits & Veg',
        'dairy': 'Dairy',
        'meat': 'Meat & Fish',
        'bakery': 'Bakery',
        'beverages': 'Beverages',
        'snacks': 'Snacks',
        'household': 'Household',
        'personal': 'Personal Care',
        'frozen': 'Frozen Foods',
        'grains': 'Grains',
        'other': 'Other'
    };
    
    const totalPrice = (item.quantity * item.price).toFixed(2);
    const formattedDate = formatDate(item.dateNeeded);
    const isUrgent = item.isUrgent && !item.completed;
    const isClaimed = item.claimedBy && !item.completed;
    const isAddedByCurrentUser = item.addedBy === currentUser.uid;
    const isClaimedByCurrentUser = item.claimedBy === currentUser.uid;
    
    return `
        <div class="grocery-item ${item.completed ? 'checked' : ''} ${isUrgent ? 'urgent' : ''} ${isClaimed ? 'claimed' : ''}" data-id="${item.id}">
            <div class="checkbox item-checkbox ${item.completed ? 'checked' : ''}">
                ${item.completed ? '✓' : ''}
            </div>
            <div class="item-details">
                <div class="item-name">
                    ${item.name} 
                    ${isUrgent ? '<span class="urgent-badge">URGENT</span>' : ''}
                    ${isClaimed ? `<span class="claimed-badge">CLAIMED</span>` : ''}
                    ${item.isRecurring ? '<span class="claimed-badge" style="background: var(--accent);">🔁</span>' : ''}
                </div>
                <div class="item-meta">
                    <span class="item-category">${categoryLabels[item.category] || item.category}</span>
                    <span class="item-qty">📦 ${item.quantity}</span>
                    ${item.price > 0 ? `<span class="item-price">₹${item.price} × ${item.quantity} = ₹${totalPrice}</span>` : ''}
                    <span class="item-date">📅 ${formattedDate}</span>
                    <span class="item-added-by">
                        <div class="user-avatar">U</div>
                        Added by User
                    </span>
                </div>
            </div>
            <div class="item-actions">
                ${!item.completed ? (
                    isClaimed ? (
                        isClaimedByCurrentUser ? 
                        '<button class="action-btn outline unclaim-btn">Unclaim</button>' :
                        '<button class="action-btn outline" disabled>Claimed</button>'
                    ) : (
                        '<button class="action-btn secondary claim-btn">I\'ll Buy</button>'
                    )
                ) : ''}
                ${isAddedByCurrentUser || isClaimedByCurrentUser ? 
                    '<button class="action-btn danger delete-btn">Delete</button>' : ''}
            </div>
        </div>
    `;
}

// Search functionality
function handleSearch(e) {
    currentSearch = e.target.value.toLowerCase();
    renderItems();
}

function clearSearchInput() {
    if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
        renderItems();
    }
}

// Tab navigation
function switchTab(tabName) {
    // Update nav buttons
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab contents
    tabContents.forEach(tab => {
        tab.classList.toggle('active', tab.id === `${tabName}Tab`);
    });
    
    // Load tab-specific data
    if (tabName === 'analytics') {
        loadAnalytics();
    } else if (tabName === 'family') {
        loadFamilyTab();
    } else if (tabName === 'settings') {
        loadSettingsTab();
    }
}

function loadFamilyTab() {
    if (!familyMembersList) return;
    
    familyMembersList.innerHTML = '';
    
    if (familyMembers.length === 0) {
        familyMembersList.innerHTML = '<p>Loading family members...</p>';
        return;
    }
    
    familyMembers.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'user-info';
        memberElement.innerHTML = `
            <div class="user-avatar-large">${member.name ? member.name.charAt(0).toUpperCase() : 'U'}</div>
            <div class="user-details">
                <h3>${member.name || 'User'}</h3>
                <p>${member.email || 'No email'}</p>
            </div>
        `;
        familyMembersList.appendChild(memberElement);
    });
    
    // Update family stats
    updateFamilyStats();
}

function loadSettingsTab() {
    if (!userNameDisplay || !userEmailDisplay || !userAvatarLarge) return;
    
    // Load user data
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                userNameDisplay.textContent = userData.name || 'User';
                userEmailDisplay.textContent = currentUser.email;
                userAvatarLarge.textContent = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
                
                // Load preferences
                if (userData.preferences) {
                    userPreferences = userData.preferences;
                    userBudget = userData.preferences.budget || 5000;
                }
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
}

// Analytics functions
function loadAnalytics() {
    updateMonthlyExpenses();
    updateCategoryChart();
    updateRecentPurchases();
    updateFamilyStats();
}

function updateMonthlyExpenses() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter items from current month
    const monthlyItems = groceryItems.filter(item => {
        if (!item.completed || !item.completedAt) return false;
        
        const completedDate = item.completedAt.toDate();
        return completedDate.getMonth() === currentMonth && 
               completedDate.getFullYear() === currentYear;
    });
    
    const totalSpent = monthlyItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const itemsBought = monthlyItems.length;
    const avgSpend = itemsBought > 0 ? totalSpent / itemsBought : 0;
    const savings = userBudget - totalSpent;
    
    // Update UI
    if (totalSpentSpan) totalSpentSpan.textContent = `₹${totalSpent.toFixed(0)}`;
    if (itemsBoughtSpan) itemsBoughtSpan.textContent = itemsBought;
    if (avgSpendSpan) avgSpendSpan.textContent = `₹${avgSpend.toFixed(0)}`;
    if (savingsSpan) savingsSpan.textContent = `₹${Math.max(0, savings).toFixed(0)}`;
    if (monthlyExpenseSpan) monthlyExpenseSpan.textContent = `₹${totalSpent.toFixed(0)}`;
    
    // Update budget progress
    const budgetUsage = (totalSpent / userBudget) * 100;
    if (monthlySavingsSpan) monthlySavingsSpan.textContent = `Monthly spent: ₹${totalSpent.toFixed(0)}`;
    if (budgetProgressSpan) budgetProgressSpan.textContent = `${Math.min(100, budgetUsage).toFixed(0)}% of budget`;
}

function updateCategoryChart() {
    if (!categoryChart) return;
    
    const completedItems = groceryItems.filter(item => item.completed);
    const categoryTotals = {};
    
    completedItems.forEach(item => {
        const category = item.category || 'other';
        const total = item.quantity * item.price;
        categoryTotals[category] = (categoryTotals[category] || 0) + total;
    });
    
    const totalSpent = Object.values(categoryTotals).reduce((sum, total) => sum + total, 0);
    
    let chartHTML = '';
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const percentage = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
        chartHTML += `
            <div class="chart-bar">
                <div class="chart-label">${category}</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="chart-value">₹${total.toFixed(0)}</div>
            </div>
        `;
    });
    
    categoryChart.innerHTML = chartHTML || '<p>No spending data available</p>';
}

function updateRecentPurchases() {
    if (!recentPurchases) return;
    
    const completedItems = groceryItems
        .filter(item => item.completed)
        .sort((a, b) => {
            const dateA = a.completedAt?.toDate() || new Date(0);
            const dateB = b.completedAt?.toDate() || new Date(0);
            return dateB - dateA;
        })
        .slice(0, 10); // Show last 10 purchases
    
    if (completedItems.length === 0) {
        recentPurchases.innerHTML = '<p>No recent purchases</p>';
        return;
    }
    
    recentPurchases.innerHTML = completedItems.map(item => `
        <div class="purchase-item">
            <div class="purchase-info">
                <div class="purchase-name">${item.name}</div>
                <div class="purchase-meta">${formatDate(item.completedAt?.toDate())} • ${item.quantity} × ₹${item.price}</div>
            </div>
            <div class="purchase-price">₹${(item.quantity * item.price).toFixed(2)}</div>
        </div>
    `).join('');
}

function updateFamilyStats() {
    if (!topShopperSpan || !familyTotalItemsSpan) return;
    
    // Simple implementation - in real app, you'd track this properly
    const completedItems = groceryItems.filter(item => item.completed);
    familyTotalItemsSpan.textContent = completedItems.length;
    topShopperSpan.textContent = 'User'; // Generic name
}

function updateFamilyStats() {
    // Find most active shopper
    const shopperStats = {};
    groceryItems.forEach(item => {
        if (item.completed && item.completedByName) {
            shopperStats[item.completedByName] = (shopperStats[item.completedByName] || 0) + 1;
        }
    });
    
    let topShopper = 'User';
    let maxItems = 0;
    
    Object.entries(shopperStats).forEach(([shopper, count]) => {
        if (count > maxItems) {
            maxItems = count;
            topShopper = shopper;
        }
    });
    
    if (topShopperSpan) topShopperSpan.textContent = topShopper;
    if (familyTotalItemsSpan) {
        familyTotalItemsSpan.textContent = groceryItems.filter(item => item.completed).length;
    }
}

function updateStats() {
    const total = groceryItems.length;
    const completed = groceryItems.filter(item => item.completed).length;
    const totalCost = groceryItems
        .filter(item => !item.completed)
        .reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    if (totalItemsSpan) totalItemsSpan.textContent = total;
    if (completedItemsSpan) completedItemsSpan.textContent = completed;
    if (estimatedTotalSpan) estimatedTotalSpan.textContent = `₹${totalCost.toFixed(2)}`;
}

// Utility functions
function formatDate(date) {
    if (!date) return 'No date';
    
    if (typeof date === 'string') {
        date = new Date(date);
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return date > now ? 'Tomorrow' : 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
    });
}

function showToast(message) {
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// User preferences and settings
function loadUserPreferences() {
    if (!currentUser) return;
    
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists && doc.data().preferences) {
                userPreferences = doc.data().preferences;
                userBudget = userPreferences.budget || 5000;
            }
        })
        .catch(error => {
            console.error('Error loading preferences:', error);
        });
}

function setMonthlyBudget() {
    const newBudget = prompt('Enter your monthly budget (₹):', userBudget);
    if (newBudget && !isNaN(newBudget) && newBudget > 0) {
        userBudget = parseInt(newBudget);
        
        // Update user preferences
        userPreferences.budget = userBudget;
        
        db.collection('users').doc(currentUser.uid).set({
            preferences: userPreferences
        }, { merge: true })
        .then(() => {
            showToast(`Monthly budget set to ₹${userBudget}`);
            updateMonthlyExpenses();
        })
        .catch(error => {
            console.error('Error updating budget:', error);
            showToast('Error updating budget');
        });
    }
}

function changeUserName() {
    const newName = prompt('Enter your display name:', userNameDisplay.textContent);
    if (newName && newName.trim() !== '') {
        db.collection('users').doc(currentUser.uid).update({
            name: newName.trim()
        })
        .then(() => {
            showToast('Name updated successfully!');
            loadSettingsTab();
        })
        .catch(error => {
            showToast('Error updating name: ' + error.message);
        });
    }
}

function leaveFamily() {
    if (confirm('Are you sure you want to leave this family group? You will need a family code to rejoin.')) {
        db.collection('families').doc(currentFamily).update({
            members: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
        })
        .then(() => {
            return db.collection('users').doc(currentUser.uid).update({
                familyId: null
            });
        })
        .then(() => {
            currentFamily = null;
            showScreen('familySetup');
            showToast('You have left the family group');
        })
        .catch(error => {
            showToast('Error leaving family: ' + error.message);
        });
    }
}

function exportShoppingData() {
    const data = {
        exportedAt: new Date().toISOString(),
        familyCode: currentFamily,
        items: groceryItems,
        monthlyExpenses: monthlyExpenses,
        preferences: userPreferences
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `familygrocer-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Data exported successfully!');
}

function copyFamilyCode() {
    if (!currentFamily) return;
    
    navigator.clipboard.writeText(currentFamily)
        .then(() => {
            showToast('Family code copied to clipboard!');
        })
        .catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentFamily;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Family code copied!');
        });
}

function clearCompletedItems() {
    const completedItems = groceryItems.filter(item => item.completed);
    if (completedItems.length === 0) {
        showToast('No completed items to clear');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${completedItems.length} completed items?`)) {
        const batch = db.batch();
        completedItems.forEach(item => {
            const ref = db.collection('items').doc(item.id);
            batch.delete(ref);
        });
        
        batch.commit()
            .then(() => {
                showToast(`${completedItems.length} items cleared`);
            })
            .catch(error => {
                console.error('Error clearing items:', error);
                showToast('Error clearing items');
            });
    }
}

function toggleCompletedVisibility() {
    completedVisible = !completedVisible;
    if (completedItemsContainer) {
        completedItemsContainer.style.display = completedVisible ? 'block' : 'none';
    }
    if (toggleCompleted) {
        toggleCompleted.textContent = completedVisible ? 'Hide' : 'Show';
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        // Unsubscribe from listeners
        if (itemsUnsubscribe) itemsUnsubscribe();
        if (familyUnsubscribe) familyUnsubscribe();
        
        auth.signOut()
            .then(() => {
                currentUser = null;
                currentFamily = null;
                groceryItems = [];
                familyMembers = [];
                showScreen('auth');
                showToast('Logged out successfully');
            })
            .catch(error => {
                showToast('Error logging out: ' + error.message);
            });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make some functions globally available for HTML onclick attributes
window.focusItemInput = focusItemInput;
