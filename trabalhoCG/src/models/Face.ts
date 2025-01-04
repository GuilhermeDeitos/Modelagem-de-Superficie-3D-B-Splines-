import { Aresta } from "./Aresta";
import { Ponto } from "./Ponto";
import { VectorUtils } from "../utils";
export class Face{
    public arestas: Aresta[];
    public id: number;
    public centroide: Ponto = new Ponto(0, 0, 0);
    public vetNormal: number[] = [];
    constructor(arestas: Aresta[], id: number){
        this.arestas = arestas;
        this.id = id;
    }

    public getFace(){
        return this.arestas;
    }

    public isValidFace(){
        return this.arestas.length >= 3;
    }

    public calcularVetNormal(){
        //Vetor normal da face
        const a = this.arestas[0].pontoInicio;
        const b = this.arestas[1].pontoInicio;

        const u = VectorUtils.subtractVectors([b.getPonto().X, b.getPonto().Y, b.getPonto().Z], [a.getPonto().X, a.getPonto().Y, a.getPonto().Z]);
        if(u===null)
            return;
        const c = this.arestas[2].pontoInicio;
        const v = VectorUtils.subtractVectors([c.getPonto().X, c.getPonto().Y, c.getPonto().Z], [a.getPonto().X, a.getPonto().Y, a.getPonto().Z]);
        if(v===null)
            return;
        const x = u[1]*v[2] - u[2]*v[1];
        const y = u[2]*v[0] - u[0]*v[2];
        const z = u[0]*v[1] - u[1]*v[0];


        this.vetNormal = [x, y, z];
    }

    public calcularCentroide(){
        let somaX = 0;
        let somaY = 0;
        let somaZ = 0;
        for(let i = 0; i < this.arestas.length; i++){
            somaX += this.arestas[i].pontoInicio.X;
            somaY += this.arestas[i].pontoInicio.Y;
            somaZ += this.arestas[i].pontoInicio.Z;
        }
        this.centroide = new Ponto(somaX/this.arestas.length, somaY/this.arestas.length, somaZ/this.arestas.length);
    }
}