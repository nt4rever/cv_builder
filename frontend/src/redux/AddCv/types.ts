export interface About {
    firstName: string;
    lastName: string;
    summary?: string;
    title?: string;
}

export interface Contact {
    city?: string;
    email?: string;
    phone?: string;
    state?: string;
}

export interface Information {
    id: string;
    userId: string;
    about: About;
    contact: Contact;
}

export interface Work {
    id?: string;
    company?: string;
    jobTitle?: string;
    companyWebsite?: string;
    description?: string;
}

export interface Education {
    id?: string;
    school?: string;
    degree?: string;
    schoolWebsite?: string;
}
export interface InitialStateInformations {
    informations?: {
        information: Information;
        work: Work[];
        education: Education[];
    };
}

export interface ActionGetInformation {
    type: string;
    payload: {
        information: Information;
        work: Work[];
        education: [];
    } | null;
}

export interface Job {
    company: string;
    jobTitle: string;
}
