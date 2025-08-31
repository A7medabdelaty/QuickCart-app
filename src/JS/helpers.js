// Helper Utilities
export class Helpers {
    // Smooth scrolling for anchor links
    static setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Form validation
    static validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            const errorElement = form.querySelector(`#${input.id}Error`);
            
            if (!input.value.trim()) {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
                input.classList.add('error');
            } else {
                if (errorElement) {
                    errorElement.textContent = '';
                }
                input.classList.remove('error');
            }

            // Email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                    input.classList.add('error');
                }
            }
        });

        return isValid;
    }

    // Show notification
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Loading state for buttons
    static setupButtonLoading() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    setTimeout(() => {
                        this.classList.remove('loading');
                    }, 1000);
                }
            });
        });
    }

    // Format currency
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
