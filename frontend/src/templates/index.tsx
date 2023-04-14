import { CVData } from 'utils/types';
import Kelly from './Kelly';
import Vienna from './Vienna';
import Garden from './Garden';
import Digital from './Digital';
import Pender from './Pender';
import Classic from './Classic';

export interface TemplateProps {
    data: CVData;
}

export type TemplateMeta = {
    id: string;
    name: string;
    preview?: string;
    component: React.FC<TemplateProps>;
};

const templateMap: Record<string, TemplateMeta> = {
    digital: {
        id: 'digital',
        name: 'digital',
        component: Digital,
    },
    vienna: {
        id: 'vienna',
        name: 'Vienna',
        component: Vienna,
    },
    kelly: {
        id: 'kelly',
        name: 'kelly',
        component: Kelly,
    },
    garden: {
        id: 'garden',
        name: 'garden',
        component: Garden,
    },
    pender: {
        id: 'pender',
        name: 'pender',
        component: Pender,
    },
    classic: {
        id: 'classic',
        name: 'classic',
        component: Classic,
    },
};

export default templateMap;
