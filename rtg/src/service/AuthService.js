import FetchHelper from './FetchHelper';

// TODO make base URL of API configurable by environment
const AUTH_URL = 'http://localhost:8000/api-token-auth/';

class AuthService {
  constructor() {
    this.resetProps = this.resetProps.bind(this);
    this.setPropsFromAuthResponse = this.setPropsFromAuthResponse.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.logout = this.logout.bind(this);

    this.resetProps();
  }

  resetProps() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.token = null;
    this.userId = null;
    this.username = null;
    this.hasPaid = false;
    this.avatarUrl = null;
    this.openBetsCount = null;
  }

  setPropsFromAuthResponse(authResponse) {
    this.isAuthenticated = true;
    this.isAdmin = authResponse.admin === true;
    this.token = authResponse.token;
    this.userId = authResponse.user_id;
    this.username = authResponse.username;
    this.hasPaid = authResponse.has_paid;
    this.avatarUrl = authResponse.avatar_url;
    this.openBetsCount = authResponse.no_open_bets;
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
        .then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            this.setPropsFromAuthResponse(response.json);
            resolve(response.json);
          } else {
            this.resetProps();
            reject(new Error(response.json && response.json.non_field_errors
              ? response.json.non_field_errors[0]
              : 'Ein Fehler ist aufgetreten.'));
          }
        })
        .catch(() => {
          this.resetProps();
          reject(new Error('Ein Fehler ist aufgetreten.'));
        });
    });
  }

  async logout() {
    return new Promise((resolve) => {
      this.resetProps();
      resolve();
    });
  }
}

export default new AuthService();
