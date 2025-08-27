export class AuthManager {
    constructor() {
        this.currentUser = document.getElementById('currentUser');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        this.init();
    }

    init() {
        this.updateUserStatus();
        this.setupLogout();
    }

    updateUserStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username') || 'Guest';
        
        if (this.currentUser) {
            this.currentUser.textContent = isLoggedIn ? username : 'Guest';
        }
        
        if (this.logoutBtn) {
            this.logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
        }
    }

    setupLogout() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    login(username) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        this.updateUserStatus();
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        this.updateUserStatus();
        window.location.href = 'login.html';
    }

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    getCurrentUser() {
        return localStorage.getItem('username') || null;
    }
}
