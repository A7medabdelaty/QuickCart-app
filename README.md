# QuickCart - E-Commerce Web Application

A modern, responsive e-commerce web application built with vanilla JavaScript, featuring product browsing, shopping cart functionality, user authentication, and a sleek user interface.

## 🚀 Features

### Core Functionality
- **Product Catalog** - Browse products from multiple categories
- **Product Details** - Detailed product pages with images, descriptions, and ratings
- **Shopping Cart** - Add/remove items, quantity management, and cart persistence
- **User Authentication** - Login/logout functionality with session management
- **Responsive Design** - Mobile-first design that works on all devices

### Advanced Features
- **Product Filtering** - Filter by category and price range
- **Product Sorting** - Sort by price, rating, and name (ascending/descending)
- **Banner Carousel** - Promotional banners with auto-slide functionality
- **Real-time Cart Updates** - Live cart count and notifications
- **Form Validation** - Contact form with validation
- **Loading States** - Smooth loading animations and error handling

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript (ES6+)** - Modular architecture with classes
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

### External APIs
- **Fake Store API** - Product data and user authentication
- **Placeholder.com** - Fallback images for banners

### Architecture
- **Modular JavaScript** - Organized into separate modules
- **CSS Variables** - Design system with consistent theming
- **Component-based CSS** - Reusable styling components
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
QuickCart app/
├── index.html              # Main homepage
├── cart.html              # Shopping cart page
├── checkout.html          # Checkout page
├── login.html             # Login page
├── product-details.html   # Product details page
├── README.md              # Project documentation
├── assets/
│   └── banners/           # Banner images for carousel
├── src/
│   ├── js/
│   │   ├── api.js         # API service layer
│   │   ├── auth.js        # Authentication logic
│   │   ├── auth-check.js  # Authentication middleware
│   │   ├── base-page.js   # Base page class
│   │   ├── carousel.js    # Banner carousel functionality
│   │   ├── cart.js        # Cart page logic
│   │   ├── checkout.js    # Checkout page logic
│   │   ├── helpers.js     # Utility functions
│   │   ├── home.js        # Homepage logic
│   │   └── product-details.js # Product details logic
│   └── styles/
│       ├── main.css       # Main stylesheet with imports
│       ├── variables.css  # CSS custom properties
│       ├── base.css       # Base styles and reset
│       ├── navbar.css     # Navigation component
│       ├── hero.css       # Hero section styles
│       ├── carousel.css   # Banner carousel styles
│       ├── products.css   # Product grid and details
│       ├── cart.css       # Shopping cart styles
│       ├── checkout.css   # Checkout page styles
│       ├── buttons.css    # Button components
│       ├── cards.css      # Card components
│       └── sections.css   # Page sections
```

## 🎨 Design System

### Colors
- **Primary**: #6c63ff (Purple)
- **Secondary**: #9f7aea (Light Purple)
- **Success**: #10b981 (Green)
- **Danger**: #ef4444 (Red)
- **Warning**: #f59e0b (Orange)

### Typography
- **Font Family**: Inter
- **Font Sizes**: xs (0.75rem) to 6xl (3.75rem)
- **Font Weights**: Light (300) to Bold (700)

### Spacing
- **Consistent spacing scale**: 0.25rem to 6rem
- **Responsive breakpoints**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd "QuickCart app"
   ```

2. **Serve the files**
   
   **Option A: Using Python (if installed)**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Using Node.js (if installed)**
   ```bash
   npx serve .
   ```
   
   **Option C: Using Live Server (VS Code extension)**
   - Install Live Server extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser**
   - Navigate to `http://localhost:8000` (or the port shown)
   - The application should load with the homepage

### Usage

1. **Browse Products**
   - View featured products on the homepage
   - Use filters to narrow down by category or price
   - Sort products by price, rating, or name

2. **Product Details**
   - Click on any product to view detailed information
   - Adjust quantity and add to cart

3. **Shopping Cart**
   - View cart items and manage quantities
   - See real-time price calculations
   - Proceed to checkout

4. **User Authentication**
   - Login with demo credentials:
     - Username: `mor_2314`
     - Password: `83r5^_`

## 🔧 Configuration

### API Configuration
The app uses the Fake Store API. No API keys required.
- Base URL: `https://fakestoreapi.com`
- Endpoints: Products, Categories, Users, Authentication

### Customization
- **Colors**: Modify CSS variables in `src/styles/variables.css`
- **Fonts**: Update font imports in `src/styles/main.css`
- **Layout**: Adjust container max-width and spacing in variables

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 👨‍💻 Author

**Ahmed Abdelaty**
- Email: ahmed.abdelaty174@gmail.com

## 🙏 Acknowledgments

- **Fake Store API** for providing the product data
- **Font Awesome** for the icon library
- **Google Fonts** for the Inter font family
- **Placeholder.com** for fallback images

## 📈 Future Enhancements

- [ ] User registration functionality
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Order history
- [ ] Payment integration
- [ ] Admin panel for product management
- [ ] Search functionality
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Dark mode theme

---

**QuickCart** - Your one-stop shop for everything you need! 🛒