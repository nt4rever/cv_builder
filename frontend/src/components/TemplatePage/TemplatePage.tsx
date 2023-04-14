import React, { useState } from 'react';
import { Button } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ResumeJson from '../../data/resume.json';
import Templatecv from './Template/TemplateCv';
import '../TemplatePage/style.scss';
import Carousels from './Carousel/Carousel';
import Tabs from './Tabs/TabCv';
import cvresume from '@/assets/img/svg/resume.svg';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

const TemplatePage = () => {
    const [category, setCategory] = useState('Creative');
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);

    return (
        <>
            <Header></Header>
            <div className="wrapper">
                <div className="container">
                    <div className="template">
                        <div className="template__title ">
                            <div className="page__title">Creative</div>
                            <div className="page__title">CV Templates</div>
                            <div className="template__title--subtitle subtitle">
                                These eye-catching creative resume templates will impress recruiters. Don't spend hours
                                in Illustrator — our resume templates have automatic formatting and follow best
                                practices.
                            </div>
                        </div>
                        <div className="template__slidecv">
                            <div className="template__slidecv--btn">
                                <Tabs setCategory={setCategory} />
                            </div>
                            <div className="template__slidecv--listcv">
                                <Templatecv category={category} />
                            </div>
                        </div>
                        <div className="template__examples">
                            <div className="page__title">Profession Specific</div>
                            <div className="page__title">CV Examples</div>
                            <div className="template__examples--subtitle">
                                CV writing is challenging. Use these real-world resume samples from successful job
                                seekers as inspiration to write your own.
                            </div>
                        </div>
                        <div className="template__cvexample">
                            <Carousels />
                        </div>
                        <div className="template__resume">
                            <div className="template__resume--title">
                                <div className="page__title">Online Resume Builder</div>
                                <div className="resume-subtitle subtitle">
                                    A modern app built specifically to help you create a resume that gets interviews.
                                </div>
                            </div>
                            <div className="template__resume--builder">
                                <div className="builder__left">
                                    <div className="builder__left--title">Why use our resume builder?</div>
                                    <div className="builder__left--items">
                                        {ResumeJson &&
                                            ResumeJson.map((resume) => {
                                                return (
                                                    <div key={resume.id} className="list-items">
                                                        <div className="list-items__icon">
                                                            <img src={resume.icon} alt="" />
                                                            <div className="label">{resume.label}</div>
                                                        </div>
                                                        <div className="list-items__content">
                                                            <div className="content">{resume.content}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                                <div className="builder__right">
                                    <img src={cvresume} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="template__started">
                            <div className="template__started--title ">Ready to Get Started?</div>
                            <div className="template__started--subtitle">
                                Impress potential employers with a professionally designed creative resume. It only
                                takes 15 minutes and you'll get more interviews.
                            </div>
                            <div className="template__started--btn">
                                {!currentAccount ? (
                                    <Link to="/login">
                                        <Button
                                            style={{
                                                borderRadius: 8,
                                                backgroundColor: '#2A3FFB',
                                                padding: '10px 22px',
                                                fontSize: '15px',
                                                fontWeight: '300',
                                                textTransform: 'none',
                                                lineHeight: '15px',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            variant="contained"
                                        >
                                            Create your resume
                                            <ArrowRightAltIcon
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '2px',
                                                }}
                                            ></ArrowRightAltIcon>
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/add-cv">
                                        <Button
                                            style={{
                                                borderRadius: 8,
                                                backgroundColor: '#2A3FFB',
                                                padding: '10px 22px',
                                                fontSize: '15px',
                                                fontWeight: '300',
                                                textTransform: 'none',
                                                lineHeight: '15px',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            variant="contained"
                                        >
                                            Create your resume
                                            <ArrowRightAltIcon
                                                style={{
                                                    fontSize: '30px',
                                                    fontWeight: 'bold',
                                                    marginTop: '2px',
                                                }}
                                            ></ArrowRightAltIcon>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default TemplatePage;
