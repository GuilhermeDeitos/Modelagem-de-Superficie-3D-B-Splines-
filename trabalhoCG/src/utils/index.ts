import { Ponto } from "../models/Ponto";

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

export interface viewport{
    umin: number;
    umax: number;
    vmin: number;
    vmax: number;
}

export interface window{
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
}

export function isValidRGB(color: RGB): boolean {
    return (
        color.R >= 0 && color.R <= 255 &&
        color.G >= 0 && color.G <= 255 &&
        color.B >= 0 && color.B <= 255
    );
}


export function getRGBString(color: RGB): string {
    return `rgb(${color.R},${color.G},${color.B})`;
}

export function isValidScreenSize(size: number, windowSize:number): boolean {
    //Ver se o tamanho é maior que 0 e se não é maior que 70% da tela
    return size > 0 && size < 0.7 * windowSize;
}

//Classe com metodos de matrizes
export class MatrixUtils {
    constructor() { }

    static multiplyMatrix(matrixA: number[][], matrixB: number[][]): number[][] | null {
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

    static subtractMatrix(matrixA: number[][], matrixB: number[][]): number[][] | null {
        const rowsA = matrixA.length;
        const colsA = matrixA[0].length;
        const rowsB = matrixB.length;
        const colsB = matrixB[0].length;

        // Verifica se as dimensões são compatíveis para subtração
        if (rowsA !== rowsB || colsA !== colsB) {
            console.error("Matrizes incompatíveis para subtração.");
            return null;
        }

        // Cria a matriz resultante com valores inicializados como 0
        const result: number[][] = Array.from({ length: rowsA }, () => Array(colsA).fill(0));

        // Subtrai as matrizes
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
                result[i][j] = matrixA[i][j] - matrixB[i][j];
            }
        }

        return result;
    }

    //fazer matriz transposta
    static transposeMatrix(matrix: number[][]): number[][] {
        const rows = matrix.length;
        const cols = matrix[0].length;

        // Cria a matriz transposta
        const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));

        // Preenche a matriz transposta
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }

        return result;
    }
}

export class GeometricTransformations{
    constructor(){}
    static rotationMatrix3D(angulo: number, eixo: string): number[][] | null {
        const cos = Math.cos(angulo);
        const sen = Math.sin(angulo);

        switch (eixo) {
            case 'x':
            case 'X':
                return [
                    [1, 0, 0, 0],
                    [0, cos, -sen, 0],
                    [0, sen, cos, 0],
                    [0, 0, 0, 1]
                ];

            case 'y':
            case 'Y':
                return [
                    [cos, 0, sen, 0],
                    [0, 1, 0, 0],
                    [-sen, 0, cos, 0],
                    [0, 0, 0, 1]
                ];

            case 'z':
            case 'Z':
                return [
                    [cos, -sen, 0, 0],
                    [sen, cos, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ];

            default:
                return null;
        }
    }

    static translationMatrix3D(x: number, y: number, z: number): number[][] {
        return [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ];
    }

    // Como a operação de escala deve ser uniforme, utilizamos apenas um fator de escala
    static scaleMatrix3D(s: number): number[][] {
        return [
            [s, 0, 0, 0],
            [0, s, 0, 0],
            [0, 0, s, 0],
            [0, 0, 0, 1]
        ];
    }
}

export class VectorUtils {
    static subtractVectors(vectorA: number[], vectorB: number[]): number[] | null {
        const sizeA = vectorA.length;
        const sizeB = vectorB.length;

        // Verifica se os vetores têm o mesmo tamanho
        if (sizeA !== sizeB) {
            console.error("Vetores de tamanhos diferentes.");
            return null;
        }

        // Subtrai os vetores
        const result: number[] = [];
        for (let i = 0; i < sizeA; i++) {
            result.push(vectorA[i] - vectorB[i]);
        }

        return result;
    }

    static normalizeVector(vector: number[]): number[] {
        const size = vector.length;
        let norm = 0;

        // Calcula a norma do vetor
        for (let i = 0; i < size; i++) {
            norm += vector[i] ** 2;
        }
        norm = Math.sqrt(norm);

        // Normaliza o vetor
        const result: number[] = [];
        for (let i = 0; i < size; i++) {
            result.push(vector[i] / norm);
        }

        return result;
    }

    static dotProduct(vectorA: number[], vectorB: number[]): number | null {
        const sizeA = vectorA.length;
        const sizeB = vectorB.length;

        // Verifica se os vetores têm o mesmo tamanho
        if (sizeA !== sizeB) {
            console.error("Vetores de tamanhos diferentes.");
            return null;
        }

        // Calcula o produto escalar
        let result = 0;
        for (let i = 0; i < sizeA; i++) {
            result += vectorA[i] * vectorB[i];
        }

        return result;
    }

    static crossProduct(vectorA: number[], vectorB: number[]): number[] | null {
        if (vectorA.length !== 3 || vectorB.length !== 3) {
            console.error("O produto vetorial só é definido para vetores tridimensionais (tamanho 3).");
            return null;
        }  
        return [
            vectorA[1] * vectorB[2] - vectorA[2] * vectorB[1],
            vectorA[2] * vectorB[0] - vectorA[0] * vectorB[2],
            vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0],
        ];
    }
    

    static multiplyVectorByScalar(vector: number[], scalar: number): number[] {
        return vector.map(component => component * scalar);
    }
    
}

export class Canvas{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;;
    constructor(
        canvas: HTMLCanvasElement,
    ){
        this.canvas = canvas;
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error("Failed to get 2D context");
        }
        this.ctx = context;

    }
    
    drawLine(ponto1:Ponto,ponto2:Ponto): void {
        this.ctx.beginPath();
        this.ctx.moveTo(ponto1.X, ponto1.Y);
        this.ctx.lineTo(ponto2.X, ponto2.Y);
        this.ctx.strokeStyle = getRGBString(ponto1.cor);
        this.ctx.stroke();
    }

    drawPoint(ponto:Ponto): void {
        this.ctx.beginPath();
        this.ctx.arc(ponto.X, ponto.Y, 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = getRGBString(ponto.cor);
        this.ctx.fill();
    }

    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getCanvas(){
        return this.canvas;
    }

    getContext(){
        return this.ctx;
    }
}