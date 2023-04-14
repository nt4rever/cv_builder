import { useCallback, useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import isUrl from 'is-url';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, Range, createEditor, Element as SlateElement } from 'slate';
import { withHistory } from 'slate-history';
import { Button, Icon, Toolbar } from './component';
import IconBold from '@/assets/img/svg/iconBold.svg';
import IconList from '@/assets/img/svg/iconList.svg';
import IconItalicized from '@/assets/img/svg/iconItalicized.svg';
import IconInsertFile from '@/assets/img/svg/iconInsertFile.svg';
import styles from './style.module.scss';

const LIST_TYPES = ['numbered-list', 'bulleted'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const RichTextExample = ({ contentValue, setContentValue }) => {
    const renderElement = useCallback((props) => <Element {...props} />, []);
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
    const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), []);

    const onKeyDown = (event) => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
            const { nativeEvent } = event;
            if (isKeyHotkey('left', nativeEvent)) {
                event.preventDefault();
                Transforms.move(editor, { unit: 'offset', reverse: true });
                return;
            }
            if (isKeyHotkey('right', nativeEvent)) {
                event.preventDefault();
                Transforms.move(editor, { unit: 'offset' });
                return;
            }
        }
    };

    const initialValue = useMemo(() => {
        try {
            return JSON.parse(contentValue || '');
        } catch (error) {
            return deserialize(contentValue || '');
        }
    }, [contentValue]);

    if (isLinkActive(editor)) {
        unwrapLink(editor);
    }

    return (
        <Slate
            editor={editor}
            value={initialValue}
            onChange={(value) => {
                const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
                if (isAstChange) {
                    setContentValue(JSON.stringify(value));
                }
            }}
        >
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Add bullet points here. "
                spellCheck
                // autoFocus
                onKeyDown={onKeyDown}
                style={{
                    paddingBottom: '36px',
                    color: '#000',
                    cursor: 'text',
                }}
                className={styles['slate']}
            />
            <Toolbar>
                <BlockButton format="bulleted" icon={<img src={IconList} alt="" />} />
                <MarkButton format="bold" icon={<img src={IconBold} alt="" />} />
                <MarkButton format="italic" icon={<img src={IconItalicized} alt="" />} />
                <AddLinkButton />
            </Toolbar>
        </Slate>
    );
};

const withInlines = (editor) => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = (element) => ['link'].includes(element.type) || isInline(element);

    editor.insertText = (text) => {
        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertText(text);
        }
    };

    editor.insertData = (data) => {
        const text = data.getData('text/plain');

        if (text && isUrl(text)) {
            wrapLink(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url);
    }
};

const isLinkActive = (editor) => {
    const [link] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
    return !!link;
};

const unwrapLink = (editor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
};

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
    }
};

const LinkComponent = ({ attributes, children, element }) => {
    return (
        <a className={styles['link']} {...attributes} href={element.url}>
            {children}
        </a>
    );
};

const AddLinkButton = () => {
    const editor = useSlate();
    return (
        <Button
            active={isLinkActive(editor)}
            onMouseDown={(event) => {
                event.preventDefault();
                const url = window.prompt('Enter the URL of the link:');
                if (!url) return;
                insertLink(editor, url);
            }}
        >
            <Icon className={isLinkActive(editor) ? '' : styles['btn--active']}>
                <img src={IconInsertFile} alt="" />
            </Icon>
        </Button>
    );
};

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type');
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    });
    let newProperties;
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        };
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        };
    }
    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
        }),
    );

    return !!match;
};

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

const Element = (props) => {
    const { attributes, children, element } = props;
    const style = { textAlign: element.align };
    switch (element.type) {
        case 'link':
            return <LinkComponent {...props} />;
        case 'text':
            return <span {...attributes}>{children}</span>;
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            );
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            );
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            );
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            );
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            );
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            );
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.bulleted) {
        children = (
            <li className={styles['bulleted']} style={{ listStyle: 'inherit !important' }}>
                {children}
            </li>
        );
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    if (leaf.text) {
        children = <span>{children}</span>;
    }

    return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleBlock(editor, format);
            }}
        >
            <Icon
                className={
                    isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
                        ? ''
                        : styles['btn--active']
                }
            >
                {icon}
            </Icon>
        </Button>
    );
};

const MarkButton = ({ format, icon }) => {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault();
                toggleMark(editor, format);
            }}
        >
            <Icon className={isMarkActive(editor, format) ? '' : styles['btn--active']}>{icon}</Icon>
        </Button>
    );
};

// Define a deserializing function that takes a string and returns a value.
const deserialize = (string) => {
    // Return a value array of children derived by splitting the string.
    return string.split('\n').map((line) => {
        return {
            children: [{ text: line }],
        };
    });
};

export default RichTextExample;
