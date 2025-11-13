import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) {
    return res.status(401).json({"message":"Not Authorized."})
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.userData = payload
        next()

    } catch(error){
        return res.status(401).json({"message":error.message})
    }
}