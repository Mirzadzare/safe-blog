import User from "../models/user-models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    
    if (!req.body){
        return res.status(400).json({"message": "username, password, email are required."});
    }

    const {username, email, password} = req.body;

    if (!username || !email || !password || username == "" || password == "") {
        next(errorHandler(400, "All fields are required."))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    try {

        await newUser.save();
        res.status(201).json({"message": "user created"})   

    } catch (error) {
        next(error) 
    }
}