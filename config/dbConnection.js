import mongoose from "mongoose";
import constants from "../utils/constants.js";

export default function connection() {
    const connection_url = constants.CONST_DB_URL;
    mongoose.connect(connection_url, {})
        .then(
            () => console.log("Database connected successfully")
        )
        .catch(
            (error) => {
                console.log("Database connection failed, exiting now..", error);
                process.exit(1);
            }
        )
}