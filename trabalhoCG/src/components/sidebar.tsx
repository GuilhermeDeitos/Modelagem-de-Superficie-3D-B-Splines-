import { useState } from "react";
import {
  plano2D,
  espaco3D,
  RGB,
  isValidRGB,
  isValidScreenSize,
  Canvas,
} from "../utils";
import Swal from "sweetalert2";
import "../styles/sidebar.css";
import { SruToSrt } from "../algoritmos/sruTosrt";
import { CurvaSpline, SuperficieSpline } from "../algoritmos/spline";

export interface Propriedades {
  tela: plano2D;
  viewport: plano2D;
  camera: espaco3D;
  pontoFocal: espaco3D;
  sombreamento: number; //1 - Constante, 2 - Gouraud, 3 - Phong
  posicaoLampada: espaco3D;
  iluminacaoAmbiente: RGB; //
  intensidadeIluminacaoAmbiente: RGB;
  rotacao?: espaco3D;
  translacao?: espaco3D;
  escala?: number;
  pontosDeControle: plano2D;
  grauCurva: number;
  resolucaoCurva: plano2D;
}

interface SidebarPropriedades extends Propriedades {
  setPropriedades: React.Dispatch<React.SetStateAction<Propriedades>>;
  canva: Canvas | null;
}

export function Sidebar(props: SidebarPropriedades) {

  //A fins de teste
  const pontos = [
    [21.2, 34.1, 18.8, 5.9, 20.0],  // Coordenadas X
    [0.7, 3.4, 5.6, 2.9, 20.9],    // Coordenadas Y
    [42.3, 27.2, 14.6, 29.7, 31.6], // Coordenadas Z
    [1, 1, 1, 1, 1]                // Homogêneo
];


  const [localProprieties, setLocalProprieties] = useState<Propriedades>(props);

  function onChangeProps(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) {
    if (e.target instanceof HTMLSelectElement){
        const [mainProp] = e.target.name.split(" ");
        const value = parseInt(e.target.value) || 0;
        setLocalProprieties((prev) => {
            return {
            ...prev,
            [mainProp]: value,
            };
        });
        return;
    }

    const [mainProp, subProp] = e.target.name.split(" ");
    const value = parseInt(e.target.value) || 0;
    //Caso não tenha subProp
    if(subProp === undefined) {
        setLocalProprieties((prev) => {
            return {
            ...prev,
            [mainProp]: value,
            };
        });
        return;
    }      

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

  }

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (
      !isValidScreenSize(localProprieties.tela.X, window.innerWidth) ||
      !isValidScreenSize(localProprieties.tela.Y, window.innerHeight)
    ) {
        Swal.fire({
            title: "Erro",
            text: "Tamanho da tela inválido",
            icon: "error"
        });
      return;
    }
    if (!isValidRGB(localProprieties.iluminacaoAmbiente)) {
        Swal.fire({
            title: "Erro",
            text: "Cor da iluminação ambiente inválida",
            icon: "error"
        });
      return;
    }
    if (!isValidRGB(localProprieties.intensidadeIluminacaoAmbiente)) {
        Swal.fire({
            title: "Erro",
            text: "Intensidade da iluminação ambiente inválida",
            icon: "error"
        });
      return;
    }
    props.setPropriedades(localProprieties);
    const surperficie = new SuperficieSpline(props.pontosDeControle, props.canva, props.camera, props.pontoFocal, props.viewport, props.tela, props.resolucaoCurva)
    surperficie.executar();
    const curvas = new CurvaSpline(props.pontosDeControle.Y, 90, 1, props.canva);
    curvas.executar();

    Swal.fire({
        title: "Sucesso",
        text: "Propriedades alteradas com sucesso",
        icon: "success"
    });

    
  }

  function onClickInfo(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    Swal.fire({
        title: "Informações",
        text: "Este é um projeto de Computação Gráfica que simula a modelagem de superfícies 3D utilizando B-Splines. Para alterar as propriedades da cena, basta preencher os campos do formulário ao lado e clicar em 'Aplicar alterações'.",
        icon: "info"
    });
  }
  return (
    <form className="sidebar">
      <span>
        <label>Tamanho da tela: </label>
        <span>
          <input
            onChange={onChangeProps}
            className="form-input"
            name="tela X"
            placeholder="X"
            value={localProprieties.tela.X}
          ></input>
          <input
            onChange={onChangeProps}
            className="form-input"
            name="tela Y"
            placeholder="Y"
            value={localProprieties.tela.Y}
          ></input>
        </span>
      </span>
      <span>
        <label>Tamanho da Viewport</label>
        <span>
          <input
            onChange={onChangeProps}
            className="form-input"
            name="viewport X"
            placeholder="X"
            value={localProprieties.viewport.X}
          ></input>
          <input
            onChange={onChangeProps}
            className="form-input"
            name="viewport Y"
            placeholder="Y"
            value={localProprieties.viewport.Y}
          ></input>
        </span>
      </span>
      <span>
        <label>Posição da camera</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="camera X"
            placeholder="X"
            value={localProprieties.camera.X}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="camera Y"
            placeholder="Y"
            value={localProprieties.camera.Y}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="camera Z"
            placeholder="Z"
            value={localProprieties.camera.Z}
          ></input>
        </span>
      </span>
      <span>
        <label>Ponto focal</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            placeholder="X"
            name="pontoFocal X"
            value={localProprieties.pontoFocal.X}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            placeholder="Y"
            name="pontoFocal Y"
            value={localProprieties.pontoFocal.Y}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            placeholder="Z"
            name="pontoFocal Z"
            value={localProprieties.pontoFocal.Z}
          ></input>
        </span>
      </span>
      <span>
        <label>Posição da lampada</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="posicaoLampada X"
            placeholder="X"
            value={localProprieties.posicaoLampada.X}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="posicaoLampada Y"
            placeholder="Y"
            value={localProprieties.posicaoLampada.Y}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="posicaoLampada Z"
            placeholder="Z"
            value={localProprieties.posicaoLampada.Z}
          ></input>
        </span>
      </span>
      <span>
        <label>Iluminação Ambiente</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="iluminacaoAmbiente R"
            placeholder="R"
            value={localProprieties.iluminacaoAmbiente.R}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="iluminacaoAmbiente G"
            placeholder="G"
            value={localProprieties.iluminacaoAmbiente.G}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="iluminacaoAmbiente B"
            placeholder="B"
            value={localProprieties.iluminacaoAmbiente.B}
          ></input>
        </span>
      </span>
      <span>
        <label>Intensidade da Iluminação Ambiente</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="intensidadeIluminacaoAmbiente R"
            placeholder="R"
            value={localProprieties.intensidadeIluminacaoAmbiente.R}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="intensidadeIluminacaoAmbiente G"
            placeholder="G"
            value={localProprieties.intensidadeIluminacaoAmbiente.G}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="intensidadeIluminacaoAmbiente B"
            placeholder="B"
            value={localProprieties.intensidadeIluminacaoAmbiente.B}
          ></input>
        </span>
      </span>
      <span>
        <label>Sombreamento</label>
        <span>
            <select
                onChange={onChangeProps}
                name="sombreamento"
                value={localProprieties.sombreamento}
                className="form-select"
            >
                <option value="1">Constante</option>
                <option value="2">Gouraud</option>
                <option value="3">Phong</option>
            </select>
        </span>
      </span>
      <span>
        <label>Translação</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="translacao X"
            placeholder="X"
            value={localProprieties.translacao?.X}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="translacao Y"
            placeholder="Y"
            value={localProprieties.translacao?.Y}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="translacao Z"
            placeholder="Z"
            value={localProprieties.translacao?.Z}
          ></input>
        </span>
      </span>
        <span style={{
            display: "flex",
            justifyContent: "space-between",
        }}>
          <span style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
          <label>Grau da curva</label>
          <span>
              <input
                className="form-input"
                onChange={onChangeProps}
                name="grauCurva"
                placeholder="0º"
                value={localProprieties.grauCurva}
              ></input>
          </span>
          </span>
          <span style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
          <label>Resolução da curva</label>
          <span>
              <input
                className="form-input"
                onChange={onChangeProps}
                name="resolucaoCurva X"
                placeholder="X"
                value={localProprieties.resolucaoCurva.X}
              ></input>
              <input
                className="form-input"
                onChange={onChangeProps}
                name="resolucaoCurva Y"
                placeholder="Y"
                value={localProprieties.resolucaoCurva.Y}
              ></input>
            </span>
          </span>
          
      </span>
      <span style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            
      }}>
        <span style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: ".5rem"
        }}>
        <label>Escala</label>
        <label>     Pontos de controle</label>
        </span>
        
        <span style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        }}>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="escala"
            placeholder="Escala"
            value={localProprieties.escala}
          ></input>
          <span>
          <input
                    className="form-input"
                    onChange={onChangeProps}
                    name="pontosDeControle X"
                    placeholder="Pontos de controle"
                    value={localProprieties.pontosDeControle.X}
                ></input>
                <input
                    className="form-input"
                    onChange={onChangeProps}
                    name="pontosDeControle Y"
                    placeholder="Pontos de controle"
                    value={localProprieties.pontosDeControle.Y}
                    />
          </span>
        </span>
            
      
      </span>
        
      <button onClick={onClick} className="btn">
        Aplicar alterações
      </button>

      <button className="btn btn-info" onClick={onClickInfo}>&#9432;</button>
    </form>
  );
}
