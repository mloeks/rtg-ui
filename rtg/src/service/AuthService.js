import FetchHelper from './FetchHelper';

// Unfortunately this does not work as elegantly as described here:
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables
// Instead, I defined all three different API URLs in one .env file

// eslint-disable-next-line no-nested-ternary
export const API_BASE_URL = process.env.NODE_ENV === 'production' ?
  (process.env.REACT_APP_ENV === 'production' ?
    process.env.REACT_APP_PROD_API_URL :
    process.env.REACT_APP_DEMO_API_URL
  ) : process.env.REACT_APP_DEV_API_URL;

const LocalStorageWrapper = {
  get: key => localStorage.getItem(`rtg-${key}`), // eslint-disable-line no-undef
  set: (key, value) => localStorage.setItem(`rtg-${key}`, value), // eslint-disable-line no-undef
  remove: key => localStorage.removeItem(`rtg-${key}`), // eslint-disable-line no-undef
};

class AuthService {
  static getToken() {
    return LocalStorageWrapper.get('token');
  }

  static isAuthenticated() {
    return LocalStorageWrapper.get('authenticated') === 'true';
  }

  static isAdmin() {
    return LocalStorageWrapper.get('admin') === 'true';
  }

  static getUserId() {
    return Number(LocalStorageWrapper.get('user-id'));
  }

  static getUsername() {
    return LocalStorageWrapper.get('username');
  }

  static getHasPaid() {
    return LocalStorageWrapper.get('has-paid') === 'true';
  }

  static getAvatarUrl() {
    return LocalStorageWrapper.get('avatar-url');
  }

  static getOpenBetsCount() {
    return Number(LocalStorageWrapper.get('open-bets-count'));
  }

  static resetProps() {
    localStorage.clear(); // eslint-disable-line no-undef
  }

  static setPropsFromAuthResponse(authResponse) {
    LocalStorageWrapper.set('authenticated', true);
    LocalStorageWrapper.set('admin', authResponse.admin === true);
    LocalStorageWrapper.set('token', authResponse.token);
    LocalStorageWrapper.set('user-id', authResponse.user_id);
    LocalStorageWrapper.set('username', authResponse.username);
    LocalStorageWrapper.set('has-paid', authResponse.has_paid);
    LocalStorageWrapper.set('avatar-url', authResponse.avatar_url);
    LocalStorageWrapper.set('open-bets-count', authResponse.no_open_bets);
  }

  static async authenticate(username, password) {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/api-token-auth/`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(FetchHelper.parseJson)
        .then((response) => {
          if (response.ok) {
            AuthService.setPropsFromAuthResponse(response.json);
            resolve(response.json);
          } else {
            AuthService.resetProps();
            reject(new Error(response.json && response.json.non_field_errors
              ? response.json.non_field_errors[0]
              : 'Ein Fehler ist aufgetreten.'));
          }
        })
        .catch(() => {
          AuthService.resetProps();
          reject(new Error('Ein Fehler ist aufgetreten.'));
        });
    });
  }

  static async register(username, email, password, passwordRepeat, firstName, lastName) {
    const payload = {
      username,
      email,
      password,
      password2: passwordRepeat,
      first_name: firstName,
      last_name: lastName,
    };

    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/api-token-register/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(FetchHelper.parseJson)
        .then((response) => {
          const responseJson = response.json;
          if (response.ok) {
            AuthService.setPropsFromAuthResponse(responseJson);
            resolve(responseJson);
          } else {
            AuthService.resetProps();
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              fieldErrors: {
                username: responseJson.username || '',
                email: responseJson.email || '',
                firstName: responseJson.first_name || '',
                lastName: responseJson.last_name || '',
                password: responseJson.password1 || '', // password1 is intentional, because the backend serializers returns it like this
                passwordRepeat: responseJson.password2 || '',
              },
              nonFieldError: responseJson.non_field_errors && responseJson.non_field_errors[0],
            });
          }
        })
        .catch(() => {
          AuthService.resetProps();
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ nonFieldError: 'Ein Fehler ist aufgetreten' });
        });
    });
  }

  static async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/rest-auth/password/reset/`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(FetchHelper.parseJson)
        .then((response) => {
          const responseJson = response.json;
          if (response.ok) {
            resolve(responseJson);
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              fieldErrors: { email: responseJson.email || '' },
              nonFieldError: responseJson.non_field_errors && responseJson.non_field_errors[0],
            });
          }
        })
        .catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ nonFieldError: 'Ein Fehler ist aufgetreten' });
        });
    });
  }

  static async confirmPasswordReset(newPassword, newPasswordRepeat, uid, token) {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/rest-auth/password/reset/confirm/`, {
        method: 'POST',
        body: JSON.stringify({
          new_password1: newPassword,
          new_password2: newPasswordRepeat,
          uid,
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(FetchHelper.parseJson)
        .then((response) => {
          const responseJson = response.json;
          if (response.ok) {
            resolve(responseJson);
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              fieldErrors: {
                password: responseJson.new_password1 || '',
                passwordRepeat: responseJson.new_password2 || '',
                uid: responseJson.uid || '',
                token: responseJson.token || '',
              },
              nonFieldError: responseJson.non_field_errors && responseJson.non_field_errors[0],
            });
          }
        })
        .catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ nonFieldError: 'Ein Fehler ist aufgetreten' });
        });
    });
  }

  static async logout() {
    return new Promise((resolve) => {
      AuthService.resetProps();
      resolve();
    });
  }
}

export default AuthService;
