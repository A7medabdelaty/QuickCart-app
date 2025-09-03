import { CONSTANTS } from "./constants.js";
import { Helpers } from "./helpers.js";

export class Navbar {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.setupMobileToggle();
        this.updateActiveLink();
    }

    setupMobileToggle() {
        if (!this.hamburger || !this.navMenu) {
            console.warn('Mobile navigation elements not found');
            return;
        }
        
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle(CONSTANTS.CSS_CLASSES.ACTIVE);
            this.navMenu.classList.toggle(CONSTANTS.CSS_CLASSES.ACTIVE);
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove(CONSTANTS.CSS_CLASSES.ACTIVE);
                this.navMenu.classList.remove(CONSTANTS.CSS_CLASSES.ACTIVE);
            });
        });
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!sections.length || !navLinks.length) return;

        const updateActive = () => {
            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - CONSTANTS.SCROLL_OFFSET)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove(CONSTANTS.CSS_CLASSES.ACTIVE);
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add(CONSTANTS.CSS_CLASSES.ACTIVE);
                }
            });
        };

        const debouncedUpdateActive = Helpers.debounce(updateActive, 100);
        window.addEventListener('scroll', debouncedUpdateActive);
    }
}
