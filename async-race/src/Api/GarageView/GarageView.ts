import View from "../../App/View/view";
import Component from "../../App/utils/base-component";
import './garage.css';

enum ActionWithCars {
    create = 'create',
    update = 'update',
    race = 'race',
    reset = 'reset',
    generate = 'generate cars'
}

export default class GarageView extends View {
    constructor() {
        super(['garage-container']);
        this.createCarsControl();
    }

    createCarsControl() {
        const carsControlContainer: HTMLDivElement = new Component('div', '', '', [
            'cars-control-container',
        ]).getContainer<HTMLDivElement>();
        const createUpdateContainer: HTMLDivElement = new Component('div', '', '', [
            'create-update-container',
        ]).getContainer<HTMLDivElement>();
        const createContainer: HTMLDivElement = GarageView.actionCar(ActionWithCars.create);
        const updateContainer: HTMLDivElement = GarageView.actionCar(ActionWithCars.update);
        createUpdateContainer.append(createContainer, updateContainer);
        const actionWithCarsContainer: HTMLDivElement = GarageView.actionWithCars();
        carsControlContainer.append(createUpdateContainer, actionWithCarsContainer);
        this.container?.append(carsControlContainer);
    }

    static actionCar(action: string) {
        const carContainer: HTMLDivElement = new Component('div', '', '', [
            `${action}-car-container`,
        ]).getContainer<HTMLDivElement>();
        const carNameInput: HTMLInputElement = new Component('input', '', '', [
            `${action}-car-name`,
        ]).getContainer<HTMLInputElement>();
        const carColorInput: HTMLInputElement = new Component('input', '', '', [
            `${action}create-car-color`,
        ]).getContainer<HTMLInputElement>();
        carColorInput.type = 'color';
        const carButton: HTMLButtonElement = new Component('button', '', `${action.toUpperCase()}`, [
            `${action}-car-button`,
        ]).getContainer<HTMLButtonElement>();
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

    createCarItem() {
        const itemContainer: HTMLDivElement = new Component('div', '', '', [
            'item-container',
        ]).getContainer<HTMLDivElement>();
        const selectRemoveContainer: HTMLDivElement = new Component('div', '', '', [
            'select-remove-container',
        ]).getContainer<HTMLDivElement>();

    }
}