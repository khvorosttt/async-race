import { ITEM_ON_PAGE, createCar, getCars } from "../Api/Api";
import View from "../View/view";
import Component from "../utils/base-component";
import './garage.css';
import sprite from '../../svg/sprite.svg';
import { isNull } from "../utils/base-methods";

enum ActionWithCars {
    create = 'create',
    update = 'update',
    race = 'race',
    reset = 'reset',
    generate = 'generate cars'
}

enum changeCar {
    select = 'select',
    remove = 'remove',
}

export interface carInfo {
    name: string;
    color: string;
    id?: number | null;
}

export default class GarageView extends View {
    static countAll: number = 100;

    static currentPage: number = 1;

    private carsContent: HTMLDivElement | null;

    constructor() {
        super(['garage-container']);
        this.carsContent = new Component('div', '', '' , ['cars-content']).getContainer<HTMLDivElement>();
        this.createCarsControl();
        this.container?.append(this.carsContent);
        this.createCarList();
    }

    createCarsControl() {
        const carsControlContainer: HTMLDivElement = new Component('div', '', '', [
            'cars-control-container',
        ]).getContainer<HTMLDivElement>();
        const createUpdateContainer: HTMLDivElement = new Component('div', '', '', [
            'create-update-container',
        ]).getContainer<HTMLDivElement>();
        const createContainer: HTMLDivElement = this.actionCar(ActionWithCars.create);
        const updateContainer: HTMLDivElement = this.actionCar(ActionWithCars.update);
        createUpdateContainer.append(createContainer, updateContainer);
        const actionWithCarsContainer: HTMLDivElement = GarageView.actionWithCars();
        carsControlContainer.append(createUpdateContainer, actionWithCarsContainer);
        this.container?.append(carsControlContainer);
    }

    createNewCar(name: HTMLInputElement, color: HTMLInputElement) {
        const carName: string | null = name.value;
        const colorName: string = color.value;
        if(carName !== '') {
            isNull(carName);
            const newCar: carInfo = {
                name: carName, color: colorName
            };
            createCar(newCar);
            this.carsContent?.replaceChildren();
            this.createCarList();
            name.value = '';
        }
    }

    actionCar(action: string) {
        const carContainer: HTMLDivElement = new Component('div', '', '', [
            `${action}-car-container`,
        ]).getContainer<HTMLDivElement>();
        const carNameInput: HTMLInputElement = new Component('input', '', '', [
            `${action}-car-name`,
        ]).getContainer<HTMLInputElement>();
        const carColorInput: HTMLInputElement = new Component('input', '', '', [
            `${action}-car-color`,
        ]).getContainer<HTMLInputElement>();
        carColorInput.type = 'color';
        const carButton: HTMLButtonElement = new Component('button', '', `${action.toUpperCase()}`, [
            `${action}-car-button`,
        ]).getContainer<HTMLButtonElement>();
        if (action === ActionWithCars.create) {
            carButton.addEventListener('click', () => this.createNewCar(carNameInput, carColorInput));
        }
        carContainer.append(carNameInput, carColorInput, carButton);
        return carContainer;
    }

    static actionWithCars() {
        const container: HTMLDivElement = new Component('div', '', '', [
            'action-with-cars-container',
        ]).getContainer<HTMLDivElement>();
        const raceButton: HTMLButtonElement = new Component('button', '', `${ActionWithCars.race.toUpperCase()}`, [
            'race-button',
        ]).getContainer<HTMLButtonElement>();
        const resetButton: HTMLButtonElement = new Component('button', '', `${ActionWithCars.reset.toUpperCase()}`, [
            'reset-button',
        ]).getContainer<HTMLButtonElement>();
        const generateButton: HTMLButtonElement = new Component('button', '', `${ActionWithCars.generate.toUpperCase()}`, [
            'generate-button',
        ]).getContainer<HTMLButtonElement>();
        container.append(raceButton, resetButton, generateButton);
        return container;
    }

