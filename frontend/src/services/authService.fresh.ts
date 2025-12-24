import axios from 'axios';

// Simple test to see if module works
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:13578';

class AuthService {
  login(email: string, password: string) {
    return axios.post(`${API_BASE_URL}/basic/auth/login`, { email, password });
  }
}

const authService = new AuthService();
export default authService;
