import React from 'react';
import Hero from './Hero';
import StepWorks from './StepWorks/index';
import FirstFearture from './FirstFearture/index';
import SecondFearture from './SecondFearture/index';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

function index() {
    return (
        <>
            <Header></Header>
            <div className="wrapper">
                <div className="container">
                    <Hero></Hero>
                    <StepWorks></StepWorks>
                    <FirstFearture></FirstFearture>
                    <SecondFearture></SecondFearture>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default index;
