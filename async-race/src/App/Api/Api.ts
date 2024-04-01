import { carInfo } from '../GarageView/GarageView';
import { winnerInfo } from '../WinnersView/WinnersView';

const baseURL = 'http://127.0.0.1:3000';

enum path {
    GARAGE = '/garage',
    WINNERS = '/winners',
    ENGINE = '/engine',
}

export const ITEM_ON_PAGE_GARAGE: number = 7;

export const ITEM_ON_PAGE_WINNERS: number = 10;

export const getCars = async (page: number) => {
    const response: Response = await fetch(`${baseURL}${path.GARAGE}?_page=${page}&_limit=${ITEM_ON_PAGE_GARAGE}`);
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
        return Promise.reject(
            new Error(`Removing the car failed. Perhaps there is no car with this id in the garage.
            Status error: ${response.status}`)
        );
    }
};

export const deleteCarFromWinners = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${path.WINNERS}/${id}`, { method: 'DELETE' });
    if (response.ok) {
        return response.json();
    }
};

export const startStopEngine = async (id: number, status: 'started' | 'stopped') => {
    const response: Response = await fetch(`${baseURL}${path.ENGINE}?id=${id}&status=${status}`, { method: 'PATCH' });
    if (response.ok) {
        return await response.json();
    } else {
        return Promise.reject(new Error(`Method startEngine not work. Status error: ${response.status}`));
    }
};

export const switchEngineToDrive = async (id: number, status: 'drive', signal: AbortSignal) => {
    try {
        const response: Response = await fetch(`${baseURL}${path.ENGINE}?id=${id}&status=${status}`, {
            method: 'PATCH',
            signal: signal,
        });
        if (response.ok) {
            return Promise.resolve(JSON.stringify(await getCar(id)));
        } else if (response.status === 500) {
            return Promise.reject(response.status);
        }
        return Promise.reject(true);
    } catch (error) {
        return Promise.reject(true);
    }
};

export const getWinners = async (_page: number, _sort: 'id' | 'wins' | 'time', _order: 'ASC' | 'DESC') => {
    const response: Response = await fetch(
        `${baseURL}${path.WINNERS}?_page=${_page}&_limit=${ITEM_ON_PAGE_WINNERS}&_sort=${_sort}&_order=${_order}`
    );
    if (response.ok) {
        const data: winnerInfo[] = await response.json();
        const totalCount: number = Number(response.headers.get('X-Total-Count'));
        return {
            data: data,
            count: totalCount,
        };
    } else {
        return Promise.reject(new Error(`Method getWinners not work. Status error: ${response.status}`));
    }
};

export const getWinner = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${path.WINNERS}/${id}`);
    if (response.ok) {
        return await response.json();
    } else if (response.status === 404) {
        return {};
    }
};

const POSTWinnerOptions = (winner: winnerInfo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    };
};

export const createWinner = async (winner: winnerInfo) => {
    return await fetch(`${baseURL}${path.WINNERS}`, POSTWinnerOptions(winner));
};

const PUTWinnerOptions = (winner: winnerInfo) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    };
};

export const updateWinner = async (winner: winnerInfo) => {
    const response: Response = await fetch(`${baseURL}${path.WINNERS}/${winner.id}`, PUTWinnerOptions(winner));
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(new Error(`Winner is not update. Status error: ${response.status}`));
    }
};
