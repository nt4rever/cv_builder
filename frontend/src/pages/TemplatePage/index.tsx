import React from 'react';
import '@/styles/scss/global/global.scss';
import TemplatePage from 'components/TemplatePage/TemplatePage';
const index = () => {
    return (
        <>
            <div className="wrapper">
                <div className="container">
                    <TemplatePage />
                </div>
            </div>
        </>
    );
};

export default index;
