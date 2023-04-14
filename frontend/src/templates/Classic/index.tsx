import { TemplateProps } from 'templates';
import styles from './style.module.scss';
import { getMonthYear } from 'utils/date';
import { serializeSlateToHtml } from 'utils/slate';
import { useEffect, useState } from 'react';

function Classic(props: TemplateProps) {
    const { about, contact, sections, avatar } = props.data;
    const tags = sections.filter((s) => s.type === 'TAG').sort((a, b) => a.order - b.order);
    const standards = sections.filter((s) => s.type === 'STANDARD').sort((a, b) => a.order - b.order);
    const [address, setAddress] = useState('');
    const [title, setTitile] = useState('');
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
    }, [contact.city, contact.state]);
    useEffect(() => {
        let arr = [];
        about.title && arr.push(about.title);
        address && arr.push(address);
        setTitile(arr.join(' | '));
    }, [address, about.title]);
    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['container']}>
                    <header className={styles['header']}>
                        <div className={styles['header__name']}>
                            <span>{about.firstName}</span>
                            <span>{about.lastName}</span>
                        </div>
                        {avatar ? <img src={avatar} alt="" className={styles['header__avatar']} /> : <div></div>}
                    </header>
                    <section className={styles['about']}>
                        <p className={styles['about__job']}>{title}</p>
                        <p className={styles['about__bio']}>{about.summary}</p>
                        <p className={styles['about__info']}>
                            {`${contact.email}`} {contact.phone && ` | ${contact.phone}`}
                        </p>
                    </section>
                    {standards.map((section, index) => (
                        <section className={styles['standard']}>
                            <h3>{section.heading}</h3>
                            <ul className={styles['standard__list']}>
                                {section.standards.map((item) => (
                                    <li className={styles['standard__item']}>
                                        <div className={styles['standard__left']}>
                                            <a href={item.website}>{item.name}</a>
                                            <div className={styles['standard__time']}>
                                                <p>{getMonthYear(item.start)}</p>
                                                &nbsp;-&nbsp;
                                                <p>{item.current ? 'Current' : getMonthYear(item.stop)}</p>
                                            </div>
                                        </div>
                                        <div className={styles['standard__right']}>
                                            <p>{item.title}</p>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: serializeSlateToHtml(section.standards[0]?.description),
                                                }}
                                            ></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                    {sections.map(
                        (section) =>
                            section.type === 'DETAIL' && (
                                <>
                                    <section className={styles['detail']}>
                                        <h3>{section.heading}</h3>
                                        <ul className={styles['detail__list']}>
                                            {section.details.map((item) => {
                                                const list = item.subTitle && item.subTitle.split('\n');
                                                return (
                                                    <>
                                                        <li className={styles['detail__item']}>
                                                            <span>{item.title}</span>
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
                                <p>{tag.tags.join(', ')}</p>
                            </section>
                        </>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Classic;
