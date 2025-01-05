/*
    Metodos do pipeline de conversão SRU para SRT
    Passos da pipeline:
        Obtenção do objeto 3d (SRU) -> Transformação de camera (SRC) -> recorte3d -> projeção(axonométrica isométrica) -> rasterização -> imagem 2D (SRT)
*/

// Importando funções de utils
import { espaco3D, MatrixUtils, plano2D, viewport, window } from '../utils'
import { Camera } from '../models/Camera';


export class SruToSrt{
    private pontos: number[][] = [];
    private VRP: number[] = [];
    private pontoFocal: number[] = [];
    private viewport: viewport;
    private window: window;
    constructor(VRP: espaco3D, pontoFocal: espaco3D, pontos: number[][], viewport: plano2D, windowSize: plano2D){
        this.pontos = pontos.map(ponto => {
            if (ponto.length === 3) {
                ponto.push(1);
            }
            return ponto;
        });
        this.VRP = [VRP.X, VRP.Y, VRP.Z];
        this.pontoFocal = [pontoFocal.X, pontoFocal.Y, pontoFocal.Z];
        this.viewport = {
            umin: 0,
            umax: viewport.X,
            vmin: 0,
            vmax: viewport.Y
        };
        this.window = {
            xmin: -windowSize.X/2,
            xmax: windowSize.X/2,
            ymin: -windowSize.Y/2,
            ymax: windowSize.Y/2
        };
        
    }
    // Função para realizar a transformação de camera (SRC)
    private transformacaoCamera(): number[][]{
        const camera = new Camera(this.VRP, this.pontoFocal);
        return camera.cameraMatrix();
    }

    // Projeção axonométrica isométrica
    private projecaoAxonometricaIsometrica(): number[][]{
        return [
            [1 , 0, -1, 0], // Transformação X'
            [0, 1, -1, 0],    // Transformação Y'
            [0, 0, 0, 0],                 // Projeção ortogonal no plano
            [0, 0, 0, 1]                  // Homogeneidade
        ];

    }

    // SRT
    private transformacaoJanela(): number[][] {
        const deltaU = this.viewport.umax - this.viewport.umin;
        const deltaV = this.viewport.vmax - this.viewport.vmin;
        const invertedDeltaV = this.viewport.vmin - this.viewport.vmax;
        const deltaX = this.window.xmax - this.window.xmin;
        const deltaY = this.window.ymax - this.window.ymin;
        return [
            [deltaU / deltaX, 0, 0, -this.window.xmin * deltaU / deltaX + this.viewport.umin],
            [0, invertedDeltaV / deltaY, 0, -this.window.ymin * deltaV / deltaY + this.viewport.vmax],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]

    }

    // Função para realizar a pipeline de conversão SRU para SRT
    public pipeline(): number[][]{
        const matrizCamera = this.transformacaoCamera();
        const matrizProjecao = this.projecaoAxonometricaIsometrica();
        const matrizJanela = this.transformacaoJanela();
        const matrizProjecaoCamera = MatrixUtils.multiplyMatrix(matrizProjecao, matrizCamera);

        if (matrizProjecaoCamera === null) {
            throw new Error("Multiplicação de matriz falhou para matriz de projecao e camera");
        }
        const matrizFinal = MatrixUtils.multiplyMatrix(matrizJanela, matrizProjecaoCamera);
        console.log(matrizFinal);

        if (matrizFinal === null) {
            throw new Error("Multiplicação de matriz falhou para matriz de janela e matriz de projecao e camera");
        }
        return matrizFinal;
    }

    // Função para realizar a transformação de todos os pontos
    public transformarPontos(): number[][] | null{
        const matrizFinal = this.pipeline();
        this.pontos = MatrixUtils.transposeMatrix(this.pontos);
        this.pontos = MatrixUtils.multiplyMatrix(matrizFinal, this.pontos) || [];
        this.pontos = MatrixUtils.transposeMatrix(this.pontos);
        console.log(matrizFinal);
        console.log(this.pontos);
        //Normalizar com o fator homogeneo
        

        
        console.log(this.pontos);
        return this.pontos;

        
        
    }
}

