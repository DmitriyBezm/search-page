export const debounce = <F extends (...args: unknown[]) => unknown>(
  delayMS: number,
  cb: F
) => {
  let timerId: number | null = null;

  return (...args: Parameters<F>) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      cb(...args);
    }, delayMS);
  };
};
