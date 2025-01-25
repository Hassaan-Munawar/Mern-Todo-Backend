import mongoose from "mongoose";
const { Schema } = mongoose;
const todoSchema = new Schema({
    todo: { type: String, required: true },
    user: { type: mongoose.Types.ObjectId, ref: "Users"}
});

const Todomodel = mongoose.model('Todos', todoSchema);

export default Todomodel