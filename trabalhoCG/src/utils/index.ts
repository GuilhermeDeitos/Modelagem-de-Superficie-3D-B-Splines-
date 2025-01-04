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
    R: number;
    G: number;
    B: number;
}

export function isValidRGB(color: RGB): boolean {
    return (
        color.R >= 0 && color.R <= 255 &&
        color.G >= 0 && color.G <= 255 &&
        color.B >= 0 && color.B <= 255
    );
}

export function isValidScreenSize(size: number, windowSize:number): boolean {
    //Ver se o tamanho é maior que 0 e se não é maior que 70% da tela
    return size > 0 && size < 0.7 * windowSize;
}

export function multiplyMatrices(matrixA: number[][], matrixB: number[][]): number[][] | null {
    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    // Verifica se as dimensões são compatíveis para multiplicação
    if (colsA !== rowsB) {
        console.error("Matrizes incompatíveis para multiplicação.");
        return null;
    }

    // Cria a matriz resultante com valores inicializados como 0
    const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    // Multiplica as matrizes
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    return result;
}