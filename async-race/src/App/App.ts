import Router, { PageInfo } from './Router/Router';
import HeaderView from './View/Header/header-view';
import Component from './utils/base-component';
import { isNull } from './utils/base-methods';
import './app.css';
import './normalize.css';
import GarageView from './GarageView/GarageView';
import View from './View/view';

export default class App {
    container: HTMLElement;

    router: Router;

    header: HeaderView;

    contentContainer: HTMLDivElement;

    constructor() {
        this.container = document.body;
        const pages: PageInfo[] = this.initPages();
        this.router = new Router(pages);
        this.header = new HeaderView(this.router);
        this.contentContainer = new Component('div', '', '', ['content-container']).getContainer<HTMLDivElement>();
        const headerContainer: HTMLDivElement | null = this.header.getContainer();
        isNull(headerContainer);
        this.container.append(headerContainer, this.contentContainer);
        this.createView();
    }

    createView() {
        this.router.navigate('garage');
    }
    createContainer() {}

    initPages() {
        const pages: PageInfo[] = [
            {
                pagePath: 'garage',
                callback: () => {
                    const garage: View = new GarageView();
                    this.setView(garage);
                },
            },
            {
                pagePath: 'winners',
                callback: () => {},
            },
        ];
        return pages;
    }

    setView(view: View) {
        const viewContainer: HTMLDivElement | null = view.getContainer();
        isNull(viewContainer);
        this.contentContainer.replaceChildren();
        this.contentContainer.append(viewContainer);
    }
}
