const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export function formatMonth(year: number, month: number): string {
    return `${MONTHS[month - 1]} ${year}`;
}
