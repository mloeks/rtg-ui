class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
  }

  authenticate(callback) {
    this.isAuthenticated = true;
    setTimeout(callback, 100);
  }

  logout(callback) {
    this.isAuthenticated = false;
    setTimeout(callback, 100);
  }
}

export default new AuthService();
