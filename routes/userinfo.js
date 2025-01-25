import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import Usermodel from "../models/usermodel.js";

const router = express.Router()


router.get('/', authenticateUser, async (req, res) => {
    const Todos = await Usermodel.findById(req.user._id)
    res.status(200).json({
        data: Todos,
        message: "User fetched successfully",
        error: false,
    })
})

export default router