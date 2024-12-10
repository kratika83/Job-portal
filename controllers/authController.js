import i18n from "../config/i18n.js";
import userModel from "../models/userModel.js";
import constants from "../utils/constants.js";
import helper from "../utils/helper.js";

const register = async (req, res) => {
    try {
        const { firstName, email, password } = req.body;
        if (!firstName) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_name_is_required')
            )
        }
        if (!email) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_email_is_required')
            )
        }
        if (!password) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_password_is_required')
            )
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_user_register_failure')
            )
        }

        let hashedPassword = await helper.encryptPassword(password);
        const user = new userModel({ firstName, email, password: hashedPassword });
        let newUser = await user.save();
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_register_success'),
            newUser
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message)
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_CODE_NOT_FOUND,
                i18n.__('lang_missing_field')
            )
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_invalid_credentials')
            )
        }

        const verifyPassword = await helper.comparePassword(password, user.password);
        if (!verifyPassword) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_invalid_credentials')
            )
        }

        user.password =undefined;
        const token = await helper.jwtToken(user);
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_login_success'),
            {
                user,
                token
            }
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message)
    }
};

let authController = {
    register: register,
    login: login
};

export default authController;