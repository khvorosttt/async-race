import { carInfo } from '../GarageView/GarageView';

const baseURL = 'http://127.0.0.1:3000';

enum path {
    GARAGE = '/garage',
    WINNERS = '/winners',
    ENGINE = '/engine'
}

export const ITEM_ON_PAGE: number = 7;

export const getCars = async (page: number) => {
    const response: Response = await fetch(`${baseURL}${path.GARAGE}?_page=${page}&_limit=${ITEM_ON_PAGE}`);
    if (response.ok) {
        const data: Promise<carInfo[]> = await response.json();
        const totalCount: number = Number(response.headers.get('X-Total-Count'));
        return {
            data: data,
            count: totalCount,
        };
    } else {
        return Promise.reject(new Error(`Method getCars not work. Status error: ${response.status}`));
    }
};

export const getCar = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${path.GARAGE}/${id}`);
    if (response.ok) {
        return await response.json();
    } else {
        return Promise.reject(new Error(`Method getCar not work. Status error: ${response.status}`));
    }
};

const POSTOptions = (car: carInfo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    };
};

export const createCar = async (car: carInfo) => {
    return await fetch(`${baseURL}${path.GARAGE}`, POSTOptions(car));
};

const PUTOptions = (car: carInfo) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    };
};

export const updateCar = async (car: carInfo) => {
    const response: Response = await fetch(`${baseURL}${path.GARAGE}/${car.id}`, PUTOptions(car));
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(new Error(`Car is not update. Status error: ${response.status}`));
    }
};

export const deleteCarFromGarage = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${path.GARAGE}/${id}`, { method: 'DELETE' });
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(new Error(`Removing the car failed. Perhaps there is no car with this id in the garage.
            Status error: ${response.status}`));
    }
}

export const deleteCarFromWinners = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${path.WINNERS}/${id}`, { method: 'DELETE' });
    if (response.ok) {
        return response.json();
    }
}

export const startStopEngine = async(id: number, status: 'started' | 'stopped') => {
    const response: Response = await fetch(`${baseURL}${path.ENGINE}?id=${id}&status=${status}`, { method: 'PATCH' });
    if (response.ok) {
        return await response.json();
    } else {
        return Promise.reject(new Error(`Method startEngine not work. Status error: ${response.status}`));
    }
}

export const switchEngineToDrive = async(id: number, status: 'drive') => {
    const response: Response = await fetch(`${baseURL}${path.ENGINE}?id=${id}&status=${status}`, { method: 'PATCH' });
    if (response.ok) {
        return false;
    } else if (response.status === 500){
        return true;
    }
    return false;
}