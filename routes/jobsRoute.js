import jobsController from '../controllers/jobsController.js';
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
const jobsRouter = express.Router();

jobsRouter.get(
    '/', 
    authMiddleware.userAuth,
    jobsController.jobsListing
);
jobsRouter.post(
    '/create-job',
    authMiddleware.userAuth,
    jobsController.createJobs
);
jobsRouter.patch(
    '/update-job/:id',
    authMiddleware.userAuth,
    jobsController.updateJobs
);
jobsRouter.delete(
    '/delete-job/:id', 
    authMiddleware.userAuth,
    jobsController.deleteJobs
);
jobsRouter.get(
    '/job-stats', 
    authMiddleware.userAuth,
    jobsController.jobStats
);

export default jobsRouter;