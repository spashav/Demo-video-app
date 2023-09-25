type Page = { time: number; isFirst: boolean };
const pages: Page[] = [];

export const pageLib = {
  getCurrent: () => pages[pages.length - 1],
  startFirstPage: (): Page => {
    return pages.length ? pages[0] : pageLib.startPage();
  },
  startPage: (): Page => {
    const page: Page = {
      time: performance.now(),
      isFirst: pages.length === 0,
    };
    pages.push(page);

    return page;
  },
};
