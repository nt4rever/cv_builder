import React, { useEffect, useState } from 'react';
import { TemplateProps } from 'templates';
import { getMonthYear } from 'utils/date';
import styles from './style.module.scss';
import { serializeSlateToHtml } from 'utils/slate';

function Pender(props: TemplateProps) {
    const { about, contact, sections, avatar } = props.data;
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
                    <header className={styles['header']}>
                        {avatar ? <img src={avatar} alt="" className={styles['header__avatar']} /> : <div></div>}
                        <div className={styles['header__info']}>
                            <div>
                                <p>{contact.phone !== null && contact.phone}</p>
                            </div>
                            <div>
                                <p>{contact.email !== null && contact.email}</p>
                                <p>{address}</p>
                            </div>
                        </div>
                    </header>
                    <section className={styles['owner']}>
                        <p className={styles['owner__name']}>{about.firstName + ' ' + about.lastName}</p>
                        ,&nbsp;
                        <p className={styles['owner__job']}>{about.title}</p>
                    </section>
                    <section className={styles['objective']}>
                        <p>{about.summary}</p>
                    </section>
                    {standards.map((section, index) => (
                        <>
                            <section className={styles['section']}>
                                <h3>{section.heading}</h3>
                                <ul className={styles['section__list']}>
                                    {section.standards.map((item) => (
                                        <>
                                            <li className={styles['section__item']}>
                                                <div className={styles['section__title']}>
                                                    <div className={styles['section__time']}>
                                                        <p>{getMonthYear(item.start)}</p>
                                                        &nbsp;-&nbsp;
                                                        <p>{item.current ? 'Current' : getMonthYear(item.stop)}</p>
                                                    </div>
                                                    <a href={item.website}>
                                                        <p>
                                                            {item.name} {item.title && `, ${item.title}`}
                                                        </p>
                                                    </a>
                                                </div>
                                                <div
                                                    className={styles['section__list']}
                                                    dangerouslySetInnerHTML={{
                                                        __html: serializeSlateToHtml(section.standards[0]?.description),
                                                    }}
                                                ></div>
                                            </li>
                                        </>
                                    ))}
                                </ul>
                            </section>
                        </>
                    ))}
                    {sections.map(
                        (section) =>
                            section.type === 'DETAIL' && (
                                <>
                                    <section className={styles['skill']}>
                                        <h3 className={styles['skill__title']}>Skills</h3>
                                        <ul className={styles['skill__list']}>
                                            {section.details.map((item) => {
                                                const list = item.subTitle && item.subTitle.split('\n');
                                                return (
                                                    <>
                                                        <li className={styles['skill__item']}>
                                                            <div>{item.title}</div>
                                                            <ul>
                                                                {list &&
                                                                    list.map((text) => (
                                                                        <>
                                                                            <li>{text}</li>
                                                                        </>
                                                                    ))}
                                                            </ul>
                                                        </li>
                                                    </>
                                                );
                                            })}
                                        </ul>
                                    </section>
                                </>
                            ),
                    )}
                    {tags.map((tag) => (
                        <>
                            <section className={styles['tag']}>
                                <h3>{tag.heading}</h3>
                                <ul>{tag.tags.join(', ')}</ul>
                            </section>
                        </>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Pender;
