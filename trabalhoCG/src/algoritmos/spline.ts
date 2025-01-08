import { plano2D, Canvas, RGB, espaco3D, viewport, window, MatrixUtils } from "../utils";
import { Ponto } from "../models/Ponto";
import { SruToSrt } from "./sruTosrt";

export class SuperficieSpline {
    private NX: number = 3; // número de pontos de controle X
    private NY: number = 4; // número de pontos de controle Y
    private TX: number = 3; // grau da spline em X
    private TY: number = 3; // grau da spline em Y
    private RESOLUCAOI: number = 5; // resolução em I
    private RESOLUCAOJ: number = 40; // resolução em J
    private pontosControle: Ponto[][];
    private nosI: number[];
    private nosJ: number[];
    private pontosGerados: Ponto[][];
    private canva:Canvas | null;
    private VRP: espaco3D = {X: 0, Y: 0, Z: 0};
    private pontoFocal: espaco3D = {X: 1, Y: 0, Z: 0};
    private viewport: plano2D;
    private window: plano2D;

    constructor(pontosControle: plano2D, canva:Canvas | null,
        camera: espaco3D, 
        pontoFocal: espaco3D, 
        viewport: plano2D,
        tela: plano2D,
        resolucao:plano2D
    ) {
        this.NX = pontosControle.X;
        this.NY = pontosControle.Y;
        this.canva = canva;
        this.RESOLUCAOI = resolucao.X;
        this.RESOLUCAOJ = resolucao.Y;
        this.pontosControle = Array.from({ length: this.NX + 1 }, () =>
            Array.from({ length: this.NY + 1 }, () => new Ponto(0, 0, 0))
        );
        this.nosI = new Array(this.NX + this.TX + 1).fill(0);
        this.nosJ = new Array(this.NY + this.TY + 1).fill(0);
        this.pontosGerados = Array.from({ length: this.RESOLUCAOI }, () =>
            Array.from({ length: this.RESOLUCAOJ }, () => new Ponto(0, 0, 0))
        );
        this.VRP = camera;
        this.pontoFocal = pontoFocal;
        this.viewport = viewport;
        this.window = tela;
        
        console.log(this.RESOLUCAOI, this.RESOLUCAOJ);
        
    }
    
    private randomizarSuperficie(){
        for (let i = 0; i <= this.NX; i++) {
            for (let j = 0; j <= this.NY; j++) {
                this.pontosControle[i][j] = new Ponto(
                    i,
                    j,
                    Math.random() * 2 - 1
                );
            }
        }
    }
    

    

    private calcularNos(nos: number[], n: number, t: number) {
        for (let i = 0; i < n + t + 1; i++) {
            if (i < t) nos[i] = 0;
            else if (i <= n) nos[i] = i - t + 1;
            else nos[i] = n - t + 2;
        }
    }

    private calcularBlending(k: number, t: number, nos: number[], u: number): number {
        if (t === 1) {
            return nos[k] <= u && u < nos[k + 1] ? 1 : 0;
        }

        const d1 = nos[k + t - 1] - nos[k];
        const d2 = nos[k + t] - nos[k + 1];

        const termo1 = d1 === 0 ? 0 : ((u - nos[k]) / d1) * this.calcularBlending(k, t - 1, nos, u);
        const termo2 = d2 === 0 ? 0 : ((nos[k + t] - u) / d2) * this.calcularBlending(k + 1, t - 1, nos, u);

        return termo1 + termo2;
    }

    private gerarSuperficie() {
        const incrementoI = (this.NX - this.TX + 2) / (this.RESOLUCAOI - 1);
        const incrementoJ = (this.NY - this.TY + 2) / (this.RESOLUCAOJ - 1);

        this.calcularNos(this.nosI, this.NX, this.TX);
        this.calcularNos(this.nosJ, this.NY, this.TY);

        let intervaloI = 0;
        for (let i = 0; i < this.RESOLUCAOI; i++) {
            let intervaloJ = 0;
            for (let j = 0; j < this.RESOLUCAOJ; j++) {
                const ponto: Ponto = new Ponto(0, 0, 0);

                for (let ki = 0; ki <= this.NX; ki++) {
                    for (let kj = 0; kj <= this.NY; kj++) {
                        const bi = this.calcularBlending(ki, this.TX, this.nosI, intervaloI);
                        const bj = this.calcularBlending(kj, this.TY, this.nosJ, intervaloJ);

                        ponto.X += this.pontosControle[ki][kj].X * bi * bj;
                        ponto.Y += this.pontosControle[ki][kj].Y * bi * bj;
                        ponto.Z += this.pontosControle[ki][kj].Z * bi * bj;
                    }
                }
                this.pontosGerados[i][j] = ponto;
                intervaloJ += incrementoJ;
            }
            intervaloI += incrementoI;
        }
    }

