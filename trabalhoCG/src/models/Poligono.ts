import { MatrixUtils, GeometricTransformations, VectorUtils } from "../utils";
import { Ponto } from "./Ponto";
import { Aresta } from "./Aresta";

export class Poligono{
    arestas: Aresta[];
    idPoligono: number;
    constructor(arestas: Aresta[], idPoligono: number){
        this.arestas = arestas;
        this.idPoligono = idPoligono;

    }

    
    //Método para realizar a translação de um polígono

}