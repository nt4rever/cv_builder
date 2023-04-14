import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import templateMap, { TemplateProps } from 'templates';
import { CVData, ThemeColor } from 'utils/types';
import styles from './index.module.scss';

interface BuilderProps {
    data: CVData;
    mode: 'view' | 'edit';
}

const Builder = (props: BuilderProps) => {
    const theme = useSelector((state: any) => state.edit.theme);
    const { data, mode } = props;
    useEffect(() => {
        const r = document.querySelector(':root') as HTMLElement;
        let themeColor: ThemeColor;
        themeColor = mode === 'edit' ? theme : data.theme;
        r.style.setProperty('--background', themeColor.background);
        r.style.setProperty('--monogramBackground', themeColor.monogramBackground);
        r.style.setProperty('--monogramText', themeColor.monogramText);
        r.style.setProperty('--primaryText', themeColor.primaryText);
        r.style.setProperty('--sectionTitle', themeColor.sectionTitle);
    }, [theme, mode, data.theme]);

    const TemplatePage: React.FC<TemplateProps> | null = useMemo(
        () => templateMap[data.template.name.toLowerCase()].component,
        [data],
    );

    return (
        <div className={styles.root}>
            {mode === 'view' ? (
                <div className={styles.viewMode}>
                    <TemplatePage data={data} />
                </div>
            ) : (
                <TransformWrapper
                    centerOnInit
                    minScale={0.35}
                    initialScale={1}
                    limitToBounds={false}
                    centerZoomedOut={false}
                    pinch={{ step: 1 }}
                    wheel={{ step: 0.05 }}
                >
                    <TransformComponent wrapperClass={styles.wrapper}>
                        <div
                            id="cv-area"
                            style={{
                                width: '100%',
                            }}
                        >
                            <TemplatePage data={data} />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            )}
        </div>
    );
};

export default Builder;
