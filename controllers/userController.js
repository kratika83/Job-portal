import i18n from "../config/i18n.js";
import userModel from "../models/userModel.js";
import constants from "../utils/constants.js";
import helper from "../utils/helper.js";

const updateUser = async (req, res) => {
    try {
        const { firstName } = req.body;
        if (!firstName) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_missing_field')
            )
        }
        const user = await userModel.findOne({ _id: req.body.user_info._id });
        user.firstName = firstName;
        await user.save();
        const token = helper.jwtToken(user);
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_user_update_success'),
            { user, token }
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message)
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.user_info._id });
        user.password = undefined;
        if (!user) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_user_not_found')
            )
        } else {
            return helper.returnTrueResponse(
                req,
                res,
                constants.CONST_RESP_CODE_OK,
                i18n.__('lang_user_found'),
                { data: user }
            )
        }
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message)
    }
};

let userController = {
    updateUser: updateUser,
    getUser: getUser
};

export default userController;