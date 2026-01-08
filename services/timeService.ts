export const getCurrentTimeMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const parseTimeMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const isTimeInRange = (startStr: string, endStr: string): boolean => {
  const current = getCurrentTimeMinutes();
  const start = parseTimeMinutes(startStr);
  const end = parseTimeMinutes(endStr);

  if (start <= end) {
    // Normal range (e.g., 09:00 to 17:00)
    return current >= start && current < end;
  } else {
    // Cross-midnight range (e.g., 22:00 to 07:00)
    return current >= start || current < end;
  }
};

export const formatTimeRemaining = (endStr: string): string => {
  const current = getCurrentTimeMinutes();
  let end = parseTimeMinutes(endStr);
  
  if (end < current) {
    end += 24 * 60; // Add a day if it crosses midnight
  }
  
  const diff = end - current;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  
  return `${h}h ${m}m`;
};
