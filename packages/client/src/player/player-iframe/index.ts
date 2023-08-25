import { getPlayerPublicApi } from '../public-api';

export const init = () => {
  getPlayerPublicApi().iframe.setSource = ({
    id,
    container,
  }: {
    id: string;
    container: string;
  }) => {
    const elem = document.getElementById(container);
    if (!elem) {
      throw new Error(`No container found`);
    }
    const { width, height } = elem.getBoundingClientRect();
    elem.innerHTML = `<iframe src="/player/1.1/${id}" width="${width}px" height="${height}px"/>`;
  };
};
