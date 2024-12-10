import constants from "./constants.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getUserInfo = async (matchCondition) => {
    const userInfo = await userModel.aggregate([
        {
            $match: matchCondition
        },
        {
            $project: {
                _id: 1,
                firstName: 1,
                email: 1,
                password: 1,
                location: 1
            }
        }
    ]);   
    return userInfo;
};

const comparePassword = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword);
}

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(constants.CONST_GEN_SALT);
    password = await bcrypt.hash(password, salt);
    return password;
};

const jwtToken = async (userData) => {
    const secretKey = process.env.JWT_TOKEN_KEY;
    const user = {
        id: userData._id,
        email: userData.email
    };
    const token = jwt.sign(user, secretKey, { expiresIn: "24hr" });
    return token;
};

const returnTrueResponse = (req, res, statusCode, message, arr, totalCounts) => {
    return res.status(statusCode).json({
        version: {
            current_version: constants.CONST_APP_VERSION,
            major_update: 0,
            minor_update: 0,
            message: "App is Up to Date"
        },
        success: 1,
        message: message,
        data: arr,
        totalCounts: totalCounts
    })
};

const returnFalseResponse = (req, res, statusCode, message, arr, errorCode) => {
    return res.status(statusCode).json({
        version: {
            current_version: constants.CONST_APP_VERSION,
            major_update: 0,
            minor_update: 0,
            message: "App is Up to Date"
        },
        success: 0,
        message: message,
        data: arr,
        errorCode: errorCode
    })
};

let helper = {
    getUserInfo: getUserInfo,
    returnTrueResponse: returnTrueResponse,
    returnFalseResponse: returnFalseResponse,
    comparePassword: comparePassword,
    encryptPassword: encryptPassword,
    jwtToken: jwtToken
};

export default helper;