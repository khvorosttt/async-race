import { ITEM_ON_PAGE, createCar, deleteCarFromGarage, deleteCarFromWinners, getCar, getCars, startStopEngine, switchEngineToDrive, updateCar } from '../Api/Api';
import View from '../View/view';
import Component from '../utils/base-component';
import './garage.css';
import { isNull } from '../utils/base-methods';
import { arrayCarsName, randomColor, randomNumber } from './info';

enum ActionWithCars {
    create = 'create',
    update = 'update',
    race = 'race',
    reset = 'reset',
    generate = 'generate cars',
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

export interface engineInfo {
    velocity: number;
    distance: number;
}

const AMOUNT_GENERATES_CARS: number = 100;

export default class GarageView extends View {
    static countAll: number = 0;

    static currentPage: number = 1;

    private carsContent: HTMLDivElement | null;

    private selectedCar: number | null = null;

    constructor() {
        super(['garage-container']);
        this.carsContent = new Component('div', '', '', ['cars-content']).getContainer<HTMLDivElement>();
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
        updateContainer.classList.add('disabled-area');
        createUpdateContainer.append(createContainer, updateContainer);
        const actionWithCarsContainer: HTMLDivElement = this.actionWithCars();
        carsControlContainer.append(createUpdateContainer, actionWithCarsContainer);
        this.container?.append(carsControlContainer);
    }

    createNewCar(name: HTMLInputElement, color: HTMLInputElement) {
        const carName: string | null = name.value;
        const colorName: string = color.value;
        if (carName !== '') {
            isNull(carName);
            const newCar: carInfo = {
                name: carName,
                color: colorName,
            };
            createCar(newCar);
            this.carsContent?.replaceChildren();
            this.createCarList();
            name.value = '';
        }
    }

    updateCar(name: HTMLInputElement, color: HTMLInputElement) {
        const carName: string | null = name.value;
        const colorName: string = color.value;
        if (carName !== '') {
            isNull(carName);
            const car: carInfo = {
                name: carName,
                color: colorName,
                id: this.selectedCar,
            };
            updateCar(car);
            this.carsContent?.replaceChildren();
            this.createCarList();
            name.value = '';
        }
        this.selectedCar = null;
        isNull(this.container);
        const updateContainer: HTMLDivElement | null =
            this.container.querySelector<HTMLDivElement>('.update-car-container');
        isNull(updateContainer);
        updateContainer.classList.add('disabled-area');
        name.value = '';
        color.value = '#000000';
        const previosRemoveSelect: HTMLButtonElement | null = this.container.querySelector('.not-remove');
        if (previosRemoveSelect !== null) {
            previosRemoveSelect.disabled = false;
            previosRemoveSelect.classList.remove('not-remove');
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
        } else if ((action = ActionWithCars.update)) {
            carButton.addEventListener('click', () => this.updateCar(carNameInput, carColorInput));
        }
        carContainer.append(carNameInput, carColorInput, carButton);
        return carContainer;
    }

    actionWithCars() {
        const container: HTMLDivElement = new Component('div', '', '', [
            'action-with-cars-container',
        ]).getContainer<HTMLDivElement>();
        const raceButton: HTMLButtonElement = new Component('button', '', `${ActionWithCars.race.toUpperCase()}`, [
            'race-button',
        ]).getContainer<HTMLButtonElement>();
        const resetButton: HTMLButtonElement = new Component('button', '', `${ActionWithCars.reset.toUpperCase()}`, [
            'reset-button',
        ]).getContainer<HTMLButtonElement>();
        const generateButton: HTMLButtonElement = new Component(
            'button',
            '',
            `${ActionWithCars.generate.toUpperCase()}`,
            ['generate-button']
        ).getContainer<HTMLButtonElement>();
        generateButton.addEventListener('click', () => this.generateCars());
        container.append(raceButton, resetButton, generateButton);
        return container;
    }

    createCarItem(item: carInfo) {
        const itemContainer: HTMLDivElement = new Component('div', '', '', [
            'item-container',
        ]).getContainer<HTMLDivElement>();
        isNull(item.id);
        itemContainer.id = item.id.toString();
        const selectRemoveContainer: HTMLDivElement = new Component('div', '', '', [
            'select-remove-container',
        ]).getContainer<HTMLDivElement>();
        const selectButton: HTMLButtonElement = new Component('button', '', `${changeCar.select.toUpperCase()}`, [
            'select-button',
        ]).getContainer<HTMLButtonElement>();
        selectButton.setAttribute('data-carId', item.id.toString());
        const removeButton: HTMLButtonElement = new Component('button', '', `${changeCar.remove.toUpperCase()}`, [
            'remove-button',
        ]).getContainer<HTMLButtonElement>();
        removeButton.setAttribute('data-carId', item.id.toString());
        if (this.selectedCar === item.id) {
            removeButton.disabled = true;
        }
        selectButton.addEventListener('click', (event: Event) => this.selectCar(event, removeButton));
        removeButton.addEventListener('click', (event: Event) => this.removeCar(event), { once: true });
        const nameCar: HTMLDivElement = new Component('div', '', `${item.name}`, [
            'name-car',
        ]).getContainer<HTMLDivElement>();
        selectRemoveContainer.append(selectButton, removeButton, nameCar);
        const carControl: HTMLDivElement = new Component('div', '', '', ['car-control']).getContainer<HTMLDivElement>();
        const carImg: HTMLDivElement = new Component('div', '', ``, ['car-img']).getContainer<HTMLDivElement>();
        carImg.style.backgroundColor = item.color;
        const startStopContainer: HTMLDivElement = new Component('div', '', '', [
            'start-stop-container',
        ]).getContainer<HTMLDivElement>();
        const startButton: HTMLButtonElement = new Component('button', '', `A`, [
            'start-button',
        ]).getContainer<HTMLButtonElement>();
        startButton.addEventListener('click', () => this.startDrive(carControl));
        startButton.setAttribute('data-carId', item.id.toString());
        const stopButton: HTMLButtonElement = new Component('button', '', `B`, [
            'stop-button',
        ]).getContainer<HTMLButtonElement>();
        stopButton.disabled = true;
        stopButton.setAttribute('data-carId', item.id.toString());
        startStopContainer.append(startButton, stopButton);
        const flag: HTMLDivElement = new Component('div', '', '', [
            'win-flag',
        ]).getContainer<HTMLDivElement>();
        carControl.append(startStopContainer, carImg, flag);
        itemContainer.append(selectRemoveContainer, carControl);
        return itemContainer;
    }

