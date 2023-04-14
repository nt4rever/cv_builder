import { CVData } from './../../utils/types';
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import * as _ from 'lodash';
import {
    ActionAddItem,
    ActionEditHeading,
    ActionEditTag,
    ActionEditStandard,
    ActionDeleteStandard,
    ActionDeleteSection,
    Action,
    ActionEditDetail,
    ActionDeleteDetail,
    ActionEditAbout,
    ActionAddSection,
    ActionSortSection,
} from './action';

export interface EditState {
    cvId?: string;
    cvData?: CVData;
    theme?: {
        background: string;
        primaryText: string;
        sectionTitle: string;
        monogramBackground: string;
        monogramText: string;
    };
    loading: boolean;
    deleteSection: string[];
    deleteStandard: string[][];
    deleteDetail: string[][];
    selectSection: boolean;
    render: boolean;
    unSaved: boolean;
}

const initialState: EditState = {
    cvId: undefined,
    cvData: undefined,
    theme: {
        primaryText: '#000000',
        sectionTitle: '#fff',
        monogramBackground: '#fbbc05',
        monogramText: '#fff',
        background: '#000000',
    },
    loading: false,
    deleteSection: [],
    deleteStandard: [],
    deleteDetail: [],
    selectSection: false,
    render: false,
    unSaved: false,
};

