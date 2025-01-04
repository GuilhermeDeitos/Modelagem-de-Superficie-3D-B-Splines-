import { espaco3D } from "../utils";
import { Ponto } from "./Ponto";

export class Aresta{
    public pontoInicio: Ponto;
    public pontoFim: Ponto;
    public id: number;
    constructor(pontoInicio: espaco3D, pontoFim: espaco3D, id: number){
        this.pontoInicio = new Ponto(pontoInicio.X, pontoInicio.Y, pontoInicio.Z);
        this.pontoFim = new Ponto(pontoFim.X, pontoFim.Y, pontoFim.Z);
        this.id = id;
    }

    public getAresta():Ponto[]{
        return [this.pontoInicio, this.pontoFim];
    }

    public verificarAresta(){
        return this.pontoInicio.getPonto() !== this.pontoFim.getPonto();
    }

}