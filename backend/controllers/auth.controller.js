import User from "../models/user-models.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    
    if (!req.body){
        return res.status(400).json({"message": "username, password, email are required."});
    }

    const {username, email, password} = req.body;

    if (!username || !email || !password || username == "" || password == "") {
        return res.status(400).json({"message": "All fields are required."});
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
        res.status(500).json({"message": error.message})   
    }
}