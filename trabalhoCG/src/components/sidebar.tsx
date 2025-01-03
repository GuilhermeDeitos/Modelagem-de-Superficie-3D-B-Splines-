import { useState } from "react";
import { plano2D, espaco3D, RGB, isValidRGB } from "../utils";
 



export interface Propriedades{
    tela: plano2D;
    viewport: plano2D;
    camera: espaco3D;
    pontoFocal: espaco3D;
    sombreamento: number; //1 - Constante, 2 - Gouraud, 3 - Phong
    posicaoLampada:espaco3D; 
    iluminacaoAmbiente: RGB; //
    intensidadeIluminacaoAmbiente: RGB;
    rotacao?: espaco3D;
    translacao?: espaco3D;
    escala?: number;
    

}

interface SidebarPropriedades extends Propriedades{
    setPropriedades: React.Dispatch<React.SetStateAction<Propriedades>>
}



export function Sidebar(props:SidebarPropriedades){

    const [localProprieties, setLocalProprieties] = useState<Propriedades>(props);

    function onChangeProps(e:any) {
        const [mainProp, subProp] = e.target.name.split(' ');
        const value = parseInt(e.target.value) || 0;
        console.log(mainProp, subProp, value);

        setLocalProprieties((prev) => {
            const updatedProp = {
                ...(prev[mainProp as keyof Propriedades] as any),
                [subProp]: value,
            };
            return {
                ...prev,
                [mainProp]: updatedProp,
            };
        });

        console.log(localProprieties.tela);
    }

    function onClick(e:any){
        e.preventDefault();
        props.setPropriedades(localProprieties);
    }
    return (
    <form>
        <span>
            <label>Tamanho da tela: </label>
            <input onChange={onChangeProps} className="form-input" name="tela X" placeholder="X" value={localProprieties.tela.X}></input>
            <input onChange={onChangeProps} className="form-input" name="tela Y" placeholder="Y" value={localProprieties.tela.Y}></input>
        </span>
        <span>
            <label>Tamanho da Viewport</label>
            <input onChange={onChangeProps} className="form-input" name="viewport X" placeholder="X" value={localProprieties.viewport.X}></input>
            <input onChange={onChangeProps} className="form-input" name="viewport Y" placeholder="Y" value={localProprieties.viewport.Y}></input>
        </span>
        <span>
            <label>Posição da camera</label>
            <input className="form-input" onChange={onChangeProps} name="camera X" placeholder="X" value={localProprieties.camera.X}></input>
            <input className="form-input" onChange={onChangeProps} name="camera Y" placeholder="Y" value={localProprieties.camera.Y}></input>
            <input className="form-input" onChange={onChangeProps} name="camera Z" placeholder="Z" value={localProprieties.camera.Z}></input>
        </span>
        <span>
            <label>Ponto focal</label>
            <input className="form-input" onChange={onChangeProps} placeholder="X" name="pontoFocal X" value={localProprieties.pontoFocal.X}></input>
            <input className="form-input" onChange={onChangeProps} placeholder="Y" name="pontoFocal Y" value={localProprieties.pontoFocal.Y}></input>
            <input className="form-input" onChange={onChangeProps} placeholder="Z" name="pontoFocal Z" value={localProprieties.pontoFocal.Z}></input>
        </span>
        <span>
            <label>Posição da lampada</label>
            <input className="form-input" onChange={onChangeProps} name="posicaoLampada X" placeholder="X" value={localProprieties.posicaoLampada.X}></input>
            <input className="form-input" onChange={onChangeProps} name="posicaoLampada Y" placeholder="Y" value={localProprieties.posicaoLampada.Y}></input>
            <input className="form-input" onChange={onChangeProps} name="posicaoLampada Z" placeholder="Z" value={localProprieties.posicaoLampada.Z}></input>
        </span>
        <button onClick={onClick}>aplica alterações</button>
    </form>
    )
}