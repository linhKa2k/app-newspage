import multer from 'multer';
import path from 'path';
import BaseError from './BaseError.js';
import BaseResponse from './BaseRespone.js';
const DIRPOST = `uploads/imagepost/`;
const DIRUSER = `uploads/imageuser/`;
const storage = (dir) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir)
    },
    filename: function (req, file, cb) {
        const namefile = `image-${Date.now() + path.extname(file.originalname)}` 
        cb(null, namefile)
      }
  });
};
const fileFilter = (dir) =>
  function (req, file, cb) {
    let allowedMimes = ['.jpeg', '.jpg', '.png'];
    if (allowedMimes.includes(path.extname(file.originalname))) {
      cb(null, true);
    } else {
        cb(
            new BaseError({
              statusCode: 403,
              error: { picture: 'không đúng định dạng ảnh' },
            }), false
          );
    }
  };

const upload = (dir) =>
  multer({
    limits: { fileSize: 1024 * 1024 * 100 },
    storage: storage(dir),
    fileFilter: fileFilter(dir),
  });
export const uploadpost = upload(DIRPOST).single('image');
export const uploaduser = upload(DIRUSER).single('imageuser');
