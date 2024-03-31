import {
    ITEM_ON_PAGE_GARAGE,
    createCar,
    createWinner,
    deleteCarFromGarage,
    deleteCarFromWinners,
    getCar,
    getCars,
    getWinner,
    startStopEngine,
    switchEngineToDrive,
    updateCar,
    updateWinner,
} from '../Api/Api';
import View from '../View/view';
import Component from '../utils/base-component';
import './garage.css';
import { isNull } from '../utils/base-methods';
import { arrayCarsName, randomColor, randomNumber } from './info';
import { winnerInfo } from '../WinnersView/WinnersView';

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

    private stopRaceStatus: boolean = false;

    private raceController: AbortController;

    private runningCars: number = 0;

    private winContainer: HTMLDivElement | null;

    constructor() {
        super(['garage-container']);
        this.raceController = new AbortController();
        this.winContainer = null;
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
        resetButton.disabled = true;
        raceButton.addEventListener('click', (event: Event) => this.startRace(event, resetButton));
        resetButton.addEventListener('click', (event: Event) => this.stopRace(event, raceButton));
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
        carControl.setAttribute('data-carId', item.id.toString());
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
        const flag: HTMLDivElement = new Component('div', '', '', ['win-flag']).getContainer<HTMLDivElement>();
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
        this.runningCars = 0;
        isNull(this.container);
        const raceButton: HTMLButtonElement | null = this.container.querySelector<HTMLButtonElement>('.race-button');
        isNull(raceButton);
        raceButton.disabled = false;
        this.winContainer = new Component('div', '', '', ['win-container']).getContainer<HTMLDivElement>();
        this.carsContent?.append(this.winContainer);
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
        if (GarageView.currentPage * ITEM_ON_PAGE_GARAGE < GarageView.countAll) {
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
        if (GarageView.currentPage * ITEM_ON_PAGE_GARAGE < GarageView.countAll) {
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
        this.runningCars += 1;
        isNull(this.container);
        const raceButton: HTMLButtonElement | null = this.container.querySelector<HTMLButtonElement>('.race-button');
        isNull(raceButton);
        raceButton.disabled = true;
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
        car.classList.remove('broken');
        const flag: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.win-flag');
        isNull(flag);
        const time: number = engineInfo.distance / engineInfo.velocity;
        const signalStop: AbortController = new AbortController();
        stopButton.addEventListener('click', () => {
            this.stopDrive(requestAnimateId, carControl, signalStop);
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

        const driveStatus: Promise<string | boolean> = switchEngineToDrive(id, 'drive', signalStop.signal);
        driveStatus
            .then((status) => {
                if (status) cancelAnimationFrame(requestAnimateId);
            })
            .catch((error) => console.log('Car is stopped: ' + error));
    }

    stopDrive(requestAnimateId: number, carControl: HTMLDivElement, signalStop: AbortController) {
        this.runningCars -= 1;
        if (this.runningCars === 0) {
            isNull(this.container);
            const raceButton: HTMLButtonElement | null =
                this.container.querySelector<HTMLButtonElement>('.race-button');
            isNull(raceButton);
            raceButton.disabled = false;
        }
        cancelAnimationFrame(requestAnimateId);
        signalStop.abort();
        const startButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.start-button');
        isNull(startButton);
        const stopButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.stop-button');
        isNull(stopButton);
        const car: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.car-img');
        isNull(car);
        const id: number = Number(startButton.getAttribute('data-carId'));
        startStopEngine(id, 'stopped').then(() => {
            startButton.disabled = false;
            stopButton.disabled = true;
            car.style.left = '';
        });
    }

    async startRace(event: Event, resetButton: HTMLButtonElement) {
        this.raceController = new AbortController();
        this.stopRaceStatus = false;
        const currentButton: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
        isNull(currentButton);
        currentButton.disabled = true;
        resetButton.disabled = false;
        isNull(this.carsContent);
        const carsControls: HTMLDivElement[] = [...this.carsContent.querySelectorAll<HTMLDivElement>('.car-control')];
        Promise.allSettled(
            carsControls.map((carControl) => {
                this.runningCars += 1;
                const id: number = Number(carControl.getAttribute('data-carId'));
                const startButton: HTMLButtonElement | null =
                    carControl.querySelector<HTMLButtonElement>('.start-button');
                isNull(startButton);
                startButton.disabled = true;
                return Promise.resolve(startStopEngine(id, 'started'));
            })
        )
            .then((res) => {
                return Promise.any(
                    res.map((engine, index) => {
                        if (engine.status === 'fulfilled') {
                            const id: number = Number(carsControls[index].getAttribute('data-carId'));
                            const car: HTMLDivElement | null =
                                carsControls[index].querySelector<HTMLDivElement>('.car-img');
                            isNull(car);
                            car.classList.remove('broken');
                            const flag: HTMLDivElement | null =
                                carsControls[index].querySelector<HTMLDivElement>('.win-flag');
                            isNull(flag);
                            const currentEngine: engineInfo = engine.value;
                            const time: number = currentEngine.distance / currentEngine.velocity;
                            const velocity: number = (flag.offsetLeft - car.offsetLeft) / (time / 30);
                            const draw = () => {
                                const carPositionString: string = car.style.left;
                                const carPosition: number = Number(
                                    carPositionString.slice(0, carPositionString.length - 2)
                                );
                                const distance: number = Number(carPosition) + velocity;
                                car.style.left = distance + 'px';
                                if (
                                    carPosition < flag.offsetLeft &&
                                    !this.stopRaceStatus &&
                                    !car.classList.contains('broken')
                                ) {
                                    requestAnimationFrame(draw);
                                }
                            };
                            requestAnimationFrame(draw);
                            return switchEngineToDrive(id, 'drive', this.raceController.signal)
                                .then((data) => {
                                    const currentCar: carInfo = JSON.parse(data);
                                    return Promise.resolve({
                                        name: currentCar.name,
                                        id: currentCar.id,
                                        time: Number((engine.value.distance / engine.value.velocity / 1000).toFixed(2)),
                                    });
                                })
                                .catch((status) => {
                                    if (status === 500) {
                                        car.classList.add('broken');
                                    }
                                    return Promise.reject('car broken');
                                })
                                .finally(() => {
                                    startStopEngine(id, 'stopped');
                                });
                        } else {
                            return Promise.reject('car broken');
                        }
                    })
                );
            })
            .then((winner) => {
                isNull(this.winContainer);
                this.winContainer.classList.add('show');
                isNull(winner.id);
                this.winContainer.textContent = winner.name + ' won!';
                getWinner(winner.id).then((w) => {
                    isNull(winner.id);
                    if (!Object.keys(w).length) {
                        createWinner({
                            id: winner.id,
                            wins: 1,
                            time: winner.time,
                        });
                    } else {
                        updateWinner({
                            id: w.id,
                            wins: w.wins + 1,
                            time: w.time > winner.time ? winner.time : w.time,
                        })
                    }
                });
            })
            .catch((error) => console.log('Reset race! ' + error));
    }

    stopRace(event: Event, raceButton: HTMLButtonElement) {
        const currentButton: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
        isNull(this.winContainer);
        this.winContainer.classList.remove('show');
        isNull(currentButton);
        currentButton.disabled = true;
        this.stopRaceStatus = true;
        isNull(this.carsContent);
        const carsControls: HTMLDivElement[] = [...this.carsContent.querySelectorAll<HTMLDivElement>('.car-control')];
        this.raceController.abort();
        carsControls.map(async (carControl) => {
            const id: number = Number(carControl.getAttribute('data-carId'));
            await startStopEngine(id, 'stopped');
            const car: HTMLDivElement | null = carControl.querySelector<HTMLDivElement>('.car-img');
            isNull(car);
            car.style.left = '';
            const startButton: HTMLButtonElement | null = carControl.querySelector<HTMLButtonElement>('.start-button');
            isNull(startButton);
            startButton.disabled = false;
            car.classList.remove('broken');
            this.runningCars -= 1;
            if (this.runningCars === 0) raceButton.disabled = false;
        });
    }
}
