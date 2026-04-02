import jwt from "jsonwebtoken"
import secretKey from "../jwtConfig.js"

export const generateToken = (user) => {
    const payload = {
        id: user._id
    }
    return jwt.sign(payload, secretKey, {expiresIn: "2d"})  
    
}

export default generateToken;