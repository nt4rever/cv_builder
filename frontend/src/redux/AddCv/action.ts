import { Education } from './types';
import { Work } from './../../apis/infomation/index';
import axiosServices from 'utils/axiosClient';
import { URL_ACTION } from './../../libs/constants/url_action';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { About, Contact } from './types';
import * as _ from 'lodash';

export const getInformationCv = createAsyncThunk(URL_ACTION.ADD_CV.GET_INFORMATION_CV, async () => {
    const response = await axiosServices.get(URL_ACTION.ADD_CV.URL_GET_INFORMATION);
    if (response) {
        return response.data;
    }
});

export const postWork = async (data: Work[]) => {
    data.map(async (work: Work) => {
        if (work.id)
            if (!work.company || !work.jobTitle) await axiosServices.delete(`${URL_ACTION.ADD_CV.URL_WORK}/${work.id}`);
            else await axiosServices.patch(`${URL_ACTION.ADD_CV.URL_WORK}/${work.id}`, work);
        else await axiosServices.post(URL_ACTION.ADD_CV.URL_WORK, work);
    });
};

export const postEducation = async (data: Education[]) => {
    data.map(async (education: Education) => {
        if (education.id) {
            if (!education.school || !education.degree)
                await axiosServices.delete(`${URL_ACTION.ADD_CV.URL_EDUCATION}/${education.id}`);
            else await axiosServices.patch(`${URL_ACTION.ADD_CV.URL_EDUCATION}/${education.id}`, education);
        } else {
            await axiosServices.post(URL_ACTION.ADD_CV.URL_EDUCATION, education);
        }
    });
};

export const postAbout = async (data: About) => {
    const result = await axiosServices.post(URL_ACTION.ADD_CV.URL_ABOUT, data);
    return result.data;
};

export const postContact = async (data: Contact) => {
    const postData = _.omitBy(data, (v) => !v);
    const result = await axiosServices.post(URL_ACTION.ADD_CV.URL_CONTACT, postData);
    return result.data;
};
