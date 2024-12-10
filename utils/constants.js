import dotenv from "dotenv";
dotenv.config();

const constants = Object.freeze({
    CONST_APP_VERSION: process.env.APP_VERSION,

    CONST_DB_URL: process.env.MONGODB_URL,
    CONST_GEN_SALT: 10,

    CONST_RESP_LANG_COLLECTION: ["en"],

    //API response code
    CONST_RESP_CODE_OK: 200,
    CONST_RESP_CODE_CONTENT_NOT_FOUND: 204,
    CONST_RESP_CODE_UNAUTHORIZE: 401,
    CONST_CODE_NOT_FOUND: 404,
    CONST_RESP_CODE_NOT_ACCEPT: 406,
    CONST_RESP_CODE_INTERNAL_SERVER_ERROR: 500
})

export default constants;