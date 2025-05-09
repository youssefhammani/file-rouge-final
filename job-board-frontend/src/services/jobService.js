// src/services/jobService.js
import api from './api';

export const getAllJobs = async (params) => {
    const response = await api.get('/jobs', {
        params
    });
    return response.data;
};

export const getJobById = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};

export const getCompanyJobs = async () => {
    const response = await api.get('/jobs/company/myjobs');
    return response.data;
};

export const applyForJob = async (jobId, applicationData) => {
    const response = await api.post(`/applications/jobs/${jobId}/apply`, applicationData);
    return response.data;
};

export const getJobApplications = async (jobId) => {
    const response = await api.get(`/applications/jobs/${jobId}`);
    return response.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, {
        status
    });
    return response.data;
};

export const getUserApplications = async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
};

export const saveJob = async (jobId) => {
    const response = await api.post(`/users/jobs/${jobId}/save`);
    return response.data;
};

export const unsaveJob = async (jobId) => {
    const response = await api.delete(`/users/jobs/${jobId}/unsave`);
    return response.data;
};

export const getSavedJobs = async () => {
    const response = await api.get('/users/saved-jobs');
    return response.data;
};