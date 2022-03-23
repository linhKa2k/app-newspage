class BaseResponse {
    constructor({ statusCode, data }) {
      this.statusCode = statusCode;
      //copy data to this.BaseResponse
      Object.assign(this, data);
    }
    addMeta(meta) {
      Object.assign(this, meta);
      return this;
    }
    return(res) {
      res.status(this.statusCode).json(this);
    }
  }
export default BaseResponse;