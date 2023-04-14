import { FC } from 'react';
import styles from './index.module.scss';
import { useState } from 'react';
import useDebounce from 'hooks/useDebounce';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';

interface TagProps {
    sectionId: string;
    tags: string[];
}

const Tag: FC<TagProps> = ({ tags, sectionId }) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(tags.join('\n'));
    const currentStr: string = useDebounce(value, 1000);

    useEffect(() => {
        dispatch(
            editAction.editTag({
                sectionId,
                tags: currentStr
                    .trim()
                    .split('\n')
                    .filter((x) => x),
            }),
        );
    }, [currentStr, dispatch, sectionId]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
    };
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <textarea placeholder="Add one item on each line" value={value} onChange={handleChange}></textarea>
            </div>
        </div>
    );
};

export default Tag;
