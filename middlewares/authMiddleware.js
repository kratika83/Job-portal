import mongoose from "mongoose";
import i18n from "../config/i18n.js";
import userModel from "../models/userModel.js";
import constants from "../utils/constants.js";
import helper from "../utils/helper.js";
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const headerContent = req.headers;
    if (headerContent.hasOwnProperty("x-authorization")) {
        const getAuthToken = headerContent["x-authorization"];
        let tokenStatus = true;
        if (!getAuthToken.includes("Bearer")) {
            tokenStatus = false;
        }
        try {
            const parts = getAuthToken.split(' ');
            if (parts.length !== 2) {
                return helper.returnFalseResponse(
                    req,
                    res,
                    constants.CONST_RESP_CODE_UNAUTHORIZE,
                    i18n.__('lang_invalid_token')
                )
            }
            const scheme = parts[0];
            const token = parts[1];
            if (!/^Bearer$/i.test(scheme)) {
                return helper.returnFalseResponse(
                    req,
                    res,
                    constants.CONST_RESP_CODE_UNAUTHORIZE,
                    i18n.__('lang_invalid_token')
                )
            }
            const tokenPayload = jwt.decode(token);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (tokenPayload?.exp < currentTimestamp) {
                return helper.returnFalseResponse(
                    req,
                    res,
                    constants.CONST_RESP_CODE_UNAUTHORIZE,
                    i18n.__('lang_token_expire'),
                    {},
                    461
                )
            }
            const decodeToken = jwt.verify(token, process.env.JWT_TOKEN_KEY);
            let userInfo;
            if (
                decodeToken.hasOwnProperty("id") &&
                decodeToken.hasOwnProperty("email")
            ) {
                userInfo = await helper.getUserInfo(
                    {
                        _id: new mongoose.Types.ObjectId(decodeToken.id),
                        email: decodeToken.email
                    },
                    true
                );
                if (userInfo.length == 0) {
                    tokenStatus = false;
                } else {
                    tokenStatus = true;
                }
            }
            if (tokenStatus) {
                req.body.user_info = userInfo[0];
                next();
            } else {
                return helper.returnFalseResponse(
                    req,
                    res,
                    constants.CONST_RESP_CODE_UNAUTHORIZE,
                    i18n.__('lang_validate_user_authorized_token')
                )
            }
        } catch (error) {
            return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message)
        }
    }
};

let authMiddleware = {
    userAuth: userAuth
}

export default authMiddleware;