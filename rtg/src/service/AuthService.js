import jwtDecode from 'jwt-decode';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import FetchHelper from './FetchHelper';

// Unfortunately this does not work as elegantly as described here:
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables
// Instead, I defined all three different API URLs in one .env file

// eslint-disable-next-line no-nested-ternary
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEMO_API_URL)
  : process.env.REACT_APP_DEV_API_URL;

const LocalStorageWrapper = {
  get: (key) => localStorage.getItem(`rtg-${key}`), // eslint-disable-line no-undef
  set: (key, value) => localStorage.setItem(`rtg-${key}`, value), // eslint-disable-line no-undef
  remove: (key) => localStorage.removeItem(`rtg-${key}`), // eslint-disable-line no-undef
};

const REFRESH_IF_EXPIRY_IN_SECONDS = 5 * 60;

class AuthService {
  static getToken() {
    return LocalStorageWrapper.get('token');
  }

  static getRefreshToken() {
    return LocalStorageWrapper.get('refresh-token');
  }

  static getTokenExpiryDate() {
    return LocalStorageWrapper.get('token-expiry');
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

  static getAvatar() {
    const avatar = LocalStorageWrapper.get('avatar');
    return avatar && avatar !== 'null' ? avatar : null;
  }

  static setAvatar(avatar) {
    LocalStorageWrapper.set('avatar', avatar);
  }

  static getOpenBetsCount() {
    return Number(LocalStorageWrapper.get('open-bets-count'));
  }

  static setOpenBetsCount(openBetsCount) {
    LocalStorageWrapper.set('open-bets-count', openBetsCount);
  }

  static getLastLogin() {
    const lastLoginProp = LocalStorageWrapper.get('last-login');
    return lastLoginProp === 'null' ? null : new Date(lastLoginProp);
  }

  static resetProps() {
    localStorage.clear(); // eslint-disable-line no-undef
  }

  static isAuthenticated() {
    return AuthService.getToken() && !AuthService.isUnauthenticatedOrExpired();
  }

  static refreshTokenIfNecessary() {
    if (AuthService.isAuthenticated() && AuthService.isAboutToExpire()) {
      AuthService.refreshToken();
    }
  }

  static isAboutToExpire() {
    if (AuthService.getTokenExpiryDate()) {
      return AuthService.getSecondsUntilExpiry() < REFRESH_IF_EXPIRY_IN_SECONDS;
    }
    return false;
  }

  static isUnauthenticatedOrExpired() {
    if (!AuthService.getToken() || !AuthService.getTokenExpiryDate()) {
      return true;
    }
    return AuthService.getSecondsUntilExpiry() <= 0;
  }

  static getSecondsUntilExpiry() {
    return differenceInSeconds(new Date(AuthService.getTokenExpiryDate() * 1000), Date.now());
  }

  static updatePropsFromAuthResponse(authResponse) {
    try {
      const decodedToken = jwtDecode(authResponse.access);

      LocalStorageWrapper.set('admin', decodedToken.admin === true);
      LocalStorageWrapper.set('token', authResponse.access);
      LocalStorageWrapper.set('token-expiry', decodedToken.exp);
      LocalStorageWrapper.set('user-id', decodedToken.user_id);
      LocalStorageWrapper.set('username', decodedToken.username);
      LocalStorageWrapper.set('has-paid', decodedToken.has_paid);
      LocalStorageWrapper.set('avatar', decodedToken.avatar);
      LocalStorageWrapper.set('open-bets-count', decodedToken.no_open_bets);
      LocalStorageWrapper.set('last-login', decodedToken.last_login);

      if (authResponse.refresh) {
        LocalStorageWrapper.set('refresh-token', authResponse.refresh);
      }
    } catch (error) {
      // TODO P3 handle invalid token (how?)
    }
  }

  static async authenticate(username, password) {
    const getResponseErrorMessage = (responseJson) => {
      if (responseJson && responseJson.non_field_errors) {
        return responseJson.non_field_errors[0];
      }
      if (responseJson && responseJson.error) {
        return responseJson.error;
      }
      return 'Eintritt verwehrt. Bitte Zugangsdaten überprüfen!';
    };

    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/api-token-auth/`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        // avoid auth check here to prevent page refresh and show the user an error feedback
        .then((json) => FetchHelper.parseJson(json, false))
        .then((response) => {
          if (response.ok) {
            AuthService.updatePropsFromAuthResponse(response.json);
            resolve(response.json);
          } else {
            AuthService.resetProps();
            reject(new Error(getResponseErrorMessage(response.json)));
          }
        })
        .catch(() => {
          AuthService.resetProps();
          reject(new Error('Entschuldige, der Eintritt ist derzeit nicht möglich. Bitte versuche es später noch einmal.'));
        });
    });
  }

  static async register(username, email, password, firstName, lastName) {
    const payload = {
      username,
      email,
      password,
      password2: password,
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
            AuthService.updatePropsFromAuthResponse(responseJson);
            resolve(responseJson);
          } else {
            AuthService.resetProps();
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              fieldErrors: {
                username: responseJson.username ? responseJson.username[0] : '',
                email: responseJson.email ? responseJson.email[0] : '',
                firstName: responseJson.first_name ? responseJson.first_name[0] : '',
                lastName: responseJson.last_name ? responseJson.last_name[0] : '',

                // password1 is intentional, because the backend serializers currently
                // returns it like this
                password: responseJson.password1 ? responseJson.password1[0] : '',
              },
              nonFieldError: responseJson.non_field_errors
                ? responseJson.non_field_errors[0] : responseJson.error,
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

  static async changePassword(oldPassword, newPassword) {
    const payload = {
      old_password: oldPassword,
      new_password1: newPassword,
      new_password2: newPassword,
    };

    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/rest-auth/password/change/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Token ${AuthService.getToken()}`,
          'content-type': 'application/json',
        },
      }).then(FetchHelper.parseJson)
        .then((response) => {
          const responseJson = response.json;
          if (response.ok) {
            resolve(responseJson);
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              formHasErrors: true,
              fieldErrors: {
                oldPassword: responseJson.old_password && responseJson.old_password[0],
                newPassword: (responseJson.new_password1 && responseJson.new_password1[0])
                || (responseJson.new_password2 && responseJson.new_password2[0]),
              },
              nonFieldError: responseJson.non_field_errors && responseJson.non_field_errors[0],
            });
          }
        }).catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ formHasErrors: false, nonFieldError: 'Ein Fehler ist aufgetreten' });
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

  static async confirmPasswordReset(newPassword, uid, token) {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/rest-auth/password/reset/confirm/`, {
        method: 'POST',
        body: JSON.stringify({
          new_password1: newPassword,
          new_password2: newPassword,
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
                password: responseJson.new_password1 || responseJson.new_password2 || '',
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

  static async refreshToken() {
    return fetch(`${API_BASE_URL}/api-token-refresh/`, {
      method: 'POST',
      body: JSON.stringify({ refresh: AuthService.getRefreshToken() }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(FetchHelper.parseJson)
      .then((response) => {
        if (response.ok) {
          AuthService.updatePropsFromAuthResponse(response.json);
        } else {
          // TODO P2 handle refresh token expiration in AuthRoute instead in
          // order to handleLogout with a reason
          AuthService.logout();
        }
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
