import { VectorUtils } from "../utils";

export class Camera{
    VRP: number[] = [];
    pontoFocal: number[] = [];
    vectorN: number[] | null= [];
    vectorV: number[] | null = [];
    vectorU: number[] | null= [];
    normalizedVectorN: number[] = [];
    normalizedVectorV: number[] = [];
    normalizedVectorU: number[] = [];
    
    constructor(VRP: number[] = [0,0,0], pontoFocal: number[]= [1,0,0]){
        //Obter os vetores u,v e n 
        const Y = [0,1,0];
        this.VRP = VRP;
        this.pontoFocal = pontoFocal;

        this.vectorN = this.calculateVectorN();
        if(this.vectorN===null)
            return;
        this.normalizedVectorN = VectorUtils.normalizeVector(this.vectorN);
        const angle = VectorUtils.dotProduct(Y, this.normalizedVectorN);
        if(angle===null)
            return;
        this.vectorV = VectorUtils.subtractVectors(Y, VectorUtils.multiplyVectorByScalar(this.normalizedVectorN, angle));
        if(this.vectorV===null)
            return;
        this.normalizedVectorV = VectorUtils.normalizeVector(this.vectorV);
        this.vectorU = VectorUtils.crossProduct(this.vectorV, this.vectorN);
        if(this.vectorU===null)
            return;
        this.normalizedVectorU = VectorUtils.normalizeVector(this.vectorU);
    }

    private calculateVectorN(): number[] | null {
        const vectorN = VectorUtils.subtractVectors(this.VRP, this.pontoFocal);
        if (!vectorN || vectorN.length === 0) {
            console.error("Erro ao calcular o vetor N. Certifique-se de que VRP e ponto focal são válidos.");
            return null;
        }
        return vectorN;
    }
    

    public cameraMatrix(): number[][]{
        if (!this.normalizedVectorU || !this.normalizedVectorV || !this.normalizedVectorN) {
            return [];
        }
        //negativar o VRP
        const negativeVRP = VectorUtils.multiplyVectorByScalar(this.VRP, -1);

        const VRPdotU = VectorUtils.dotProduct(negativeVRP, this.normalizedVectorU);
        const VRPdotV = VectorUtils.dotProduct(negativeVRP, this.normalizedVectorV);
        const VRPdotN = VectorUtils.dotProduct(negativeVRP, this.normalizedVectorN);

        if (VRPdotU === null || VRPdotV === null || VRPdotN === null) {
            return [];
        }
        return [
            [this.normalizedVectorU[0], this.normalizedVectorU[1], this.normalizedVectorU[2], VRPdotU],
            [this.normalizedVectorV[0], this.normalizedVectorV[1], this.normalizedVectorV[2], VRPdotV],
            [this.normalizedVectorN[0], this.normalizedVectorN[1], this.normalizedVectorN[2], VRPdotN],
            [0, 0, 0, 1]
        ];
    }
}