import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.models.Industry || model('Industry', schema);
