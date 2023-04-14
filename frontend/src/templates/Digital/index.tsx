import { TemplateProps } from 'templates';
import styles from './index.module.scss';
import { getMonthYear } from 'utils/date';
import { serializeSlateToHtml } from 'utils/slate';
import { useEffect, useState } from 'react';

const Digital = (props: TemplateProps) => {
    const { about, contact, sections } = props.data;
    const tags = sections.filter((s) => s.type === 'TAG').sort((a, b) => a.order - b.order);
    const standards = sections.filter((s) => s.type === 'STANDARD').sort((a, b) => a.order - b.order);
    const [address, setAddress] = useState('');
    useEffect(() => {
        if (contact.city && contact.state) {
            setAddress(`${contact.city}, ${contact.state}`);
        } else if (contact.city) {
            setAddress(`${contact.city}`);
        } else if (contact.state) {
            setAddress(`${contact.state}`);
        } else {
            setAddress('');
        }
    }, []);
    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['container']}>
                    <div className={styles['background']}>
                        {about && about.lastName ? (
                            <>
                                <span>{about.firstName[0]}</span>
                                <span>{about.lastName[0]}</span>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                    <header className={styles['header']}>
                        <div className={styles['header__left']}>
                            <div className={styles['title']}>
                                <p>{about.firstName}</p>
                                <p>{about.lastName}</p>
                            </div>
                            <div className={styles['desc']}>{about.title}</div>
                        </div>
                        <p className={styles['header__right']}>{about.summary}</p>
                    </header>
                    <div className={styles['content']}>
                        <div className={styles['content__side']}>
                            <section className={styles['contact']}>
                                <div>Contact info</div>
                                <ul>
                                    {address && <li>{address}</li>}
                                    <li>{contact.email}</li>
                                    <li>{contact.phone}</li>
                                </ul>
                            </section>
                            {tags.map((tag) => (
                                <div className={styles['tag']} key={tag.id}>
                                    <div>{tag.heading}</div>
                                    <ul>
                                        {tag.tags.map((item, index) => (
                                            <li>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            {sections.map(
                                (section) =>
                                    section.type === 'DETAIL' && (
                                        <>
                                            <section className={styles['detail']}>
                                                <div>{section.heading}</div>
                                                {section.details.map((item) => {
                                                    const arr = item.subTitle && item.subTitle.split('\n');
                                                    return (
                                                        <>
                                                            <h3>{item.title}</h3>

                                                            <ul>{arr && arr.map((item, index) => <li>{item}</li>)}</ul>
                                                        </>
                                                    );
                                                })}
                                            </section>
                                        </>
                                    ),
                            )}
                        </div>
                        <div className={styles['content__main']}>
                            {standards.map((sec) => (
                                <section className={styles['section']} key={sec.id}>
                                    <div>{sec.heading}</div>
                                    <ul>
                                        {[...sec.standards]
                                            .sort((a, b) => a.order - b.order)
                                            .map((item, index) => (
                                                <li>
                                                    <span>{item.name}</span>
                                                    <div>
                                                        <p>{item.title}</p>
                                                        <span>&nbsp; | &nbsp; </span>
                                                        <p className={styles['dark-green-color']}>{`${getMonthYear(
                                                            item.start,
                                                        )} - ${getMonthYear(item.stop)}`}</p>
                                                    </div>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: serializeSlateToHtml(item.description),
                                                        }}
                                                    ></div>
                                                </li>
                                            ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Digital;
