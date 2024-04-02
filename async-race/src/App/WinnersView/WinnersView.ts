import { ITEM_ON_PAGE_WINNERS, getCar, getWinners } from '../Api/Api';
import View from '../View/view';
import Component from '../utils/base-component';
import { isNull } from '../utils/base-methods';
import './winners.css';
import { WinnerInfo } from '../interface/interface';

export default class WinnersView extends View {
    static countAll: number = 0;

    private static currentPage: number = 1;

    private winnersContent: HTMLDivElement | null;

    private tableContent: HTMLDivElement | null;

    private sortBy: 'id' | 'wins' | 'time';

    private order: 'ASC' | 'DESC';

    constructor() {
        super(['winners-container']);
        this.sortBy = 'id';
        this.order = 'ASC';
        this.winnersContent = new Component('div', '', '', ['winners-content']).getContainer<HTMLDivElement>();
        this.tableContent = new Component('div', '', '', ['winners-table']).getContainer<HTMLDivElement>();
        this.createWinnersPage();
    }

    createWinnersPage() {
        this.createPageControl();
        this.createWinnersTable();
        isNull(this.winnersContent);
        this.container?.append(this.winnersContent);
    }

    createPageControl() {
        const pageControl: HTMLDivElement = new Component('div', '', '', [
            'page-control-container',
        ]).getContainer<HTMLDivElement>();
        const numberPage: HTMLDivElement = new Component('div', '', `Page #${WinnersView.currentPage}`, [
            'number-page',
        ]).getContainer<HTMLDivElement>();
        const pageButtonContainer: HTMLDivElement = new Component('div', '', '', [
            'page-button',
        ]).getContainer<HTMLDivElement>();
        const buttonPrev: HTMLButtonElement = new Component('button', '', 'Prev', [
            'button-prev',
        ]).getContainer<HTMLButtonElement>();
        WinnersView.prevDisabled(buttonPrev);
        buttonPrev.addEventListener('click', () => this.prevPage());
        const buttonNext: HTMLButtonElement = new Component('button', '', 'Next', [
            'button-next',
        ]).getContainer<HTMLButtonElement>();
        WinnersView.nextDisabled(buttonNext);
        buttonNext.addEventListener('click', () => this.nextPage());
        pageButtonContainer.append(buttonPrev, buttonNext);
        pageControl.append(numberPage, pageButtonContainer);
        return pageControl;
    }

    static nextDisabled(button: HTMLButtonElement) {
        const copyButton: HTMLButtonElement = button;
        if (WinnersView.currentPage * ITEM_ON_PAGE_WINNERS < WinnersView.countAll) {
            copyButton.disabled = false;
        } else {
            copyButton.disabled = true;
        }
    }

    static prevDisabled(button: HTMLButtonElement) {
        const copyButton: HTMLButtonElement = button;
        if (WinnersView.currentPage > 1) {
            copyButton.disabled = false;
        } else {
            copyButton.disabled = true;
        }
    }

    nextPage() {
        if (WinnersView.currentPage * ITEM_ON_PAGE_WINNERS < WinnersView.countAll) {
            WinnersView.currentPage += 1;
            this.container?.replaceChildren();
            this.tableContent?.replaceChildren();
            this.winnersContent?.replaceChildren();
            this.createWinnersPage();
        }
    }

    prevPage() {
        if (WinnersView.currentPage > 1) {
            WinnersView.currentPage -= 1;
            this.container?.replaceChildren();
            this.tableContent?.replaceChildren();
            this.winnersContent?.replaceChildren();
            this.createWinnersPage();
        }
    }

    async createWinnersTable() {
        const winnersList: HTMLDivElement = new Component('div', '', '', [
            'winners-list',
        ]).getContainer<HTMLDivElement>();
        const winnersData = await getWinners(WinnersView.currentPage, this.sortBy, this.order);
        const headerTable: HTMLDivElement = this.createTableHeader();
        this.createWinnersList(winnersData.data);
        WinnersView.countAll = winnersData.count;
        const pageTitle: HTMLHeadingElement = new Component('h1', '', `Winners (${WinnersView.countAll})`, [
            'page-title',
        ]).getContainer<HTMLDivElement>();
        const pageControl: HTMLDivElement = this.createPageControl();
        isNull(this.tableContent);
        winnersList.append(headerTable, this.tableContent);
        this.winnersContent?.append(pageTitle, pageControl, winnersList);
    }

    createWinnersList(winners: WinnerInfo[]) {
        winners.forEach((winner) => this.tableContent?.append(WinnersView.createWinnerItem(winner)));
    }