    public exibirSuperficie() {
        const canvas = this.canva?.getCanvas();
        if (!canvas) throw new Error("Canvas não encontrado.");

        // Limpar o canvas
        this.canva?.clearCanvas();
        
        //Normalizar os pontos
        console.log(this.pontosGerados)
        

        // converter pontos para matriz de numeros
        const pontosNumeros = this.pontosGerados.map(linha => linha.map(ponto => [ponto.X, ponto.Y, ponto.Z]));
        

        const pontosNumerosFlattened = pontosNumeros.flat();
        const sruToSrt = new SruToSrt(this.VRP, this.pontoFocal, pontosNumerosFlattened, this.viewport, this.window);
        const pontosSRT = sruToSrt.transformarPontos();
        if (pontosSRT === null) {
            throw new Error("Falha ao transformar pontos para SRT");
        }


        // converter pontos para matriz de pontos
        const pontosSRTMatriz = pontosSRT.map((ponto) => new Ponto(ponto[0], ponto[1], ponto[2]));
        const pontosSRTMatriz2D = Array.from({ length: this.RESOLUCAOI }, () =>
            Array.from({ length: this.RESOLUCAOJ }, () => new Ponto(0, 0, 0))
        );
       

        let index = 0;
        for (let i = 0; i < this.RESOLUCAOI; i++) {
            for (let j = 0; j < this.RESOLUCAOJ; j++) {
                pontosSRTMatriz2D[i][j] = pontosSRTMatriz[index];
                index++;
            }
        }

         //Normalizar os pontos
         pontosSRTMatriz2D.forEach((linha) => {
            linha.forEach((ponto) => {
                ponto.X = (ponto.X + 1) + canvas.width/4; // Normalizando para o canvas
                ponto.Y = (ponto.Y + 1) + canvas.height/4; // Normalizando para o canvas
                ponto.Z = ponto.Z + 1;
            })
        });
        

        console.log("Pontos da Superfície Spline:", pontosSRTMatriz2D);
        // Desenhar pontos a partir de pontos numeros
        for (let i = 0; i < this.RESOLUCAOI; i++) {
            for (let j = 0; j < this.RESOLUCAOJ; j++) {
                this.canva?.drawPoint(pontosSRTMatriz2D[i][j]);
            }
        }

        // Desenhar linhas entre os pontos
        for (let i = 0; i < this.RESOLUCAOI; i++) {
            for (let j = 0; j < this.RESOLUCAOJ - 1; j++) {
                this.canva?.drawLine(pontosSRTMatriz2D[i][j], pontosSRTMatriz2D[i][j + 1]);
            }
        }

        for (let j = 0; j < this.RESOLUCAOJ; j++) {
            for (let i = 0; i < this.RESOLUCAOI - 1; i++) {
                this.canva?.drawLine(pontosSRTMatriz2D[i][j], pontosSRTMatriz2D[i + 1][j]);
            }
        }
        
      }
    
      public getPontos(): Ponto[][] {
        return this.pontosGerados;
      }
    
      //Operações sobre os pontos da superficie
      public pointsOperations(scale:number,translate:espaco3D, rotate:espaco3D): void {
        const pontos = this.getPontos();
        const pontosOperados = pontos.map((linha) =>
          linha.map((ponto) => {
            ponto.scale(scale);
            ponto.translate(translate.X, translate.Y, translate.Z);
            ponto.rotate(rotate.X, "x");
            ponto.rotate(rotate.Y, "y");
            ponto.rotate(rotate.Z, "z");
            return ponto;
          })
        );
        this.pontosGerados = pontosOperados;
        this.exibirSuperficie();
      }

    public executar() {
        this.randomizarSuperficie();
        this.gerarSuperficie();
        this.exibirSuperficie();
    }
}

/**
 * Representa uma classe para gerar e manipular uma curva spline.
 * Isso inclui inicializar pontos de controle, calcular nós da spline,
 * interpolar a curva e exibir os resultados em um formato estruturado.
 */
export class CurvaSpline {
    private n: number; // Número de pontos de controle
    private t: number; // Grau da spline
    private resolucao: number; // Resolução da curva
    private pontosControle: Ponto[]; // Pontos de controle da curva spline
    private nos: number[]; // Vetor de nós
    private pontosGerados: Ponto[]; // Pontos interpolados na curva spline
    private canva:Canvas | null;
    private color: RGB = {
        R: 255,
        G: 0,
        B: 0
    }

