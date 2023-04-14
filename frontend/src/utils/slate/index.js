import escapeHtml from 'escape-html';
import { Text } from 'slate';

const serializeSlate = (node) => {
    if (Text.isText(node)) {
        let string = `${escapeHtml(node.text)}`;
        if (node.bold) string = `<strong>${string}</strong>`;
        if (node.italic) string = `<i>${string}</i>`;
        return string;
    }

    const children = node.children.map((n) => serializeSlate(n)).join('');

    switch (node.type) {
        case 'bulleted':
            return `<ul>${children}</ul>`;
        case 'list-item':
            return `<li>${children}</li>`;
        case 'paragraph':
            return `<p>${children}</p>`;
        case 'link':
            return `<a href="${escapeHtml(node.url)}">${children}</a>`;
        default:
            return children;
    }
};

export const serializeSlateToHtml = (content) => {
    try {
        const result = convertJsonToSlate(content);
        return serializeSlate({
            children: result,
        });
    } catch (error) {
        return '';
    }
};

const convertJsonToSlate = (contentValue) => {
    try {
        return JSON.parse(contentValue || '');
    } catch (error) {
        return deserialize(contentValue || '');
    }
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
