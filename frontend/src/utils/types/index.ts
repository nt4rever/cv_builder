export interface UserResponse {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
}

export interface IFormInput {
    email: string;
    password: string;
}

export interface ErrorResponse {
    statusCode: number;
    message?: string | string[];
    error?: string;
}
export interface SectionData {
    id: number;
    jobTitle: string;
    icon: string;
    component: JSX.Element | any;
    btnContent: string;
    ref: React.RefObject<HTMLInputElement>;
    itemSection: JSX.Element[] | Record<'id', string>[];
    position: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, setTitle: React.Dispatch<React.SetStateAction<string>>) => void;
    handleAdd: (state: JSX.Element[], setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>) => void;
    handleDelete: (
        index: number,
        state: JSX.Element[],
        setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
    ) => void;
}

export interface IStateTitle {
    work: string;
    educationTitle: string;
    languageTitle: string;
    patentTitle: string;
    referenceTitle: string;
    hobbyTitle: string;
    skillTitle: string;
    groupSkillTitle: string;
    internshipTitle: string;
    volunteeringTitle: string;
    conferenceTitle: string;
    detailedListTitle: string;
    standardListTitle: string;
    tagListTitle: string;
}
export interface CVStorageResponse {
    data: CVData[];
}

export interface CVData {
    id: string;
    template: Template;
    about: About;
    contact: Contact;
    sections: Section[];
    theme: ThemeColor;
    urlImage?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Template {
    id: string;
    category: string;
    name: string;
    theme: ThemeColor;
    description: string;
    urlImage: string;
}

export interface ThemeColor {
    primaryText: string;
    sectionTitle: string;
    monogramBackground: string;
    monogramText: string;
    background: string;
}

export interface About {
    firstName: string;
    lastName?: string;
    title?: string;
    summary?: string;
}

export interface Contact {
    city?: string;
    state?: string;
    email: string;
    phone?: string;
}

export interface Section {
    id: string;
    order: number;
    type: 'TAG' | 'STANDARD' | 'DETAIL';
    heading: string;
    standards: Standard[];
    details: Detail[];
    tags: string[];
}

export interface Standard {
    id: string;
    name?: string;
    title?: string;
    start?: string;
    stop?: string;
    current?: boolean;
    description?: string;
    website?: string;
    order: number;
}

export interface Detail {
    id: string;
    title?: string;
    subTitle?: string;
    order: number;
}
