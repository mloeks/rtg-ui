export default class AuthError extends Error {
  constructor(message = 'Ein Fehler ist aufgetreten', fieldErrors = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
    this.name = 'AuthError';
  }
}
