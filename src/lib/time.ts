

export function getTimeRangeResult(date: Date = new Date()): number {
    const hour = date.getHours();
    if (hour >= 0 && hour < 11) return 0;
    else if (hour >= 11 && hour < 13) return 1;
    else return 2;
}