    static createCarItem(item: carInfo) {
        const itemContainer: HTMLDivElement = new Component('div', '', '', [
            'item-container',
        ]).getContainer<HTMLDivElement>();
        const selectRemoveContainer: HTMLDivElement = new Component('div', '', '', [
            'select-remove-container',
        ]).getContainer<HTMLDivElement>();
        const selectButton : HTMLButtonElement = new Component('button', '', `${changeCar.select.toUpperCase()}`, [
            'select-button',
        ]).getContainer<HTMLButtonElement>();
        const removeButton : HTMLButtonElement = new Component('button', '', `${changeCar.remove.toUpperCase()}`, [
            'remove-button',
        ]).getContainer<HTMLButtonElement>();
        const nameCar: HTMLDivElement = new Component('div', '', `${item.name}`, [
            'name-car',
        ]).getContainer<HTMLDivElement>();
        selectRemoveContainer.append(selectButton, removeButton, nameCar);
        const carControl: HTMLDivElement = new Component('div', '', '', ['car-control']).getContainer<HTMLDivElement>();
        const carImg: HTMLDivElement = new Component('div', '', ``, [
            'car-img',
        ]).getContainer<HTMLDivElement>();
        carImg.style.backgroundColor = item.color;
        const startStopContainer: HTMLDivElement = new Component('div', '', '', [
            'start-stop-container',
        ]).getContainer<HTMLDivElement>();
        const startButton: HTMLButtonElement = new Component('button', '', `A`, [
            'start-button',
        ]).getContainer<HTMLButtonElement>();
        const stopButton: HTMLButtonElement = new Component('button', '', `B`, [
            'stop-button',
        ]).getContainer<HTMLButtonElement>();
        startStopContainer.append(startButton, stopButton);
        carControl.append(startStopContainer, carImg);
        itemContainer.append(selectRemoveContainer, carControl);
        return itemContainer;
    }

    async createCarList() {
        const carsList: HTMLDivElement = new Component('div', '', '', [
            'cars-list',
        ]).getContainer<HTMLDivElement>();
        const carsData = getCars(GarageView.currentPage);
        (await (await carsData).data).forEach((car) => carsList.append(GarageView.createCarItem(car)));
        GarageView.countAll = (await carsData).count;
        const pageTitle: HTMLHeadingElement = new Component('h1', '', `Garage (${GarageView.countAll})`, [
            'page-title',
        ]).getContainer<HTMLDivElement>();
        const pageControl: HTMLDivElement = this.createPageControl();
        
        this.carsContent?.append(pageTitle, pageControl, carsList);
    }

    createPageControl() {
        const pageControl: HTMLDivElement = new Component('div', '', '', [
            'page-control-container',
        ]).getContainer<HTMLDivElement>();
        const numberPage: HTMLDivElement = new Component('div', '', `Page #${GarageView.currentPage}`, [
            'number-page',
        ]).getContainer<HTMLDivElement>();
        const pageButtonContainer: HTMLDivElement = new Component('div', '', '', [
            'page-button',
        ]).getContainer<HTMLDivElement>();
        const buttonPrev: HTMLButtonElement = new Component('button', '', 'Prev', [
            'button-prev',
        ]).getContainer<HTMLButtonElement>();
        this.prevDisabled(buttonPrev);
        buttonPrev.addEventListener('click', () => this.prevPage());
        const buttonNext: HTMLButtonElement = new Component('button', '', 'Next', [
            'button-next',
        ]).getContainer<HTMLButtonElement>();
        this.nextDisabled(buttonNext);
        buttonNext.addEventListener('click', () => this.nextPage());
        pageButtonContainer.append(buttonPrev, buttonNext);
        pageControl.append(numberPage, pageButtonContainer);
        return pageControl;
    }

    nextDisabled(button: HTMLButtonElement) {
        if((GarageView.currentPage) * ITEM_ON_PAGE < GarageView.countAll) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    prevDisabled(button: HTMLButtonElement) {
        if(GarageView.currentPage > 1) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    nextPage() {
        console.log('yyyyyyyyyyyyyyyy');
        if((GarageView.currentPage) * ITEM_ON_PAGE < GarageView.countAll) {
            GarageView.currentPage += 1;
            this.carsContent?.replaceChildren();
            this.createCarList();
            console.log('hvnhgfcdxfgh');
        }
    }

    prevPage() {
        console.log('yyyyyyyyyyyyyyyy');
        if(GarageView.currentPage > 1) {
            GarageView.currentPage -= 1;
            this.carsContent?.replaceChildren();
            this.createCarList();
            console.log('hvnhgfcdxfgh');
        }
    }

}