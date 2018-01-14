// TODO make base URL of API configurable by environment
const AUTH_URL = 'http://localhost:8000/api-token-auth/';

class AuthService {
  // TODO move to fetchHelper lib
  static parseJSON(response) {
    return new Promise(resolve => response.json()
      .then(json => resolve({
        status: response.status,
        ok: response.ok,
        json,
      })));
  }

  constructor() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);
  }

  async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      fetch(AUTH_URL, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(AuthService.parseJSON)
        .then((response) => {
          if (response.ok) {
            this.isAuthenticated = true;
            this.isAdmin = username === 'admin';
            resolve(response.json);
          } else {
            this.isAuthenticated = false;
            this.isAdmin = false;
            reject(new Error(response.json && response.json.non_field_errors
              ? response.json.non_field_errors[0]
              : 'Ein Fehler ist aufgetreten.'));
          }
        })
        .catch(() => {
          this.isAuthenticated = false;
          this.isAdmin = false;
          reject(new Error('Ein Fehler ist aufgetreten.'));
        });
    });
  }

  logout(callback) {
    this.isAuthenticated = false;
    this.isAdmin = false;
    setTimeout(callback, 100);
  }
}

export default new AuthService();
