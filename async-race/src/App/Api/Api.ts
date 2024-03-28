import { carInfo } from "../GarageView/GarageView";

const baseURL = 'http://127.0.0.1:3000'

enum path {
    GARAGE = '/garage',
    WINNERS = '/winners'
}

export const ITEM_ON_PAGE: number = 7;


export const getCars = async(page: number) => {
    const responce: Response = await fetch(`${baseURL}${path.GARAGE}?_page=${page}&_limit=${ITEM_ON_PAGE}`);
    if (responce.ok) {
        const data: Promise<carInfo[]> = await responce.json();
        const totalCount: number = Number(responce.headers.get('X-Total-Count'));
        return { 
            data: data,
            count: totalCount
        };
    } else {
        return Promise.reject(new Error(`Method getCars not work. Status error: ${responce.status}`));
    }
}

export const getCar = async(id: number) => {
    const responce: Response = await fetch(`${baseURL}${path.GARAGE}/${id}`);
    if (responce.ok) {
        return await responce.json();
    } else {
        return Promise.reject(new Error(`Method getCar not work. Status error: ${responce.status}`))
    }
}

const POSTOptions = (car: carInfo) => {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car),
    }
}

export const createCar = async(car: carInfo) => {
    return await fetch(`${baseURL}${path.GARAGE}`, POSTOptions(car));
}

const PUTOptions = (car: carInfo) => {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car),
    }
}

export const updateCar = async(car: carInfo) => {
    const responce: Response = await fetch(`${baseURL}${path.GARAGE}/${car.id}`, PUTOptions(car));
    if(responce.ok) {
        return responce.json();
    } else {
        return Promise.reject(new Error(`Car is not update. Status error: ${responce.status}`));
    }
}