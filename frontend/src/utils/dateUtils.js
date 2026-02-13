/**
 * Formats a date string or Date object to 'dd/mm/yyyy' format.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date string (e.g., '25/12/2023').
 */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Invalid date

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Formats a date string or Date object to 'dd/mm/yyyy, HH:MM:SS' format.
 * @param {string|Date} date - The date to format.
 * @returns {string} - The formatted date time string.
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const datePart = formatDate(d);
    const timePart = d.toLocaleTimeString([], { hour12: true });

    return `${datePart}, ${timePart}`;
};
