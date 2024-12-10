import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Name is required']
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: validator.isEmail
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [6, 'Password length should be greater than 6 characters']
        },
        location: {
            type: String,
            default: 'India'
        }
    },
    {
        timestamps: true,
        collection: "Users",
        versionKey: false
    }
);

const userModel = mongoose.model('userSchema', userSchema);

export default userModel;