import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token) {
        try {
            const decoded = jwt.verify(token, 'pass123');
            console.log(decoded);
            req.role = decoded.role;
            req._key = decoded.key;
            next();
        } catch(e) {
            return res.status(403).json({
                message: 'Access denied!'
            });
        }

    }
    else {
        res.status(403).json({
            message: 'Access denied!'
        });
    }    


}