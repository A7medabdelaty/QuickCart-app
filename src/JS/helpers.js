import { CONSTANTS } from "./constants.js";

export class Helpers {
    static setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    static renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ""}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    static validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach((input) => {
            const errorElement = form.querySelector(`#${input.id}Error`);
            
            if (!input.value.trim()) {
                isValid = false;
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
                input.classList.add(CONSTANTS.CSS_CLASSES.ERROR);
            } else {
                if (errorElement) {
                    errorElement.textContent = '';
                }
                input.classList.remove(CONSTANTS.CSS_CLASSES.ERROR);
            }

            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                    }
                    input.classList.add(CONSTANTS.CSS_CLASSES.ERROR);
                }
            }
        });

        return isValid;
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `${CONSTANTS.CSS_CLASSES.NOTIFICATION} ${CONSTANTS.CSS_CLASSES.NOTIFICATION}-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, CONSTANTS.NOTIFICATION_DURATION);
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

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

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
}
