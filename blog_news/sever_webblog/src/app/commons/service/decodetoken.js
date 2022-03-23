import Jwt from 'jsonwebtoken';

 const verifyJwtToken = (refreshtoken) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(refreshtoken, 'chap100thanghacker', (err, payload) => {
        if (err) {
          return reject(err);
        }
        const userid = payload.sub
        resolve(userid); 
      });
    });
  }
export default verifyJwtToken;