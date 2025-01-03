export const MAX_POINTS = 100;
export const MIN_POINTS = 4;

export interface plano2D{
    X: number;
    Y: number;
}

export interface espaco3D extends plano2D{
    Z: number;
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export function isValidRGB(color: RGB): boolean {
    return (
        color.r >= 0 && color.r <= 255 &&
        color.g >= 0 && color.g <= 255 &&
        color.b >= 0 && color.b <= 255
    );
}