import jwt from "jsonwebtoken"
import secretKey from "../jwtConfig.js"

function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization")
    if (!authHeader) {
        return res.status(401).json({
            "error": "Authorization header missing"
        })
    }

    const [bearer, token] = authHeader.split(" ")
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            "error": "Invalid Token Format"
        })
    }

    jwt.verify(token, secretKey, (error, user) => {
        if (error) {
            return res.status(401).json({
                "error": "Invalid Token"
            })
        }

        req.user = user
        next()

    })
}

export default authMiddleware;