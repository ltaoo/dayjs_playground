export function debounce<T extends (...args: any[]) => any>(wait: number, func: T) {
  let timeoutId: NodeJS.Timeout | null;
  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId as NodeJS.Timeout);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}
