import axios from 'axios';

class AuthService {
  login() {
    return Promise.resolve({ success: true });
  }
  
  register() {
    return Promise.resolve({ success: true });
  }
}

const authService = new AuthService();
export default authService;
