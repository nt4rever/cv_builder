import axios from 'axios';
import { Template } from 'utils/types';

export const getAllTemplate = async () => {
    try {
        const res = await axios.get<Template[]>(`${process.env.REACT_APP_API_URL}/template/all`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};

export const getTemplateByCategory = async (category: string) => {
    try {
        const res = await axios.get<Template[]>(`${process.env.REACT_APP_API_URL}/template/category/${category}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
