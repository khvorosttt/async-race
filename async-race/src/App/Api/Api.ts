import { CarInfo, WinnerInfo } from '../interface/interface';

const baseURL = 'http://127.0.0.1:3000';

enum Path {
    GARAGE = '/garage',
    WINNERS = '/winners',
    ENGINE = '/engine',
}

export const ITEM_ON_PAGE_GARAGE: number = 7;

export const ITEM_ON_PAGE_WINNERS: number = 10;

export const getCars = async (page: number) => {
    const response: Response = await fetch(`${baseURL}${Path.GARAGE}?_page=${page}&_limit=${ITEM_ON_PAGE_GARAGE}`);
    if (response.ok) {
        const data: Promise<CarInfo[]> = await response.json();
        const totalCount: number = Number(response.headers.get('X-Total-Count'));
        return {
            data,
            count: totalCount,
        };
    }
    return Promise.reject(new Error(`Method getCars not work. Status error: ${response.status}`));
};

export const getCar = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${Path.GARAGE}/${id}`);
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(new Error(`Method getCar not work. Status error: ${response.status}`));
};

const POSTOptions = (car: CarInfo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    };
};

export const createCar = async (car: CarInfo) => {
    return fetch(`${baseURL}${Path.GARAGE}`, POSTOptions(car));
};

const PUTOptions = (car: CarInfo) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    };
};

export const updateCar = async (car: CarInfo) => {
    const response: Response = await fetch(`${baseURL}${Path.GARAGE}/${car.id}`, PUTOptions(car));
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(new Error(`Car is not update. Status error: ${response.status}`));
};

export const deleteCarFromGarage = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${Path.GARAGE}/${id}`, { method: 'DELETE' });
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(
        new Error(`Removing the car failed. Perhaps there is no car with this id in the garage.
            Status error: ${response.status}`)
    );
};

export const deleteCarFromWinners = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${Path.WINNERS}/${id}`, { method: 'DELETE' });
    if (response.ok) {
        return response.json();
    }
    return response;
};

export const startStopEngine = async (id: number, status: 'started' | 'stopped') => {
    const response: Response = await fetch(`${baseURL}${Path.ENGINE}?id=${id}&status=${status}`, { method: 'PATCH' });
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(new Error(`Method startEngine not work. Status error: ${response.status}`));
};

export const switchEngineToDrive = async (id: number, status: 'drive', signal: AbortSignal) => {
    try {
        const response: Response = await fetch(`${baseURL}${Path.ENGINE}?id=${id}&status=${status}`, {
            method: 'PATCH',
            signal,
        });
        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return Promise.resolve(JSON.stringify(await getCar(id)));
        }
        if (response.status === 500) {
            // eslint-disable-next-line @typescript-eslint/return-await
            return Promise.reject(response.status);
        }
        // eslint-disable-next-line prefer-promise-reject-errors, @typescript-eslint/return-await
        return Promise.reject(true);
    } catch (error) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(true);
    }
};

export const getWinners = async (_page: number, _sort: 'id' | 'wins' | 'time', _order: 'ASC' | 'DESC') => {
    const response: Response = await fetch(
        `${baseURL}${Path.WINNERS}?_page=${_page}&_limit=${ITEM_ON_PAGE_WINNERS}&_sort=${_sort}&_order=${_order}`
    );
    if (response.ok) {
        const data: WinnerInfo[] = await response.json();
        const totalCount: number = Number(response.headers.get('X-Total-Count'));
        return {
            data,
            count: totalCount,
        };
    }
    return Promise.reject(new Error(`Method getWinners not work. Status error: ${response.status}`));
};

export const getWinner = async (id: number) => {
    const response: Response = await fetch(`${baseURL}${Path.WINNERS}/${id}`);
    if (response.ok) {
        return response.json();
    }
    return {};
};

const POSTWinnerOptions = (winner: WinnerInfo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    };
};

export const createWinner = async (winner: WinnerInfo) => {
    return fetch(`${baseURL}${Path.WINNERS}`, POSTWinnerOptions(winner));
};

const PUTWinnerOptions = (winner: WinnerInfo) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    };
};

export const updateWinner = async (winner: WinnerInfo) => {
    const response: Response = await fetch(`${baseURL}${Path.WINNERS}/${winner.id}`, PUTWinnerOptions(winner));
    if (response.ok) {
        return response.json();
    }
    return Promise.reject(new Error(`Winner is not update. Status error: ${response.status}`));
};
