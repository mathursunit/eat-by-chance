export function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function getDayIndex() {
    return new Date().getDay();
}

export function formatTime(timeStr) {
    // Convert 14:00 to 2:00 PM
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function getRestaurantStatus(restaurant) {
    const day = getDayIndex();
    const time = getCurrentTime(); // "14:30"

    if (!restaurant.hours || !restaurant.hours[day]) {
        return { isOpen: false, text: "Closed Today" };
    }

    const todayHours = restaurant.hours[day];

    // Check if open now
    for (const interval of todayHours) {
        let isOpenNow = false;

        if (interval.close < interval.open) {
            // Closes next day (e.g. 11:00 to 02:00)
            if (time >= interval.open || time < interval.close) {
                isOpenNow = true;
            }
        } else {
            // Standard hours (e.g. 11:00 to 22:00)
            if (time >= interval.open && time < interval.close) {
                isOpenNow = true;
            }
        }

        if (isOpenNow) {
            return {
                isOpen: true,
                text: `Open until ${formatTime(interval.close)}`,
                closeTime: interval.close
            };
        }
    }

    // If not open, find next open time today?
    // Or just say closed.
    // Check if it opens later today
    for (const interval of todayHours) {
        if (time < interval.open) {
            return {
                isOpen: false,
                text: `Opens at ${formatTime(interval.open)}`
            };
        }
    }

    return { isOpen: false, text: "Closed" };
}
