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
const unitSelect = document.getElementById('unitSelect');
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
const monthlyItemsSpan = document.getElementById('monthly-items');
const pendingCountSpan = document.getElementById('pending-count');
const completedCountSpan = document.getElementById('completed-count');
const claimedCountSpan = document.getElementById('claimed-count');
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
const addPriceBtn = document.getElementById('addPriceBtn');
const toast = document.getElementById('toast');

// Purchase-related elements
const purchaseItemSelect = document.getElementById('purchaseItemSelect');
const purchasePrice = document.getElementById('purchasePrice');
const purchaseStore = document.getElementById('purchaseStore');
const purchaseDate = document.getElementById('purchaseDate');
const savePriceBtn = document.getElementById('savePriceBtn');
const monthlyPurchasesSpan = document.getElementById('monthly-purchases');
const monthlyTotalSpan = document.getElementById('monthly-total');
const monthlyAverageSpan = document.getElementById('monthly-average');
const recentPurchasesList = document.getElementById('recent-purchases-list');

// Family stats elements
const topShopperSpan = document.getElementById('topShopper');
const familyTotalItemsSpan = document.getElementById('familyTotalItems');
const familyPurchasedItemsSpan = document.getElementById('familyPurchasedItems');
const familyUrgentItemsSpan = document.getElementById('familyUrgentItems');

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
let completedVisible = false;
let userPreferences = {};

// Initialize the app
function init() {
    console.log('🚀 Initializing FamilyGrocer...');
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    if (dateInput) dateInput.value = formattedDate;
    if (purchaseDate) purchaseDate.value = formattedDate;
    
    setupEventListeners();
    checkAuthState();
}

