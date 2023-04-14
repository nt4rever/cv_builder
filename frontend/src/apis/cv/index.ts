import axiosClient from 'utils/axiosClient';
import { CVData } from 'utils/types';

const ENDPOINT = '/cvstorage';

export interface RootObject {
    data: CVData[];
}

export const createCv = (payload: { templateId: string }) => {
    return axiosClient.post<{ message: string; data: CVData }>(ENDPOINT, payload);
};
export const deleteCv = (payload: { cvId: string; access_token: string }) => {
    return axiosClient.delete<{ message: string }>(ENDPOINT + '/' + payload.cvId, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};
export const getAllCv = (payload: { access_token: string }) => {
    return axiosClient.get<RootObject>(ENDPOINT, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};
export const getOneCv = (payload: { access_token: string; cvId: string }) => {
    return axiosClient.get(ENDPOINT + '/' + payload.cvId, {
        headers: { Authorization: `Bearer ${payload.access_token}` },
    });
};
export const changStatusShareCv = (payload: { access_token: string; cvId: string; isPublic: boolean }) => {
    return axiosClient.post(
        ENDPOINT + '/share/' + payload.cvId,
        {
            isPublic: payload.isPublic,
        },

        {
            headers: { Authorization: `Bearer ${payload.access_token}` },
        },
    );
};
