import { Sidebar, Propriedades } from "./sidebar"
import { Canvas } from "../utils";
import "../styles/quadroStyle.css"
import { useEffect, useState } from "react"
import { Ponto } from "../models/Ponto";
import { Aresta } from "../models/Aresta";
import { Poligono } from "../models/Poligono";



export function Quadro() {
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    useEffect(() => {
        const canvasElement = document.getElementById("tela") as HTMLCanvasElement;
        if (canvasElement) {
            setCanvas(new Canvas(canvasElement));
        }
    }, []);
    
    const [propriedades, setPropriedades] = useState<Propriedades>({
        tela: {
            X: 800,
            Y: 500
        },
        viewport: {
            X: 800,
            Y: 500
        },
        camera: {
            X: 0,
            Y: 0,
            Z: 0
        },
        pontoFocal: {
            X: 0,
            Y: 0,
            Z: 0
        },
        posicaoLampada: {
            X: 0,
            Y: 0,
            Z: 0
        },
        sombreamento: 1, // Valor padrão
        iluminacaoAmbiente: {
            R: 255,
            G: 255,
            B: 255
        },
        intensidadeIluminacaoAmbiente: {
            R: 255,
            G: 255,
            B: 255
        },
        rotacao: {
            X: 0,
            Y: 0,
            Z: 0
        },
        translacao: {
            X: 0,
            Y: 0,
            Z: 0
        },
        escala: 1, // Valor padrão
        pontosDeControle:1
    
    });

    const [arestas, setArestas] = useState<Aresta[]>([]);
    const [poligonos, setPoligonos] = useState<Poligono[]>([]);
    const [idArestas, setIdArestas] = useState(0);
    const [idPoligonos, setIdPoligonos] = useState(0);

    function onClickCanvas(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const ponto = new Ponto(x, y, 0);
    
        if (canvas) {
            // Desenhar o ponto clicado
            canvas.drawPoint(ponto);
    
            // Atualizar arestas
            if (arestas.length > 0) {
                const ultimoPonto = arestas[arestas.length - 1].pontoFim;
                const novaAresta = new Aresta(ultimoPonto, ponto, idArestas);
                setArestas([...arestas, novaAresta]);
                canvas.drawLine(ultimoPonto, ponto); // Desenhar aresta
            } else {
                const novaAresta = new Aresta(ponto, ponto, idArestas);
                setArestas([...arestas, novaAresta]);
            }
    
            setIdArestas(idArestas + 1);
        }
    }

    function fecharPoligono() {
        if (arestas.length > 1 && canvas) {
            const primeiroPonto = arestas[0].pontoInicio;
            const ultimoPonto = arestas[arestas.length - 1].pontoFim;
    
            // Desenhar a última aresta para fechar o polígono
            canvas.drawLine(ultimoPonto, primeiroPonto);
    
            // Criar polígono
            const poligono = new Poligono(arestas, idPoligonos);
            setPoligonos([...poligonos, poligono]);

            // Limpar arestas
            setArestas([]);
            setIdArestas(0);
            setIdPoligonos(idPoligonos + 1);

        }
    }

    function limparPoligonos() {
        if (canvas) {
            canvas.clearCanvas();
            setArestas([]);
            setPoligonos([]);
            setIdArestas(0);
            setIdPoligonos(0);
        }
    }
    
    

    return (
        <div id="quadro">
            <div>
                <h1> Modelagem de Superfície 3D (B-Splines)</h1>
                <canvas id="tela" width={propriedades.tela.X} height={propriedades.tela.Y} style={{ border: "1px solid #000" }}
                    onClick={onClickCanvas}
                ></canvas>
            </div>
            <aside>
                <Sidebar 
                    setPropriedades={setPropriedades} 
                    tela={propriedades.tela} 
                    viewport={propriedades.viewport} 
                    camera={propriedades.camera} 
                    pontoFocal={propriedades.pontoFocal} 
                    posicaoLampada={propriedades.posicaoLampada} 
                    sombreamento={propriedades.sombreamento}
                    iluminacaoAmbiente={propriedades.iluminacaoAmbiente}
                    intensidadeIluminacaoAmbiente={propriedades.intensidadeIluminacaoAmbiente}
                    rotacao={propriedades.rotacao}
                    translacao={propriedades.translacao}
                    escala={propriedades.escala}
                    pontosDeControle={propriedades.pontosDeControle}
                />
            </aside>
            <div>
                <button onClick={fecharPoligono}>Fechar Poligono</button>
                <button onClick={limparPoligonos}>LimparPoligonos</button>
            </div>
            
        </div>
    )
} 