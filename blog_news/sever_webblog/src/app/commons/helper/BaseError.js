class BaseError extends Error {
    constructor({ statusCode, error, errors }) {
      super();
      this.statusCode = statusCode;
      this.error = error;
      this.errors = errors;
    }
    return(res) {
      res.errors(this.statusCode).json(this);
    }
  }
  
  export default BaseError;
  