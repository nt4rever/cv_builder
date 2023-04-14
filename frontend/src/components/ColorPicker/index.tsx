import React, { useEffect, useRef } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import styles from './style.module.scss';

interface IProps {
    currentColor: string;
    onClose: () => void;
    colorName: string;
}

const ColorPicker: React.FC<IProps> = ({ colorName, currentColor, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                !(event.target instanceof HTMLElement && event.target.closest('.sketch-picker'))
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleChangeColor = (color: ColorResult) => {
        dispatch(
            editAction.setTheme({
                [colorName]: color.hex,
            }),
        );
    };

    return (
        <div className={styles['picker']} ref={ref}>
            <SketchPicker color={currentColor} onChangeComplete={handleChangeColor}></SketchPicker>
        </div>
    );
};

export default ColorPicker;
