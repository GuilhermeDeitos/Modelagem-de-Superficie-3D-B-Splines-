import { Sidebar, Propriedades } from "./sidebar"
import "../styles/quadroStyle.css"
import { useState } from "react"



export function Quadro() {
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
            r: 255,
            g: 255,
            b: 255
        },
        intensidadeIluminacaoAmbiente: {
            r: 255,
            g: 255,
            b: 255
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
        escala: 1 // Valor padrão
    });
    return (
        <div id="quadro">
            <div>
                <h1 style={{ color: "blue" }}> Modelagem de Superfície 3D (B-Splines)</h1>
                <canvas id="tela" width={propriedades.tela.X} height={propriedades.tela.Y} style={{ border: "1px solid #000" }}></canvas>
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
                />
            </aside>
        </div>
    )
} 