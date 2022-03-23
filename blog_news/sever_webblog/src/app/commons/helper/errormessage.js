import BaseError from './BaseError.js'

export const errorCatcher = (req, res, next) => {
  throw new BaseError({ statusCode: 404 , message: "not found"});
};

export const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error instanceof BaseError) res.status(error.statusCode).json(error);
  else {
    console.log(error);
    res
      .status(500)
      .json(new BaseError({ statusCode: 500, errors: error.stack }));
  }
};