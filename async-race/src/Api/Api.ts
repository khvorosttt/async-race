const baseURL = 'http://127.0.0.1:3000'

enum path {
    GARAGE = '/garage',
    WINNERS = '/winners'
}

export const getCars = async() => {
    const responce: Response = await fetch(`${baseURL}${path.GARAGE}`);
    const data = await responce.json();
    console.log(data);
}