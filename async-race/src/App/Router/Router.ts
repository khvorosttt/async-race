export interface PageInfo {
    pagePath: string;
    callback: () => void;
}

export default class Router {
    pages: PageInfo[];
    constructor(pages: PageInfo[]) {
        this.pages = pages;
    }

    navigate(path: string) {
        const pageInfo: PageInfo | undefined = this.pages.find((item) => item.pagePath === path);
        if (pageInfo) {
            pageInfo.callback();
            return;
        }
    }
}
