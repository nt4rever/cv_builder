import { BottomNavigation } from '@mui/material';
import React from 'react';
import './style.scss';

function Footer() {
    const [value, setValue] = React.useState(0);
    return (
        <div className="wrapper-footer">
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                sx={{
                    backgroundColor: '#f2f7fc;',
                    height: '100%',
                }}
            >
                <div className="footer">
                    <div>
                        <hr className="line" />
                    </div>
                    <div className="font-footer">© 2023 NAPA Holdings. All Rights Reserved.</div>
                </div>
            </BottomNavigation>
        </div>
    );
}

export default Footer;
