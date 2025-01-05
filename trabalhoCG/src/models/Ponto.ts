import {  MatrixUtils, GeometricTransformations, RGB } from "../utils";
import { espaco3D } from "../utils";

export class Ponto implements espaco3D{
    X:number;
    Y:number;
    Z:number;
    cor: RGB;
    constructor(X:number,Y:number,Z:number,cor?:RGB){
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.cor = cor || {R: 0, G: 255, B: 0};
    }
    //Método para realizar a translação de um ponto
    public translate(x:number, y:number, z:number): boolean {
        const pontosAntigos = [[this.X, this.Y, this.Z]];
        const matrizTranslacao = GeometricTransformations.translationMatrix3D(x, y, z);
        const pontosNovos: number[][] | null = MatrixUtils.multiplyMatrix(matrizTranslacao, pontosAntigos);
        if(pontosNovos === null)
            return false;
        this.X = pontosNovos[0][0];
        this.Y = pontosNovos[0][1];
        this.Z = pontosNovos[0][2];
        return true;
    }

    //Método para realizar a rotação de um ponto
    public rotate(angulo:number, eixo:string): boolean {
        const pontosAntigos = [[this.X, this.Y, this.Z]];
        const matrizRotacao = GeometricTransformations.rotationMatrix3D(angulo, eixo);
        if(matrizRotacao === null)
            return false;

        const pontosNovos: number[][] | null = MatrixUtils.multiplyMatrix(matrizRotacao, pontosAntigos);

        if(pontosNovos === null)
            return false;

        this.X = pontosNovos[0][0];
        this.Y = pontosNovos[0][1];
        this.Z = pontosNovos[0][2];
        return true;
    }

    //Método para realizar a escala de um ponto
    public scale(s:number): boolean {
        const pontosAntigos = [[this.X, this.Y, this.Z]];
        const matrizEscala = GeometricTransformations.scaleMatrix3D(s);
        const pontosNovos: number[][] | null = MatrixUtils.multiplyMatrix(matrizEscala, pontosAntigos);
        if(pontosNovos === null)
            return false;
        this.X = pontosNovos[0][0];
        this.Y = pontosNovos[0][1];
        this.Z = pontosNovos[0][2];
        return true;
    }

    public getPonto():espaco3D {
        return {X: this.X, Y: this.Y, Z: this.Z};
    }

    public desenharPonto(){
        console.log(`Ponto: (${this.X}, ${this.Y}, ${this.Z})`);

    }

    

    //Método para realizar a projeção de um ponto

}