    createTableHeader() {
        const headerItem: HTMLDivElement = new Component('div', '', '', [
            'winner-item-container',
        ]).getContainer<HTMLDivElement>();
        const idField: HTMLDivElement = new Component('div', '', `Id ↑`, [
            'id-item-field',
            'sorting',
        ]).getContainer<HTMLDivElement>();
        const imgField: HTMLDivElement = new Component('div', '', 'Car', [
            'img-item-field',
        ]).getContainer<HTMLDivElement>();
        const nameField: HTMLDivElement = new Component('div', '', `Name`, [
            'name-item-field',
        ]).getContainer<HTMLDivElement>();
        const winsField: HTMLDivElement = new Component('div', '', `Wins`, [
            'wins-item-field',
            'sorting',
        ]).getContainer<HTMLDivElement>();
        const timeField: HTMLDivElement = new Component('div', '', `Time`, [
            'time-item-field',
            'sorting',
        ]).getContainer<HTMLDivElement>();
        idField.addEventListener('click', () => this.sortById(idField, winsField, timeField));
        winsField.addEventListener('click', () => this.sortByWins(idField, winsField, timeField));
        timeField.addEventListener('click', () => this.sortByTime(idField, winsField, timeField));
        headerItem.append(idField, imgField, nameField, winsField, timeField);
        return headerItem;
    }

    async sortById(idField: HTMLDivElement, winsField: HTMLDivElement, timeField: HTMLDivElement) {
        this.sortBy = 'id';
        const copyId: HTMLDivElement = idField;
        const copyWins: HTMLDivElement = winsField;
        const copyTime: HTMLDivElement = timeField;
        if (this.order === 'ASC') {
            this.order = 'DESC';
            copyId.textContent = 'Id ↓';
        } else {
            this.order = 'ASC';
            copyId.textContent = 'Id ↑';
        }
        copyWins.textContent = 'Wins';
        copyTime.textContent = 'Time';
        const winnersData = await getWinners(WinnersView.currentPage, this.sortBy, this.order);
        this.tableContent?.replaceChildren();
        this.createWinnersList(winnersData.data);
    }

    async sortByWins(idField: HTMLDivElement, winsField: HTMLDivElement, timeField: HTMLDivElement) {
        this.sortBy = 'wins';
        const copyId: HTMLDivElement = idField;
        const copyWins: HTMLDivElement = winsField;
        const copyTime: HTMLDivElement = timeField;
        if (this.order === 'ASC') {
            this.order = 'DESC';
            copyWins.textContent = 'Wins ↓';
        } else {
            this.order = 'ASC';
            copyWins.textContent = 'Wins ↑';
        }
        copyId.textContent = 'Id';
        copyTime.textContent = 'Time';
        const winnersData = await getWinners(WinnersView.currentPage, this.sortBy, this.order);
        this.tableContent?.replaceChildren();
        this.createWinnersList(winnersData.data);
    }

    async sortByTime(idField: HTMLDivElement, winsField: HTMLDivElement, timeField: HTMLDivElement) {
        const copyId: HTMLDivElement = idField;
        const copyWins: HTMLDivElement = winsField;
        const copyTime: HTMLDivElement = timeField;
        this.sortBy = 'time';
        if (this.order === 'ASC') {
            this.order = 'DESC';
            copyTime.textContent = 'Time ↓';
        } else {
            this.order = 'ASC';
            copyTime.textContent = 'Time ↑';
        }
        copyId.textContent = 'Id';
        copyWins.textContent = 'Wins';
        const winnersData = await getWinners(WinnersView.currentPage, this.sortBy, this.order);
        this.tableContent?.replaceChildren();
        this.createWinnersList(winnersData.data);
    }

    static createWinnerItem(winner: WinnerInfo) {
        const winnerItem: HTMLDivElement = new Component('div', '', '', [
            'winner-item-container',
        ]).getContainer<HTMLDivElement>();
        getCar(winner.id).then((car) => {
            const idField: HTMLDivElement = new Component('div', '', `${winner.id}`, [
                'id-item-field',
            ]).getContainer<HTMLDivElement>();
            const imgField: HTMLDivElement = new Component('div', '', '', [
                'img-item-field',
            ]).getContainer<HTMLDivElement>();
            const carImg: HTMLDivElement = new Component('div', '', ``, ['win-img']).getContainer<HTMLDivElement>();
            carImg.style.backgroundColor = car.color;
            imgField.append(carImg);
            const nameField: HTMLDivElement = new Component('div', '', `${car.name}`, [
                'name-item-field',
            ]).getContainer<HTMLDivElement>();
            const winsField: HTMLDivElement = new Component('div', '', `${winner.wins}`, [
                'wins-item-field',
            ]).getContainer<HTMLDivElement>();
            const timeField: HTMLDivElement = new Component('div', '', `${winner.time}`, [
                'time-item-field',
            ]).getContainer<HTMLDivElement>();
            winnerItem.append(idField, imgField, nameField, winsField, timeField);
        });
        return winnerItem;
    }
}
