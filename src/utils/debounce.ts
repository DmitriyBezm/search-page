// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <F extends (...args: any[]) => any>(
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
