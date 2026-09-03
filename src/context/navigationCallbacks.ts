export let goToPresentationCallback: (() => void) | null = null;

export const setGoToPresentationCallback = (cb: () => void) => {
  goToPresentationCallback = cb;
};

export const triggerGoToPresentation = () => {
  goToPresentationCallback?.();
};
