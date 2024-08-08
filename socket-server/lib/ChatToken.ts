import jwt from "jsonwebtoken";
import envs from "../config";

const jwtSecret = envs.JWT_SECRET!;

export function getChatToken (email: string) {
    const chatToken = jwt.sign({email}, jwtSecret, {expiresIn: "30d"})

    return chatToken;
}

export function verifyChatToken(token: string) {
    let email
    jwt.verify(token, jwtSecret, (err, verifiedToken) => {
        if(err) throw err;
        if(!verifiedToken || typeof verifiedToken == "string") throw ("Invaild token.")

        email = verifiedToken.email;
    })
    return email;
}

