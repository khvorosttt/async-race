import { getCars } from '../../Api/Api';
import Router from '../../Router/Router';
import Component from '../../utils/base-component';
import View from '../view';
import './header.css';

enum BUTTONNAME {
    GARAGE = 'Garage',
    WINNERS = 'Winners',
}

export default class HeaderView extends View {
    constructor(router: Router) {
        super(['header']);
        this.createHeader(router);
    }

    createHeader(router: Router) {
        const buttonGarage: HTMLButtonElement = new Component('button', 'btn-garage', BUTTONNAME.GARAGE, [
            'header-button',
            'btn-garage',
        ]).getContainer<HTMLButtonElement>();
        buttonGarage.addEventListener('click', () => HeaderView.garageButton(router));
        const buttonWinners: HTMLButtonElement = new Component('button', 'btn-winners', BUTTONNAME.WINNERS, [
            'header-button',
            'btn-winners',
        ]).getContainer<HTMLButtonElement>();
        buttonWinners.addEventListener('click', () => HeaderView.winnersButton(router));
        this.container?.append(buttonGarage, buttonWinners);
    }

    static garageButton(router: Router) {
        router.navigate(BUTTONNAME.GARAGE.toLocaleLowerCase());
    }

    static winnersButton(router: Router) {
        router.navigate(BUTTONNAME.WINNERS.toLocaleLowerCase());
    }
}