// Set up event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Authentication tabs
    if (loginTab) loginTab.addEventListener('click', () => switchAuthTab('login'));
    if (signupTab) signupTab.addEventListener('click', () => switchAuthTab('signup'));
    
    // Authentication buttons
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
    
    // Navigation tabs
    if (navButtons) {
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });
    }
    
    // Purchase-related listeners
    if (savePriceBtn) savePriceBtn.addEventListener('click', savePurchasePrice);
    if (purchaseItemSelect) purchaseItemSelect.addEventListener('change', updatePurchaseForm);
    if (addPriceBtn) addPriceBtn.addEventListener('click', () => switchTab('purchases'));
    
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
            loadUserPreferences();
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
            return db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                preferences: {
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
        members: [currentUser.uid]
    };
    
    showToast('Creating family...');
    
    db.collection('families').doc(familyCode).set(familyData)
    .then(() => {
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
    
    db.collection('families').doc(familyCode).get()
        .then((doc) => {
            if (!doc.exists) {
                throw new Error('Family not found. Check the code and try again.');
            }
            
            return db.collection('families').doc(familyCode).update({
                members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            });
        })
        .then(() => {
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
            updatePurchaseItemsList();
            updateRecentPurchases();
            updateFamilyStats();
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
    const quantity = parseFloat(qtyInput ? qtyInput.value : 1) || 1;
    const unit = unitSelect ? unitSelect.value : 'pcs';
    const category = categorySelect ? categorySelect.value : 'uncategorized';
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
        unit,
        category,
        isUrgent,
        isRecurring,
        completed: false,
        addedBy: currentUser.uid,
        addedByName: 'User',
        familyId: currentFamily,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        price: null,
        purchaseDate: null,
        store: null,
        claimedBy: null,
        claimedByName: null,
        claimedAt: null
    };
    
    db.collection('items').add(itemData)
    .then(() => {
        // Reset form
        if (itemInput) itemInput.value = '';
        if (qtyInput) qtyInput.value = '1';
        if (unitSelect) unitSelect.value = 'pcs';
        if (categorySelect) categorySelect.value = 'uncategorized';
        if (urgentCheckbox) urgentCheckbox.checked = false;
        if (repeatCheckbox) repeatCheckbox.checked = false;
        if (itemInput) itemInput.focus();
        
        showToast('Item added to list successfully');
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
            completedByName: newCompletedState ? 'User' : null
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
        claimedByName: 'User',
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

// Purchase price functions
function savePurchasePrice() {
    const itemId = purchaseItemSelect ? purchaseItemSelect.value : '';
    const price = parseFloat(purchasePrice ? purchasePrice.value : 0);
    const store = purchaseStore ? purchaseStore.value.trim() : '';
    const date = purchaseDate ? purchaseDate.value : '';
    
    if (!itemId) {
        showToast('Please select an item');
        return;
    }
    
    if (!price || price <= 0) {
        showToast('Please enter a valid price');
        return;
    }
    
    if (!store) {
        showToast('Please enter store name');
        return;
    }
    
    db.collection('items').doc(itemId).update({
        price: price,
        store: store,
        purchaseDate: date,
        completed: true,
        completedAt: firebase.firestore.FieldValue.serverTimestamp(),
        completedBy: currentUser.uid,
        completedByName: 'User'
    })
    .then(() => {
        // Reset purchase form
        if (purchasePrice) purchasePrice.value = '';
        if (purchaseStore) purchaseStore.value = '';
        if (purchaseItemSelect) purchaseItemSelect.value = '';
        
        showToast('Purchase price saved successfully');
        updatePurchaseItemsList();
    })
    .catch((error) => {
        console.error('Error saving price:', error);
        showToast('Error saving price: ' + error.message);
    });
}

function updatePurchaseItemsList() {
    if (!purchaseItemSelect) return;
    
    // Get items that are completed but don't have prices yet
    const unpricedItems = groceryItems.filter(item => 
        item.completed && (!item.price || item.price === 0)
    );
    
    purchaseItemSelect.innerHTML = '<option value="">-- Select purchased item --</option>';
    
    unpricedItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (${item.quantity} ${item.unit})`;
        purchaseItemSelect.appendChild(option);
    });
    
    // Show/hide add price button based on unpriced items
    if (addPriceBtn) {
        addPriceBtn.style.display = unpricedItems.length > 0 ? 'inline-block' : 'none';
    }
}

function updatePurchaseForm() {
    const itemId = purchaseItemSelect.value;
    const item = groceryItems.find(item => item.id === itemId);
    
    if (item && purchaseDate) {
        // Set purchase date to today if not already set
        const today = new Date().toISOString().split('T')[0];
        purchaseDate.value = today;
    }
}

// Render items
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
                <p>No purchased items yet</p>
            </div>
        `;
    }
    
    // Add event listeners
    addItemEventListeners();
    
    // Update counts
    updateStats();
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
    
    const formattedDate = formatDate(item.purchaseDate);
    const isUrgent = item.isUrgent && !item.completed;
    const isClaimed = item.claimedBy && !item.completed;
    const isAddedByCurrentUser = item.addedBy === currentUser.uid;
    const isClaimedByCurrentUser = item.claimedBy === currentUser.uid;
    const hasPrice = item.price && item.price > 0;
    
    return `
        <div class="grocery-item ${item.completed ? 'checked' : ''} ${isUrgent ? 'urgent' : ''} ${isClaimed ? 'claimed' : ''}" data-id="${item.id}">
            <div class="checkbox item-checkbox ${item.completed ? 'checked' : ''}">
                ${item.completed ? '✓' : ''}
            </div>
            <div class="item-details">
                <div class="item-name">
                    ${item.name} 
                    ${isUrgent ? '<span class="urgent-badge">URGENT</span>' : ''}
                    ${isClaimed ? '<span class="claimed-badge">CLAIMED</span>' : ''}
                    ${item.isRecurring ? '<span class="claimed-badge" style="background: var(--accent);">🔁</span>' : ''}
                    ${hasPrice ? `<span class="item-price-added">₹${item.price}</span>` : ''}
                </div>
                <div class="item-meta">
                    <span class="item-category">${categoryLabels[item.category] || item.category}</span>
                    <span class="item-qty">${item.quantity} ${item.unit}</span>
                    ${hasPrice ? `<span class="item-store">${item.store || ''} • ${formattedDate}</span>` : ''}
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
    if (tabName === 'purchases') {
        updatePurchaseItemsList();
        updateRecentPurchases();
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
                }
            }
        })
        .catch(error => {
            console.error('Error loading user data:', error);
        });
}

// Stats and analytics
function updateStats() {
    const total = groceryItems.length;
    const completed = groceryItems.filter(item => item.completed).length;
    const claimed = groceryItems.filter(item => item.claimedBy && !item.completed).length;
    const pending = total - completed;
    
    // Monthly stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyItems = groceryItems.filter(item => {
        if (!item.completedAt) return false;
        const completedDate = item.completedAt.toDate();
        return completedDate.getMonth() === currentMonth && 
               completedDate.getFullYear() === currentYear;
    });
    
    const purchasedItems = groceryItems.filter(item => item.price && item.price > 0);
    const monthlyPurchases = purchasedItems.filter(item => {
        if (!item.purchaseDate) return false;
        const purchaseDate = new Date(item.purchaseDate);
        return purchaseDate.getMonth() === currentMonth && 
               purchaseDate.getFullYear() === currentYear;
    });
    
    const monthlyTotal = monthlyPurchases.reduce((sum, item) => sum + (item.price || 0), 0);
    const monthlyAverage = monthlyPurchases.length > 0 ? monthlyTotal / monthlyPurchases.length : 0;
    
    // Update UI
    if (totalItemsSpan) totalItemsSpan.textContent = total;
    if (completedItemsSpan) completedItemsSpan.textContent = completed;
    if (monthlyItemsSpan) monthlyItemsSpan.textContent = monthlyItems.length;
    if (claimedCountSpan) claimedCountSpan.textContent = claimed;
    if (pendingCountSpan) pendingCountSpan.textContent = pending;
    if (completedCountSpan) completedCountSpan.textContent = completed;
    
    // Purchase stats
    if (monthlyPurchasesSpan) monthlyPurchasesSpan.textContent = monthlyPurchases.length;
    if (monthlyTotalSpan) monthlyTotalSpan.textContent = `₹${monthlyTotal.toFixed(0)}`;
    if (monthlyAverageSpan) monthlyAverageSpan.textContent = `₹${monthlyAverage.toFixed(0)}`;
}

function updateRecentPurchases() {
    if (!recentPurchasesList) return;
    
    const purchasedItems = groceryItems
        .filter(item => item.price && item.price > 0)
        .sort((a, b) => {
            const dateA = a.purchaseDate ? new Date(a.purchaseDate) : new Date(0);
            const dateB = b.purchaseDate ? new Date(b.purchaseDate) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 10);
    
    if (purchasedItems.length === 0) {
        recentPurchasesList.innerHTML = '<p class="empty-state">No purchases yet</p>';
        return;
    }
    
    recentPurchasesList.innerHTML = purchasedItems.map(item => `
        <div class="purchase-record">
            <div class="purchase-info">
                <div class="purchase-item-name">${item.name}</div>
                <div class="purchase-details">${item.quantity} ${item.unit} • ${item.store || 'Unknown store'} • ${formatDate(item.purchaseDate)}</div>
            </div>
            <div class="purchase-price">₹${item.price.toFixed(2)}</div>
        </div>
    `).join('');
}

function updateFamilyStats() {
    if (!topShopperSpan || !familyTotalItemsSpan || !familyPurchasedItemsSpan || !familyUrgentItemsSpan) return;
    
    const completedItems = groceryItems.filter(item => item.completed);
    const purchasedItems = groceryItems.filter(item => item.price && item.price > 0);
    const urgentItems = groceryItems.filter(item => item.isUrgent);
    
    // Simple implementation for top shopper
    const shopperCounts = {};
    completedItems.forEach(item => {
        if (item.completedByName) {
            shopperCounts[item.completedByName] = (shopperCounts[item.completedByName] || 0) + 1;
        }
    });
    
    let topShopper = 'User';
    let maxCount = 0;
    Object.entries(shopperCounts).forEach(([shopper, count]) => {
        if (count > maxCount) {
            maxCount = count;
            topShopper = shopper;
        }
    });
    
    topShopperSpan.textContent = topShopper;
    familyTotalItemsSpan.textContent = groceryItems.length;
    familyPurchasedItemsSpan.textContent = purchasedItems.length;
    familyUrgentItemsSpan.textContent = urgentItems.length;
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'No date';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return 'Invalid date';
    }
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
            }
        })
        .catch(error => {
            console.error('Error loading preferences:', error);
        });
}

function setMonthlyBudget() {
    const newBudget = prompt('Enter your monthly budget (₹):', userPreferences.budget || 5000);
    if (newBudget && !isNaN(newBudget) && newBudget > 0) {
        userPreferences.budget = parseInt(newBudget);
        
        db.collection('users').doc(currentUser.uid).set({
            preferences: userPreferences
        }, { merge: true })
        .then(() => {
            showToast(`Monthly budget set to ₹${userPreferences.budget}`);
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