    constructor(pontosControle: number, grauCurva: number, resolucao: number, canvas: Canvas | null) {
        this.n = pontosControle;
        this.t = grauCurva;
        this.resolucao = resolucao;
        this.canva = canvas;
        this.pontosControle = Array.from({ length: pontosControle + 1 }, () => (
            new Ponto(0, 0, 0, this.color)
        ));
        this.nos = new Array(pontosControle + grauCurva + 1).fill(0);
        this.pontosGerados = Array.from({ length: resolucao }, () => (
            new Ponto(0, 0, 0, this.color)
        ));
    }

    /**
     * Randomiza os pontos de controle da curva spline com valores na faixa [-1, 1].
     */
    private randomizarPontosControle() {
        for (let i = 0; i <= this.n; i++) {
            this.pontosControle[i] = new Ponto(
                 i,
                 Math.random() * 2 - 1,
                 Math.random() * 2 - 1,
                 this.color)
            
        }
    }

    /**
     * Calcula o vetor de nós da spline usando uma distribuição uniforme.
     */
    private calcularNos() {
        for (let i = 0; i < this.n + this.t + 1; i++) {
            if (i < this.t) this.nos[i] = 0;
            else if (i <= this.n) this.nos[i] = i - this.t + 1;
            else this.nos[i] = this.n - this.t + 2;
        }
    }

    /**
     * Calcula a função base para B-splines em um dado valor de parâmetro.
     * @param k - Índice da função base.
     * @param t - Grau da spline.
     * @param u - Valor do parâmetro.
     * @returns Valor da função base no valor do parâmetro.
     */
    private calcularBlending(k: number, t: number, u: number): number {
        if (t === 1) {
            return this.nos[k] <= u && u < this.nos[k + 1] ? 1 : 0;
        }

        const d1 = this.nos[k + t - 1] - this.nos[k];
        const d2 = this.nos[k + t] - this.nos[k + 1];

        const termo1 = d1 === 0 ? 0 : ((u - this.nos[k]) / d1) * this.calcularBlending(k, t - 1, u);
        const termo2 = d2 === 0 ? 0 : ((this.nos[k + t] - u) / d2) * this.calcularBlending(k + 1, t - 1, u);

        return termo1 + termo2;
    }

    /**
     * Calcula um único ponto na curva spline com base nos pontos de controle e funções base.
     * @param u - Valor do parâmetro indicando a posição na curva.
     * @returns O ponto na curva spline.
     */
    private calcularPonto(u: number): Ponto {
        const ponto: Ponto = new Ponto(0, 0, 0);

        for (let k = 0; k <= this.n; k++) {
            const b = this.calcularBlending(k, this.t, u);
            ponto.X += this.pontosControle[k].X * b;
            ponto.Y += this.pontosControle[k].Y * b;
            ponto.Z += this.pontosControle[k].Z * b;
        }

        return ponto;
    }

    /**
     * Gera a curva spline interpolando pontos ao longo da curva.
     */
    private gerarCurva() {
        this.calcularNos();
        const incremento = (this.n - this.t + 2) / (this.resolucao - 1);

        let u = 0;
        for (let i = 0; i < this.resolucao - 1; i++) {
            this.pontosGerados[i] = this.calcularPonto(u);
            u += incremento;
        }
        this.pontosGerados[this.resolucao - 1] = this.pontosControle[this.n];
    }

    /**
     * Exibe os pontos interpolados da curva spline no console.
     */
    public exibirCurva() {
        console.log("Pontos da Curva Spline:", this.pontosGerados);

        // Normalizar os pontos
        this.pontosGerados = this.pontosGerados.map(ponto => new Ponto(
            (ponto.X + 1) * (this.canva?.getWidth() ?? 1) / 2, // Normalizando para o canvas
            (ponto.Y + 1) * (this.canva?.getHeight() ?? 1) / 2, // Normalizando para o canvas
            ponto.Z + 1,
            this.color
        ));

        // Desenhar linhas entre os pontos 
        for (let i = 0; i < this.resolucao - 1; i++) {
            this.canva?.drawLine(this.pontosGerados[i], this.pontosGerados[i + 1]);
        }

        // Desenhar pontos
        this.pontosGerados.forEach(ponto => {
            this.canva?.drawPoint(ponto);
        });
        
    }

    /**
     * Orquestra os passos para gerar e exibir a curva spline.
     */
    public executar() {
        this.randomizarPontosControle();
        this.gerarCurva();
        this.exibirCurva();
    }
}