const editSlice = createSlice({
    name: 'edit',
    initialState,
    reducers: {
        loading(state, action: Action) {
            state.loading = action.payload;
            return state;
        },
        selectSection(state) {
            state.selectSection = true;
            return state;
        },
        closeSelectSection(state) {
            state.selectSection = false;
            return state;
        },
        selectCV(state, action: Action) {
            state.cvId = action.payload?.cvId;
            return state;
        },
        setCv(state, action: Action) {
            state.cvId = action.payload?.cvData?.id;
            state.cvData = action.payload?.cvData;
            state.theme = action.payload?.cvData?.theme;
            state.deleteDetail = [];
            state.deleteStandard = [];
            state.deleteSection = [];
            state.loading = false;
            state.render = !state.render;
            state.unSaved = false;
            return state;
        },
        setAvatar(state, action: Action) {
            if (state.cvData) state.cvData.avatar = action.payload?.avatar;
            return state;
        },
        setTheme(state, action: Action) {
            state.theme = { ...state.theme, ...action.payload };
            state.loading = false;
            state.unSaved = true;
            return state;
        },
        addItem(state, action: ActionAddItem) {
            const { sectionId, type } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    if (type === 'STANDARD') {
                        const [lastItem] = data.sections[index].standards.slice(-1);
                        data.sections[index].standards.push({
                            id: uuidv4(),
                            name: '',
                            title: '',
                            start: new Date().toISOString(),
                            stop: new Date().toISOString(),
                            order: lastItem ? lastItem.order + 1024 : 1024,
                        });
                    }
                    if (type === 'DETAIL') {
                        const [lastItem] = data.sections[index].details.slice(-1);
                        data.sections[index].details.push({
                            id: uuidv4(),
                            title: '',
                            subTitle: '',
                            order: lastItem ? lastItem.order + 1024 : 1024,
                        });
                    }
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        addSection(state, action: ActionAddSection) {
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const [lastItem] = data.sections.slice(-1);
                    const length = data.sections.push({
                        id: uuidv4(),
                        type: action.payload.type,
                        heading: action.payload.heading ? action.payload.heading : 'untitled',
                        order: lastItem ? lastItem.order + 1024 : 1024,
                        details: [],
                        standards: [],
                        tags: [],
                    });
                    if (action.payload.type === 'STANDARD') {
                        data.sections[length - 1].standards.push({
                            id: uuidv4(),
                            name: '',
                            title: '',
                            start: new Date().toISOString(),
                            stop: new Date().toISOString(),
                            order: 1024,
                        });
                    }
                    if (action.payload.type === 'DETAIL') {
                        data.sections[length - 1].details.push({
                            id: uuidv4(),
                            title: '',
                            subTitle: '',
                            order: 1024,
                        });
                    }
                    state.cvData = data;
                    state.selectSection = false;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        editHeading(state, action: ActionEditHeading) {
            const { sectionId, heading } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    data.sections[index].heading = heading;
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        editTag(state, action: ActionEditTag) {
            const { sectionId, tags } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    data.sections[index].tags = tags;
                    state.cvData = data;
                }
            } catch (error) {}
            state.unSaved = true;
            return state;
        },
        editStandard(state, action: ActionEditStandard) {
            const { sectionId, standard } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    const sIndex = data.sections[index].standards.findIndex((s) => s.id === standard.id);
                    if (sIndex !== -1 || index !== -1) {
                        data.sections[index].standards[sIndex] = standard;
                        state.cvData = data;
                        state.unSaved = true;
                    }
                }
            } catch (error) {}
            state.render = !state.render;

            return state;
        },
        editDetail(state, action: ActionEditDetail) {
            const { sectionId, detail } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    const sIndex = data.sections[index].details.findIndex((d) => d.id === detail.id);
                    if (sIndex !== -1 || index !== -1) {
                        data.sections[index].details[sIndex] = detail;
                        state.cvData = data;
                    }
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        editAbout(state, action: ActionEditAbout) {
            const data = _.cloneDeep(state.cvData);
            const payload = action.payload;
            try {
                if (data) {
                    data.about = payload;
                    data.contact = payload;
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        deleteStandard(state, action: ActionDeleteStandard) {
            const { sectionId, standardId } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    const newStandard = data.sections[index].standards.filter((element) => element.id !== standardId);
                    data.sections[index].standards = newStandard;
                    state.deleteStandard.push([sectionId, standardId]);
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        deleteSection(state, action: ActionDeleteSection) {
            const { sectionId } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const newSection = data.sections.filter((s) => s.id !== sectionId);
                    data.sections = newSection;
                    state.deleteSection.push(sectionId);
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        deleteDetail(state, action: ActionDeleteDetail) {
            const { sectionId, detailId } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const index = data.sections.findIndex((section) => section.id === sectionId);
                    const newDetail = data.sections[index].details.filter((element) => element.id !== detailId);
                    data.sections[index].details = newDetail;
                    state.deleteDetail.push([sectionId, detailId]);
                    state.cvData = data;
                }
            } catch (error) {}
            state.render = !state.render;
            state.unSaved = true;
            return state;
        },
        sortSection(state, action: ActionSortSection) {
            const { current, next, prev } = action.payload;
            const data = _.cloneDeep(state.cvData);
            try {
                if (data) {
                    const { sections } = data;
                    let newOrder: number | undefined;
                    const prevIndex = sections.findIndex((s) => s.id === prev);
                    const nextIndex = sections.findIndex((s) => s.id === next);
                    if (prevIndex < 0 && nextIndex < 0) return state;
                    if (prevIndex < 0 && nextIndex > -1) newOrder = sections[nextIndex].order - 512;
                    if (prevIndex > -1 && nextIndex < 0) newOrder = sections[prevIndex].order + 512;
                    if (prevIndex > -1 && nextIndex > -1) {
                        const prevOrder = sections[prevIndex].order;
                        const nextOrder = sections[nextIndex].order;
                        newOrder = Math.floor((prevOrder + nextOrder) / 2);
                        if (Math.abs(newOrder - prevOrder) <= 1 || Math.abs(newOrder - nextOrder) <= 1) {
                            const reSortSection = data.sections.map((sec, index) => {
                                return {
                                    ...sec,
                                    order: (index + 1) * 1024,
                                };
                            });
                            data.sections = reSortSection;
                            state.render = !state.render;
                            return state;
                        }
                    }
                    const index = data.sections.findIndex((e) => e.id === current);
                    if (index !== -1 && newOrder !== undefined) {
                        data.sections[index].order = newOrder;
                        state.cvData = data;
                    }
                }
                state.unSaved = true;
                return state;
            } catch (error) {}
        },
        clearUnsaved(state) {
            state.unSaved = false;
            return state;
        },
    },
});

export const editAction = editSlice.actions;

const editReducer = editSlice.reducer;
export default editReducer;
