import { About, Contact, Detail, Section, Standard } from 'utils/types';

export interface Action {
    type: string;
    payload: any;
}
export interface ActionAddItem {
    type: string;
    payload: {
        sectionId: string;
        type: 'STANDARD' | 'DETAIL';
    };
}
export interface ActionAddSection {
    type: string;
    payload: {
        type: 'STANDARD' | 'DETAIL' | 'TAG';
        heading?: string;
    };
}
export interface ActionEditTag {
    type: string;
    payload: {
        sectionId: string;
        tags: string[];
    };
}
export interface ActionEditStandard {
    type: string;
    payload: {
        sectionId: string;
        standard: Standard;
    };
}
export interface ActionDeleteStandard {
    type: string;
    payload: {
        sectionId: string;
        standardId: string;
    };
}
export interface ActionDeleteSection {
    type: string;
    payload: {
        sectionId: string;
    };
}
export interface ActionEditHeading {
    type: string;
    payload: {
        sectionId: string;
        heading: string;
    };
}
export interface ActionEditDetail {
    type: string;
    payload: {
        sectionId: string;
        detail: Detail;
    };
}
export interface ActionDeleteDetail {
    type: string;
    payload: {
        sectionId: string;
        detailId: string;
    };
}

export interface ActionEditAbout {
    type: string;
    payload: About & Contact;
}

export interface ActionSortSection {
    type: string;
    payload: {
        current: string;
        next?: string;
        prev?: string;
    };
}
