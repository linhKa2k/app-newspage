const limit = (req, res, next) =>{
    const limit = req.query.limit || req.body.limit;
    if(limit === '' || limit === undefined){
        req.limit = 4;
        return next();
    }else{
        req.limit = limit;
        return next();
    }
}

export const serviceFind = {limit};