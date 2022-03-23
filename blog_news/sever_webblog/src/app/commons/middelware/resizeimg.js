import sharp from 'sharp';
sharp.cache(false);

const resizeFile = (
  file,
  options = { width: 200, height: null, fit: 'cover' },
) => {
  file.filename = file.filename.replace(/\.[^\/.]+$/, '_resized.jpg');
  sharp(file.path)
    .resize(options)
    .toFormat('jpg')
    .toFile((file.path = file.destination + file.filename));
};
const resizeimg = async (req, res, next) => {
  try {
    const { w, h } = req.query;
    console.log(req.file)
    if (req.file){
      if(h === undefined || h === null){
        resizeFile(req.file, { width: +w });
      }else{
        resizeFile(req.file, { width: +w, height: +h });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const resise = { resizeimg };
