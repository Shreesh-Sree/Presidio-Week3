// Plain JavaScript object to track render counts without triggering React state loops
export const renderLogs: Record<string, number> = {};

export const trackRender = (name: string) => {
  renderLogs[name] = (renderLogs[name] || 0) + 1;
};

export const resetRenderLogs = () => {
  for (const key in renderLogs) {
    delete renderLogs[key];
  }
};
