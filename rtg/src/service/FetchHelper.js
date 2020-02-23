class FetchHelper {
  static parseJson(response, checkAuth = true) {
    const contentType = response.headers.get('content-type');

    // redirect to login, if the user is meanwhile logged out (async request responded with 401)
    if (checkAuth && response.status === 401) {
      window.location.href = '/';
    }

    if (contentType && contentType.indexOf('application/json') !== -1) {
      return new Promise((resolve) => response.json()
        .then((json) => resolve({
          status: response.status,
          ok: response.ok,
          json,
        })));
    }

    return new Promise((resolve) => response.text()
      .then((text) => resolve({
        status: response.status,
        ok: response.ok,
        text,
      })));
  }
}

export default FetchHelper;
