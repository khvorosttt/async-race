export interface WinnerInfo {
    id: number;
    wins: number;
    time: number;
}

export interface CarInfo {
    name: string;
    color: string;
    id?: number | null;
}

export interface EngineInfo {
    velocity: number;
    distance: number;
}
