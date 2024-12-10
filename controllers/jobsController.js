import mongoose from "mongoose";
import i18n from "../config/i18n.js";
import jobsModel from "../models/jobsModel.js";
import constants from "../utils/constants.js";
import helper from "../utils/helper.js";
import moment from "moment";

const createJobs = async (req, res) => {
    try {
        const { company, position } = req.body;
        if (!company || !position) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_missing_field')
            )
        }
        req.body.createdBy = req.body.user_info._id;

        const job = new jobsModel(req.body);
        let newJob = await job.save();
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_job_create_success'),
            newJob
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message);
    }
};

const jobsListing = async (req, res) => {
    try {
        const { status, workType, search, sort } = req.query;
        const query = {
            createdBy: req.body.user_info._id
        }

        if (status && status !== "all") {
            query.status = status
        }
        if (workType && workType !== "all") {
            query.workType = workType
        }
        if (search) {
            query.position = {
                $regex: search,
                $options: "i"
            }
        }
        let queryResult = jobsModel.find(query);
        if (sort === "latest") {
            queryResult.sort("-createdAt");
        }
        if (sort === "oldest") {
            queryResult.sort("createdAt");
        }
        if (sort === "a-z") {
            queryResult.sort("position");
        }
        if (sort === "z-a") {
            queryResult.sort("-position");
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        queryResult = queryResult.skip(skip).limit(limit);
        const totalJobs = await jobsModel.countDocuments(queryResult);
        const numOfPage = Math.ceil(totalJobs / limit);
        const jobs = await queryResult;
        // const jobs = await jobsModel.find({
        //     createdBy: req.user.userId
        // });
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_record_found'),
            {
                jobs,
                numOfPage
            },
            totalJobs
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message);
    }
};

const updateJobs = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log(jobId);        
        if (!(req.body.company || req.body.position)) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_missing_field')
            )
        }

        const job = await jobsModel.findOne({ _id: jobId });
        if (!job) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_no_jobs_found')
            )
        }
        if (!(req.body.user_info._id == job.createdBy.toString())) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_unauthorize_update_job')
            )
        }

        const updateJob = await jobsModel.findOneAndUpdate(
            { _id: jobId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_job_update_success'),
            updateJob
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message);
    }
};

const deleteJobs = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await jobsModel.findOne({ _id: jobId });
        if (!job) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_CONTENT_NOT_FOUND,
                i18n.__('lang_no_jobs_found')
            )
        }
        if (!(req.body.user_info._id == job.createdBy.toString())) {
            return helper.returnFalseResponse(
                req,
                res,
                constants.CONST_RESP_CODE_NOT_ACCEPT,
                i18n.__('lang_unauthorize_delete_job')
            )
        }

        const deleteJob = await jobsModel.deleteOne({ _id: jobId });
        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_job_delete_success'),
            deleteJob
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message);
    }
};

const jobStats = async (req, res) => {
    try {
        const stats = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.body.user_info._id)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const defaultStats = {
            pending: stats.pending || 0,
            reject: stats.reject || 0,
            interview: stats.interview || 0
        }

        let monthlyApplication = await jobsModel.aggregate([
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.body.user_info._id)
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        monthlyApplication = monthlyApplication.map(item => {
            const { _id: { year, month }, count } = item;
            const date = moment().month(month - 1).year(year).format('MMM Y');
            return { date, count };
        })
            .reverse();

        return helper.returnTrueResponse(
            req,
            res,
            constants.CONST_RESP_CODE_OK,
            i18n.__('lang_record_found'),
            {
                stats,
                defaultStats,
                monthlyApplication
            },
            stats.length
        )
    } catch (error) {
        return helper.returnFalseResponse(req, res, constants.CONST_RESP_CODE_INTERNAL_SERVER_ERROR, error.message);
    }
};

let jobsController = {
    jobsListing: jobsListing,
    createJobs: createJobs,
    updateJobs: updateJobs,
    deleteJobs: deleteJobs,
    jobStats: jobStats
};

export default jobsController;