import { Section } from './../../utils/types';
import { About, CVData, Contact, Detail, Standard, ThemeColor } from 'utils/types';
import axiosClient, { axiosClientUpload } from '../../utils/axiosClient';
import { EditState } from 'redux/EditCV/slice';
import { saveThumbnail } from 'apis/view';

const END_POINT = {
    GET: '/cvstorage',
    UPDATE_THEME_COLOR: '/cvstorage/theme',
    UPDATE_TEMPLATE: '/cvstorage/template',
    UPDATE_ABOUT: '/cvstorage/about',
    UPDATE_AVATAR: '/cvstorage/avatar',
    CREATE_SECTION: '/cvstorage/section',
    UPDATE_SECTION: '/cvstorage/section',
    DELETE_SECTION: '/cvstorage/section',
    CREATE_SECTION_CONTENT: '/cvstorage/section/content',
    UPDATE_SECTION_CONTENT: '/cvstorage/section/content',
    DELETE_SECTION_CONTENT: '/cvstorage/section/content',
};

const getCvData = (cvId: string) => {
    return axiosClient.get<CVData>(`${END_POINT.GET}/${cvId}`);
};

interface ThemePayload {
    cvId: string;
    theme: ThemeColor;
}
interface TemplatePayload {
    cvId: string;
    templateId: string;
}

interface AboutPayload {
    cvStorageId: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    summary?: string;
    city?: string;
    state?: string;
    email?: string;
    phone?: string;
}

interface SectionPayload {
    sectionId: string;
    heading: string;
    order?: number;
}

interface SectionCreatePayload {
    cVStorageId: string;
    heading: string;
    type: string;
    order?: number;
}

const changeTheme = ({ cvId, theme }: ThemePayload) => {
    return axiosClient.patch<{ message: string }>(`${END_POINT.UPDATE_THEME_COLOR}/${cvId}`, { ...theme });
};

const changeTemplate = (payload: TemplatePayload) => {
    return axiosClient.patch<{ message: string; data: CVData }>(`${END_POINT.UPDATE_TEMPLATE}`, payload);
};

const updateAbout = (payload: AboutPayload) => {
    return axiosClient.patch<{ message: string; about: Contact & About }>(END_POINT.UPDATE_ABOUT, payload);
};

const createSection = (payload: SectionCreatePayload) => {
    return axiosClient.post<{ message: string; section: Section }>(END_POINT.CREATE_SECTION, payload);
};

const updateSection = (payload: SectionPayload) => {
    return axiosClient.patch<{ message: string }>(END_POINT.UPDATE_SECTION, payload);
};

const deleteSection = (sectionId: string) => {
    return axiosClient.delete<{ message: string }>(`${END_POINT.DELETE_SECTION}/${sectionId}`);
};

interface SectionContentPayload {
    sectionId: string;
    detail?: Detail;
    standard?: Standard;
    tag?: string[];
}

const createSectionContent = (payload: SectionContentPayload) => {
    return axiosClient.post<{ message: string }>(END_POINT.CREATE_SECTION_CONTENT, payload);
};

const updateSectionContent = (payload: { data: SectionContentPayload; contentId: string }) => {
    return axiosClient.patch<{ message: string }>(
        `${END_POINT.UPDATE_SECTION_CONTENT}/${payload.contentId}`,
        payload.data,
    );
};

const deleteSectionContent = (contentId: string, payload: { sectionId: string }) => {
    return axiosClient.delete<{ message: string }>(`${END_POINT.DELETE_SECTION_CONTENT}/${contentId}`, {
        data: payload,
    });
};

const uploadAvatar = ({ cvId, formData }: { cvId: string; formData: FormData }) => {
    return axiosClientUpload.post<{ message: string; url: string }>(`${END_POINT.UPDATE_AVATAR}/${cvId}`, formData);
};

const updateCV = async (data: EditState) => {
    try {
        const { deleteDetail, deleteStandard, deleteSection: deleteSectionArr, cvData } = data;

        // delete section, content
        await Promise.all(
            [...deleteDetail, ...deleteStandard].map(async (element) => {
                if (element[1].length === 24) {
                    await deleteSectionContent(element[1], { sectionId: element[0] });
                }
            }),
        );
        await Promise.all(
            deleteSectionArr.map(async (element) => {
                if (element.length === 24) {
                    await deleteSection(element);
                }
            }),
        );

        // create or update section and content
        if (cvData) {
            const { about, contact, sections } = cvData;
            await Promise.all([
                updateAbout({ ...about, ...contact, cvStorageId: cvData.id }),
                ...sections.map(async (section) => {
                    const standardOmit = section.standards.filter((s) => s.name && s.title);
                    const detailOmit = section.details.filter((d) => d.title && d.subTitle);
                    let sectionId = section.id;
                    if (!section.tags.length && !detailOmit.length && !standardOmit.length) {
                        if (section.id.length === 24) {
                            await deleteSection(sectionId);
                        }
                        return;
                    }
                    if (section.id.length === 36) {
                        const { data } = await createSection({
                            cVStorageId: cvData.id,
                            heading: section.heading,
                            type: section.type,
                            order: section.order,
                        });
                        sectionId = data.section.id;
                    } else await updateSection({ sectionId, heading: section.heading, order: section.order });
                    const type = section.type;
                    if (type === 'TAG') await createSectionContent({ sectionId, tag: section.tags });
                    if (type === 'STANDARD')
                        await Promise.all(
                            standardOmit.map(async (standard) => {
                                // if (!standard.name || !standard.title) return;
                                if (standard.id.length === 36) await createSectionContent({ sectionId, standard });
                                else
                                    updateSectionContent({
                                        contentId: standard.id,
                                        data: { standard, sectionId },
                                    });
                            }),
                        );
                    if (type === 'DETAIL')
                        await Promise.all(
                            detailOmit.map(async (detail) => {
                                // if (!detail.title || !detail.subTitle) return;
                                if (detail.id.length === 36) await createSectionContent({ sectionId, detail });
                                else
                                    updateSectionContent({
                                        contentId: detail.id,
                                        data: { detail, sectionId },
                                    });
                            }),
                        );
                }),
            ]);
        }

        const access_token = localStorage.getItem('access_token');
        if (data.cvId && access_token) {
            saveThumbnail({ cvId: data.cvId, access_token });
        }
    } catch (error) {}
};

export const editServices = { getCvData, changeTheme, changeTemplate, updateCV, uploadAvatar };
