import express from "express";
import Todomodel from "../models/todomodel.js";
import { authenticateUser } from "../middleware/authentication.js";
const router = express.Router()


router.post('/', authenticateUser, async (req, res) => {
    try {
        const { todo } = req.body
        let newTodo = new Todomodel({ todo: todo, user: req.user._id })
        newTodo = await newTodo.save()
        res.status(201).json({
            data: newTodo,
            message: "Todo added successfully",
            error: false,
        })

    } catch (error) {
        res.json({
            message: error.message,
            error: true,
        })
    }

})

router.get('/', authenticateUser, async (req, res) => {
    const Todos = await Todomodel.find({ user: req.user._id })
    res.status(200).json({
        data: Todos,
        message: "Todos fetched successfully",
        error: false,
    })
})

router.get('/:id', authenticateUser, async (req, res) => {
    const todo = await Todomodel.findById(req.params.id).lean()
    if (!todo) return res.status(404).json({
        message: "Todo not found",
        error: true,
    })
    if (req.user._id == todo.user.toString()) {
        res.status(200).json({
            data: todo,
            message: "Todo found successfully",
            error: false,
        })
    }
    else {
        res.status(200).json({
            message: "You are not the ownner of this todo.",
            error: false,
        })

    }

})


router.put('/:id', authenticateUser, async (req, res) => {
    const { todo } = req.body
    const checkTodo = await Todomodel.findOne({ _id: req.params.id })
    if (!checkTodo) return res.status(404).json({
        message: "Todo not found",
        error: true,
    })

    if (req.user._id == checkTodo.user.toString()) {

        const todoToUpdate = await Todomodel.findByIdAndUpdate(req.params.id, { todo })
        todoToUpdate.todo = todo
        res.status(200).json({
            data: todoToUpdate,
            message: "Todo updated successfully",
            error: false,
        })
    }
    else {
        res.status(200).json({
            message: "You are not the ownner of this todo.",
            error: false,
        })

    }

})


router.delete('/:id', authenticateUser, async (req, res) => {
    const checkTodo = await Todomodel.findOne({ _id: req.params.id })

    if (!checkTodo) {
        return res.status(404).json({
            message: "Todo not found",
            error: true,
        });
    }
    if (req.user._id == checkTodo.user.toString()) {
        const todoTodelete = await Todomodel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            data: todoTodelete,
            message: "Todo deleted successfully",
            error: false,
        });
    }
    else {
        res.status(200).json({
            message: "You are not the ownner of this todo.",
            error: false,
        })

    }

});

export default router