import mongoose from "mongoose";

const jobSchema = mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        company: {
            type: String,
            required: [true, "Company name is required"]
        },
        position: {
            type: String,
            required: [true, "Job position is required"],
            maxLength: 100
        },
        status: {
            type: String,
            enum: ['Pending', 'Reject', 'Interview'],
            default: 'Pending'
        },
        workType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
            default: 'Full-time'
        },
        workLocation: {
            type: String,
            default: 'Mumbai',
            required: [true, 'Work location is required']
        }
    },
    {
        timestamps: true,
        collection: "Jobs",
        versionKey: false
    }
);

const jobsModel = mongoose.model("jobSchema", jobSchema);

export default jobsModel;