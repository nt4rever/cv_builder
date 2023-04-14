import ReactDOM from 'react-dom';
import IconClose from '@/assets/img/svg/iconClose.svg';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { ErrorResponse, Template } from 'utils/types';
import { getAllTemplate } from '../../apis/template';
import { useDispatch, useSelector } from 'react-redux';
import { editServices } from 'apis/edit-cv';
import { snackBarAction } from 'redux/SnackBar/slice';
import { AxiosError } from 'axios';
import { editAction } from 'redux/EditCV/slice';

interface ModelProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const templateCategories = ['Creative', 'Modern', 'Professional', 'Simple'];
type TypeCategories = typeof templateCategories[number];

const ModalChangeTemplate = ({ isOpen, setIsOpen }: ModelProps) => {
    const [currentCategory, setCurrentCategory] = useState<TypeCategories>(templateCategories[0]);
    const [data, setData] = useState<Template[]>([]);
    const { cvId } = useSelector((state: any) => state.edit);
    const dispatch = useDispatch();

    useEffect(() => {
        getAllTemplate().then((response) => {
            if (response) setData(response);
        });
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };
    const shuffleCVList = () => {
        let array = data;
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        setData(data);
    };
    const handleChangeTemplate = async (id: string) => {
        try {
            dispatch(editAction.loading(true));
            const { data } = await editServices.changeTemplate({ cvId, templateId: id });
            dispatch(
                editAction.setCv({
                    cvData: data.data,
                }),
            );
            dispatch(editAction.loading(false));
            setIsOpen(false);
        } catch (error) {
            dispatch(editAction.loading(false));
            if (error instanceof AxiosError<ErrorResponse>) {
                dispatch(
                    snackBarAction.open({
                        message: error?.response?.data.message,
                        type: 'error',
                        duration: 2000,
                    }),
                );
            }
        }
    };

    const renderTemplate = useMemo(
        () =>
            data
                // .filter((element) => element.category === currentCategory)
                .map((element) => (
                    <TemplateItem template={element} changeTemplateFn={handleChangeTemplate} key={element.id} />
                )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, currentCategory],
    );

    return ReactDOM.createPortal(
        <div className={styles.root} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className={styles.container}>
                <div className={styles.buttonClose} onClick={handleClose}>
                    <img width="27" height="27" src={IconClose} alt="" />
                </div>
                <h1 className={styles.title}>Choose a Template</h1>
                <div className={styles.categories}>
                    <div className={styles.container}>
                        {templateCategories.map((category) => (
                            <div
                                key={category}
                                className={clsx(styles.categoryItem, { activeItem: currentCategory === category })}
                                onClick={() => {
                                    setCurrentCategory(category);
                                    shuffleCVList();
                                }}
                            >
                                {category}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.wrapper}>{renderTemplate}</div>
            </div>
        </div>,
        document.querySelector('body') as HTMLElement,
    );
};

interface TemplateItemProps {
    template: Template;
    changeTemplateFn: (id: string) => void;
}

const TemplateItem: FC<TemplateItemProps> = ({ template, changeTemplateFn }) => {
    return (
        <div className={styles.template}>
            <div className={styles.image}>
                <img src={template.urlImage} alt="template" />
                <div className={styles.overlayContainer}>
                    <div className={styles.overlay}>
                        <button onClick={() => changeTemplateFn(template.id)}>Use this template</button>
                    </div>
                </div>
            </div>
            <div className={styles.information}>
                <h4 className={styles.name}>{template.name}</h4>
                <p className={styles.description}>{template.description}</p>
            </div>
        </div>
    );
};
export default ModalChangeTemplate;
