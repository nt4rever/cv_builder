import React from 'react';
import ArrowIcon from '@/assets/img/svg/arrow.svg';

import './style.scss';
interface ButtonProps {
    buttonSubmit?: React.ReactNode;
    onClick: () => void;
}
const Button: React.FC<ButtonProps> = ({ onClick, buttonSubmit }) => {
    return (
        <button className="btn-common" onClick={onClick}>
            {buttonSubmit}
            <img className="img-common" src={ArrowIcon} alt="" />
        </button>
    );
};

export default Button;
