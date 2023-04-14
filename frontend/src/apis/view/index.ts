import axiosClient from 'utils/axiosClient';
import axios from 'axios';

enum ENDPOINT {
    SHARE = '/share/',
    PDF = '/share/pdf',
    PNG = '/share/png',
    THUMBNAIL = '/share/thumbnail',
}

export const getViewCV = (payload: { access_token?: string; cvId: string }) => {
    return axiosClient.get(`${ENDPOINT.SHARE}${payload.cvId}`, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};

export const getExportFile = (payload: { access_token: string; cvId: string; type: 'PDF' | 'PNG' }) => {
    const baseURL = process.env.REACT_APP_URL || 'http://localhost:3000';
    const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const cvUrl = `${baseURL}/${payload.cvId}/view?token=${payload.access_token}&print_mode=yes`;
    return axios.post(
        `${apiURL}${ENDPOINT[payload.type]}`,
        { cvUrl: encodeURIComponent(cvUrl) },
        {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/pdf',
            },
        },
    );
};

export const saveThumbnail = (payload: { access_token: string; cvId: string }) => {
    const baseURL = process.env.REACT_APP_URL || 'http://localhost:3000';
    const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const cvUrl = `${baseURL}/${payload.cvId}/view?token=${payload.access_token}&print_mode=yes`;
    return axios.post(
        `${apiURL}${ENDPOINT.THUMBNAIL}`,
        { cvUrl: encodeURIComponent(cvUrl), cvStorageId: payload.cvId },
        {
            responseType: 'arraybuffer',
            headers: {
                Accept: 'application/pdf',
            },
        },
    );
};
