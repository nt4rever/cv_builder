import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { CVData, Section } from 'utils/types';
import styles from './index.module.scss';
import { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import ChildMenu from './ChildMenu';
import { StrictModeDroppable } from './StrictModeDroppable ';
import clsx from 'clsx';

interface SideBarProps {
    data?: CVData;
    isRender: boolean;
}

const SideBar: FC<SideBarProps> = ({ data }) => {
    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        if (data?.sections) {
            setSections([...data.sections].sort((a, b) => a.order - b.order));
        }
    }, [data]);

    const dispatch = useDispatch();

    const handelOpenModalSelectSection = () => {
        dispatch(editAction.selectSection());
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderData] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderData);
        setSections(items);
        const descIndex: number = result.destination.index;
        const current = items[descIndex];
        const next = items[descIndex + 1];
        const prev = items[descIndex - 1];
        dispatch(
            editAction.sortSection({
                current: current.id,
                prev: prev && prev.id,
                next: next && next.id,
            }),
        );
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {
                    <div className={clsx(styles.item, styles.disable)}>
                        <div className={styles.heading}>About</div>
                    </div>
                }
                <div>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <StrictModeDroppable droppableId="droppable">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {sections.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className={styles.item}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={styles.heading}>
                                                        <p>{item.heading}</p>
                                                    </div>
                                                    <ChildMenu data={item} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </StrictModeDroppable>
                    </DragDropContext>
                </div>
            </div>
            <div className={styles.addSection} onClick={handelOpenModalSelectSection}>
                <span>+</span> Add Section
            </div>
        </div>
    );
};

function areEqual(prevProps: SideBarProps, nextProps: SideBarProps) {
    if (prevProps.isRender !== nextProps.isRender) return false;
    return true;
}

export default memo(SideBar, areEqual);