    selectCar(event: Event, removeButton: HTMLButtonElement) {
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        this.selectedCar = Number(currentElem.getAttribute('data-carId'));
        isNull(this.container);
        const previosRemoveSelect: HTMLButtonElement | null = this.container.querySelector('.not-remove');
        if (previosRemoveSelect !== null) {
            previosRemoveSelect.disabled = false;
            previosRemoveSelect.classList.remove('not-remove');
        }
        removeButton.classList.add('not-remove');
        removeButton.disabled = true;
        const updateContainer: HTMLDivElement | null =
            this.container.querySelector<HTMLDivElement>('.update-car-container');
        isNull(updateContainer);
        updateContainer.classList.remove('disabled-area');
        const colorContainer: HTMLInputElement | null =
            updateContainer.querySelector<HTMLInputElement>('.update-car-color');
        const nameContainer: HTMLInputElement | null =
            updateContainer.querySelector<HTMLInputElement>('.update-car-name');
        isNull(colorContainer);
        isNull(nameContainer);
        const carFromServer: Promise<carInfo> = getCar(this.selectedCar);
        carFromServer.then((car) => {
            colorContainer.value = car.color;
            nameContainer.value = car.name;
        });
    }

    async removeCar(event: Event) {
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        this.selectedCar = Number(currentElem.getAttribute('data-carId'));
        await deleteCarFromGarage(this.selectedCar);
        await deleteCarFromWinners(this.selectedCar);
        this.carsContent?.replaceChildren();
        this.createCarList();
    }

    async createCarList() {
        const carsList: HTMLDivElement = new Component('div', '', '', ['cars-list']).getContainer<HTMLDivElement>();
        const carsData = getCars(GarageView.currentPage);
        (await (await carsData).data).forEach((car) => carsList.append(this.createCarItem(car)));
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
        if (GarageView.currentPage * ITEM_ON_PAGE < GarageView.countAll) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    prevDisabled(button: HTMLButtonElement) {
        if (GarageView.currentPage > 1) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }

    nextPage() {
        if (GarageView.currentPage * ITEM_ON_PAGE < GarageView.countAll) {
            GarageView.currentPage += 1;
            this.carsContent?.replaceChildren();
            this.createCarList();
        }
    }

    prevPage() {
        if (GarageView.currentPage > 1) {
            GarageView.currentPage -= 1;
            this.carsContent?.replaceChildren();
            this.createCarList();
        }
    }

    generateCars() {
        for (let i = 0; i < AMOUNT_GENERATES_CARS; i++) {
            const newCar: carInfo = {
                name: arrayCarsName[randomNumber(0, arrayCarsName.length)],
                color: randomColor(),
            };
            createCar(newCar);
        }
        this.carsContent?.replaceChildren();
        this.createCarList();
    }

    async startDrive(carControl: HTMLDivElement) {
        const startButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.start-button');
        isNull(startButton);
        startButton.disabled = true;
        const stopButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.stop-button');
        isNull(stopButton);
        stopButton.disabled = false;
        const id: number = Number(startButton.getAttribute('data-carId'));
        let requestAnimateId: number;        
        const engineInfo: engineInfo = await startStopEngine(id, 'started');
        const car: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.car-img');
        isNull(car);
        const flag: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.win-flag');
        isNull(flag);
        const time: number = engineInfo.distance / engineInfo.velocity;
        stopButton.addEventListener('click', () => {
            this.stopDrive(requestAnimateId, carControl);
        });
        requestAnimateId = requestAnimationFrame(function draw() {
            const carPositionString: string = car.style.left;
            const carPosition: number = Number(carPositionString.slice(0, carPositionString.length - 2));
            const distance: number = Number(carPosition) + engineInfo.velocity * 0.05;
            car.style.left = distance + 'px';
            if (carPosition < flag.offsetLeft) {
                requestAnimateId = requestAnimationFrame(draw);
            }
        });
        const driveStatus: boolean = await switchEngineToDrive(id, 'drive');
        if (driveStatus) cancelAnimationFrame(requestAnimateId);
    }

    stopDrive(requestAnimateId: number, carControl: HTMLDivElement) {
        cancelAnimationFrame(requestAnimateId);
        const startButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.start-button');
        isNull(startButton);
        const stopButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.stop-button');
        isNull(stopButton);
        const car: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.car-img');
        isNull(car);
        const id: number = Number(startButton.getAttribute('data-carId'));
        startStopEngine(id, 'stopped')
        .then(() => {
            startButton.disabled = false;
            stopButton.disabled = true;
            car.style.left = '';
        });
    }
}
