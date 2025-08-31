// API Service for external API calls
export class ApiService {
    static BASE_URL = 'https://fakestoreapi.com';

    // Generic fetch method with error handling
    static async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.BASE_URL}${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }

    // Get all products
    static async getProducts() {
        return await this.fetchData('/products');
    }

    // Get products by category
    static async getProductsByCategory(category) {
        return await this.fetchData(`/products/category/${category}`);
    }

    // Get single product
    static async getProduct(id) {
        return await this.fetchData(`/products/${id}`);
    }

    // Get all categories
    static async getCategories() {
        return await this.fetchData('/products/categories');
    }
}
