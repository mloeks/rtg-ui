class FetchHelper {
  static parseJson(response) {
    return new Promise(resolve => response.json()
      .then(json => resolve({
        status: response.status,
        ok: response.ok,
        json,
      })));
  }
}

export default FetchHelper;
