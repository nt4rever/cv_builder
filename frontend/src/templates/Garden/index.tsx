import { TemplateProps } from 'templates';
import styles from './index.module.scss';
import {
    Facebook,
    Instagram,
    LinkedIn,
    LocationCity,
    Mail,
    Phone,
    PlayArrow,
    SchoolOutlined,
    Twitter,
    WebStories,
} from '@mui/icons-material';
import { User } from 'react-feather';
import { getMonthYear } from 'utils/date';
import { serializeSlateToHtml } from 'utils/slate';

const Garden = (props: TemplateProps) => {
    const { about, contact, sections, avatar } = props.data;

    const tags = sections.filter((s) => s.type === 'TAG').sort((a, b) => a.order - b.order);
    const standards = sections.filter((s) => s.type === 'STANDARD').sort((a, b) => a.order - b.order);
    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['wave-top']}>
                    <svg viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">
                        <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" style={{ stroke: 'none' }}></path>
                    </svg>
                </div>
                <div className={styles['layout_flex']}>
                    <div className={styles['col_left']}>
                        <div className={`${styles['user_avatar']} ${styles['mb-30']}`}>
                            <img src={avatar} alt="" />
                        </div>
                        <div className={`${styles['mb-30']}`}>
                            <p className={styles['text-typo']}>contact me</p>
                            <div className={styles['contact_list fz-13']}>
                                <div className={styles['contact_item']}>
                                    <Phone />
                                    <p className={styles['dark-green-color']}>{contact.phone}</p>
                                </div>
                                <div className={styles['contact_item']}>
                                    <LocationCity />
                                    <p className={styles['dark-green-color']}>{`${contact.city} ${contact.state}`}</p>
                                </div>
                                <div className={styles['contact_item']}>
                                    <Mail />
                                    <p className={styles['dark-green-color']}>{`${contact.email}`}</p>
                                </div>
                                <div className={styles['contact_item']}>
                                    <WebStories />
                                    <p className={styles['dark-green-color']}>www.website.com</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles['mb-30']}>
                            <p className={styles['text-typo']}>follow me</p>
                            <div className={styles['icon_list']}>
                                <div className={styles['social_icon']}>
                                    <Facebook />
                                </div>
                                <div className={styles['social_icon']}>
                                    <Twitter />
                                </div>
                                <div className={styles['social_icon']}>
                                    <Instagram />
                                </div>
                                <div className={styles['social_icon']}>
                                    <LinkedIn />
                                </div>
                            </div>
                        </div>

                        {tags.map((tag) => (
                            <div className={styles['hobbies']} key={tag.id}>
                                <p className={styles['text-typo']}>{tag.heading}</p>
                                <div className={styles['hobby_list']}>
                                    {tag.tags.map((item, index) => (
                                        <div className={styles['hobby_item']} key={index}>
                                            <p
                                                className={`${styles['fz-13']} ${styles['up-text']} ${styles['dark-green-color']}`}
                                            >
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles['col_right']}>
                        <div className={styles['name']}>
                            <h1>{`${about.firstName} ${about.lastName}`}</h1>
                        </div>
                        <div className={styles['position']}>
                            <p>{about.title}</p>
                        </div>
                        <div className={`${styles['mb-30']}`}>
                            <div className={`${styles['title-text']} ${styles['dark-green-color']}`}>
                                <User />
                                <p className={styles['up-text']}>profile</p>
                            </div>
                            <div className={styles['profile_text']}>
                                <p className={`${styles['fz-13']} ${styles['mt-8']} ${styles['pink-color']}`}>
                                    {about.summary}
                                </p>
                            </div>
                        </div>
                        {standards.map((sec) => (
                            <div className={styles['mb-30']} key={sec.id}>
                                <div className={`${styles['title-text']} ${styles['dark-green-color']}`}>
                                    <SchoolOutlined />
                                    <p className={styles['up-text']}>{sec.heading}</p>
                                </div>
                                <div className={`${styles['mt-8']} ${styles['fz-13']}`}>
                                    {[...sec.standards]
                                        .sort((a, b) => a.order - b.order)
                                        .map((item, index) => (
                                            <div className={styles['mb-8']} key={index}>
                                                <div className={styles['edu_title']}>
                                                    <PlayArrow />
                                                    <strong className={styles['dark-green-color']}>{`${getMonthYear(
                                                        item.start,
                                                    )} - ${
                                                        item.current ? 'Current' : getMonthYear(item.stop)
                                                    }`}</strong>
                                                    <p
                                                        className={`${styles['up-text']} ${styles['fz-13']} ${styles['dark-green-color']}`}
                                                    >
                                                        {item.name}
                                                    </p>
                                                </div>
                                                <div className={styles['edu_text ml-22']}>
                                                    <div
                                                        className={styles['pink-color']}
                                                        dangerouslySetInnerHTML={{
                                                            __html: serializeSlateToHtml(item.description),
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles['circle-2']}>
                        <svg height="600" width="600">
                            <circle cx="220" cy="220" r="220" />
                        </svg>
                    </div>
                    <div className={styles['circle-3']}>
                        <svg height="600" width="600">
                            <circle cx="100" cy="100" r="100" />
                        </svg>
                    </div>
                    <div className={styles['wave-bottom']}>
                        <svg viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">
                            <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" style={{ stroke: 'none' }}></path>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Garden;
