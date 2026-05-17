const formatDuration = (seconds: string | number | undefined | null) => {
    const totalSeconds = Number(seconds);

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
        return "0 sec";
    }

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
        return `${hrs} hr ${mins} min`;
    }

    if (mins > 0) {
        return `${mins} min ${secs} sec`;
    }

    return `${secs} sec`;
};

export default formatDuration