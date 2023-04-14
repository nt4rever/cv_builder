import styles from './index.module.scss';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EditState, editAction } from 'redux/EditCV/slice';
import IconReferences from '@/assets/img/svg/iconReferences.svg';
import IconLanguage from '@/assets/img/svg/iconLanguage.svg';
import IconPatents from '@/assets/img/svg/iconPatents.svg';
import IconWorkExperience from '@/assets/img/svg/iconWorkExperience.svg';
import IconPaper from '@/assets/img/svg/iconPaper.svg';
import IconEducation from '@/assets/img/svg/iconEducation.svg';
import IconHobbies from '@/assets/img/svg/iconHobbie.svg';
import IconSkills from '@/assets/img/svg/iconSkills.svg';
import IconLight from '@/assets/img/svg/iconLight.svg';
import IconVolunteering from '@/assets/img/svg/iconVolunteering.svg';
import IconConferences from '@/assets/img/svg/iconConferences.svg';
import IconStandard from '@/assets/img/svg/iconStandard.svg';
import IconTagList from '@/assets/img/svg/iconTagList.svg';
import IconDetailedList from '@/assets/img/svg/iconDetailedList.svg';

interface ICommon {
    type: 'TAG' | 'STANDARD' | 'DETAIL';
    heading?: string;
    icon?: string;
}

const commonSections: ICommon[] = [
    {
        type: 'STANDARD',
        heading: 'Job',
        icon: IconWorkExperience,
    },
    {
        type: 'TAG',
        heading: 'Language',
        icon: IconLanguage,
    },
    {
        type: 'TAG',
        heading: 'Patterns',
        icon: IconPatents,
    },
    {
        type: 'STANDARD',
        heading: 'Work',
        icon: IconPaper,
    },
    {
        type: 'DETAIL',
        heading: 'References',
        icon: IconReferences,
    },
    {
        type: 'STANDARD',
        heading: 'Work',
        icon: IconEducation,
    },
    {
        type: 'TAG',
        heading: 'Hobbies',
        icon: IconHobbies,
    },
    {
        type: 'DETAIL',
        heading: 'Skills',
        icon: IconSkills,
    },
    {
        type: 'DETAIL',
        heading: 'Grouped Skills',
        icon: IconLight,
    },
    {
        type: 'STANDARD',
        heading: 'Internship',
        icon: IconWorkExperience,
    },
    {
        type: 'DETAIL',
        heading: 'Volunteering',
        icon: IconVolunteering,
    },
    {
        type: 'DETAIL',
        heading: 'Conferences',
        icon: IconConferences,
    },
];

const baseSections: ICommon[] = [
    {
        type: 'STANDARD',
        heading: 'Standard',
        icon: IconStandard,
    },
    {
        type: 'TAG',
        heading: 'Tag list',
        icon: IconTagList,
    },
    {
        type: 'DETAIL',
        heading: 'Detail list',
        icon: IconDetailedList,
    },
];

const ModalSelectSection = () => {
    const { selectSection } = useSelector((state: any) => state.edit as EditState);
    const dispatch = useDispatch();
    const handleClose = () => {
        dispatch(editAction.closeSelectSection());
    };

    if (!selectSection) return null;

    const handleAddItem = (item: ICommon) => {
        dispatch(editAction.addSection(item));
    };

    return ReactDOM.createPortal(
        <div className={styles.root}>
            <div className={styles.scrollContainer}>
                <div className={styles.wrapper}>
                    <div className={styles.header}>
                        <div className={styles.btnClose} onClick={handleClose}>
                            <svg
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.1167 0.601803L8.46668 5.04072L3.81668 0.601803C3.24608 0.0571102 2.3206 0.0571104 1.75001 0.601803L0.716672 1.58823C0.146078 2.13292 0.146078 3.01639 0.716673 3.56108L5.36668 8L0.716673 12.4389C0.146078 12.9836 0.146078 13.8671 0.716672 14.4118L1.75001 15.3982C2.3206 15.9429 3.24608 15.9429 3.81668 15.3982L8.46668 10.9593L13.1167 15.3982C13.6873 15.9429 14.6128 15.9429 15.1834 15.3982L16.2167 14.4118C16.7873 13.8671 16.7873 12.9836 16.2167 12.4389L11.5667 8L16.2167 3.56108C16.7873 3.01639 16.7873 2.13292 16.2167 1.58823L15.1834 0.601803C14.6128 0.0571104 13.6873 0.0571107 13.1167 0.601803Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                        <h2>Add a Section</h2>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.heading}>Common sections</div>
                        <div className={styles.container}>
                            {commonSections.map((element, index) => (
                                <div className={styles.item} key={index} onClick={() => handleAddItem(element)}>
                                    <img src={element.icon} alt="icon" />
                                    <p>{element.heading}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.heading}>Common sections</div>
                        <div className={styles.container}>
                            {baseSections.map((element, index) => (
                                <div className={styles.item} key={index} onClick={() => handleAddItem(element)}>
                                    <img src={element.icon} alt="icon" />
                                    <p>{element.heading}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector('body') as HTMLElement,
    );
};

export default ModalSelectSection;
