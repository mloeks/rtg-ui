class FetchHelper {
  static parseJson(response) {
    const contentType = response.headers.get('content-type');

    // redirect to login page if user is not logged in anymore
    if (response.status === 401) {
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
