export const formatDate = (date: string) => {
    const d = new Date(date);
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `Updated ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes}`;
};

export const getMonthYear = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    return `${m}/${y}`;
};
