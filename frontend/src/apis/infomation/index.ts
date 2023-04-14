export interface CVInfomation {
    data: CVData[];
}
export interface CVData {
    id: string;
    template: Template;
    about: About;
    contact: Contact;
    sections: Section[];
    createdAt: string;
    updatedAt: string;
    work: Work[];
    education: Education[];
}

export interface Template {
    id: string;
    category: string;
    name: string;
    description: string;
    urlImage: string;
}

export interface About {
    firstName: string;
    lastName: string;
    title: string;
    summary: string;
}

export interface Work {
    id?: string;
    company?: string;
    jobTitle?: string;
}
export interface Education {
    school: string;
    degree: string;
}
export interface Contact {
    city: string;
    state: string;
    email: string;
    phone: string;
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
    name: string;
    title: string;
    start?: string;
    stop?: string;
    description?: string;
    order: number;
}

export interface Detail {
    id: string;
    title: string;
    subTitle: string;
    order: number;
}
