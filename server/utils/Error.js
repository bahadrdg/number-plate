class APIError extends Error {
    constructor(message, statusCode) {
      super(message);  //* gelen message'ı Error sınıfının message özelliğine eşitle.
      this.statusCode = statusCode;
    }
}

module.exports = APIError