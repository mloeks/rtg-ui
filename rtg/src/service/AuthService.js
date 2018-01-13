class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
  }

  authenticate(username, password, callback) {
    this.isAuthenticated = true;
    this.isAdmin = username === 'admin';
    setTimeout(callback, 100);
  }

  logout(callback) {
    this.isAuthenticated = false;
    this.isAdmin = false;
    setTimeout(callback, 100);
  }
}

export default new AuthService();
