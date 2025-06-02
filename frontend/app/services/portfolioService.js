import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const portfolioService = {
  async submit(portfolioUrl) {
    try {
      const response = await api.post("/portfolios", {
        portfolio_url: portfolioUrl,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await api.get("/portfolios");
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/portfolio/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
