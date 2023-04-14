import React, { useState } from 'react';
import './style.scss';

interface IProps {
    setCategory: React.Dispatch<React.SetStateAction<string>>;
}

const textData = [
    {
        id: 1,
        text: 'Creative',
    },
    {
        id: 2,
        text: 'Modern',
    },
    {
        id: 3,
        text: 'Professional',
    },
    {
        id: 4,
        text: 'Simple',
    },
];
const TabCv = ({ setCategory }: IProps) => {
    const [isActive, setIsActive] = useState(1);
    const handleClick = (id: number) => {
        setIsActive(id);
        setCategory(textData[id-1].text);
    };
    return (
        <div className="tab">
            <ul className="tab-items">
                {textData.map(({ id, text }) => {
                    return (
                        <li
                            key={text}
                            className={`tab-items__list ${id === isActive ? 'active' : ''}`}
                            onClick={() => handleClick(id)}
                        >
                            {text}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TabCv;
