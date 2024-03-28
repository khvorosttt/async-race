export const arrayCarsName: string[] = [
    'Acura',
    'Alfa Romeo',
    'Aston Martin',
    'Audi',
    'Aurus',
    'Bentley',
    'BMW',
    'Brilliance',
    'Bugatti',
    'Buick',
    'BYD',
    'Cadillac',
    'Changan',
    'Chery',
    'CheryExeed',
    'Chevrolet',
    'Chrysler',
    'Citroen',
    'Daewoo',
    'Daihatsu',
    'Datsun',
    'Dodge',
    'DongFeng',
    'DS',
    'FAW',
    'Ferrari',
    'Fiat',
    'Ford',
    'Foton',
    'GAC',
    'Geely',
    'Genesis',
    'Haima',
    'Haval',
    'Honda',
    'Kia',
    'Lada',
    'Lamborghini',
    'Lancia',
    'Land Rover',
    'Maserati',
    'Maybach',
    'Mazda',
    'Mercedes-Benz',
    'Tesla',
];

export function randomColor() {
    let color: string = '#';
    for (let i = 0; i < 6; i++) {
        const value: number = Math.round(16 * Math.random());
        color += value.toString(16);
    }
    return color;
}

export function randomNumber(a: number, b: number) {
    return Math.round((b - a) * Math.random()) + a;
}
