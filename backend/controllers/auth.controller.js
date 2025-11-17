import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

export const signin = async (req, res, next) => {
    
    if (!req.body){
        return res.status(400).json({"message": "email, password, are required."});
    }

    const {email, password} = req.body;

    if (!email || !password || email == "" || password == "") {
        return next(errorHandler(400, "All fields are required."))
    }  

    try {

    const validUser = await User.findOne({email})

    if (!validUser) {
        return next(errorHandler(403, "Authentication Failed."))
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password)
    
    if (!validPassword){
        return next(errorHandler(403, "Authentication Failed."))
    }

    const token = jwt.sign({id: validUser._id, isAdmin: validUser.isAdmin}, process.env.JWT_SECRET)
    const {password: pass, ...rest} = validUser._doc;

    res.status(200).cookie('access_token', token, {
        httpOnly: true,
    }).json(rest)

    } catch (error) {
        console.log(error)
    }

}