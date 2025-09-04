import { CONSTANTS } from "./constants.js";

export class ApiService {
  static BASE_URL = CONSTANTS.API_BASE_URL;

  static async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  }

  static async getProducts() {
    return await this.fetchData("/products");
  }

  static async getProductsByCategory(category) {
    return await this.fetchData(`/products/category/${category}`);
  }

  static async getProduct(id) {
    return await this.fetchData(`/products/${id}`);
  }

  static async getCategories() {
    return await this.fetchData("/products/categories");
  }
}
