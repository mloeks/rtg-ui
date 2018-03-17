class FetchHelper {
  static parseJson(response) {
    if (response.status === 204) {
      return new Promise(resolve => (resolve({
        status: response.status,
        ok: response.ok,
        json: null,
      })));
    }

    return new Promise(resolve => response.json()
      .then(json => resolve({
        status: response.status,
        ok: response.ok,
        json,
      })));
  }
}

export default FetchHelper;
