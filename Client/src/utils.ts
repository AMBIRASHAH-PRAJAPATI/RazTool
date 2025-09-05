export const formatDuration = (seconds: string | number) => {
    const secs = typeof seconds === "string" ? parseInt(seconds, 10) : seconds;

    if (isNaN(secs) || secs < 0) return "0:00";

    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const remainingSeconds = secs % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
