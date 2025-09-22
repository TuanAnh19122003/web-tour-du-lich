export const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);

    if (isDateOnly) {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};


export const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};
