import { Sidebar, Propriedades } from "./sidebar"
import { Canvas } from "../utils";
import "../styles/quadroStyle.css"
import { useEffect, useState } from "react"


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
            X: 1,
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
        pontosDeControle:{X:4, Y:4},
        grauCurva: 90,
        resolucaoCurva: {X: 100, Y: 100}
    
    });


    

    return (
        <div id="quadro">
            <div>
                <h1> Modelagem de Superfície 3D (B-Splines)</h1>
                <canvas id="tela" width={propriedades.tela.X} height={propriedades.tela.Y} style={{ border: "1px solid #000" }}
                   
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
                    canva={canvas}
                    grauCurva={propriedades.grauCurva}
                    resolucaoCurva={propriedades.resolucaoCurva}
                />
            </aside>
            
            
        </div>
    )
} 