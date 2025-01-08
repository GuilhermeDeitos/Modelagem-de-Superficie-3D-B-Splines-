import { useState } from "react";
import {
  plano2D,
  espaco3D,
  RGB,
  isValidRGB,
  isValidScreenSize,
  Canvas,
  GeometricTransformations,
  MatrixUtils,
  randomizarSuperficie
} from "../utils";
import Swal from "sweetalert2";
import "../styles/sidebar.css";
import { SruToSrt } from "../algoritmos/sruTosrt";
import { CurvaSpline, SuperficieSpline } from "../algoritmos/spline";
import { Ponto } from "../models/Ponto";

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
  resolucaoCurva: number;
  resolucaoSuperficie:plano2D;
}

interface SidebarPropriedades extends Propriedades {
  setPropriedades: React.Dispatch<React.SetStateAction<Propriedades>>;
  canva: Canvas | null;
}

export function Sidebar(props: SidebarPropriedades) {

  const [pontos, setPontos] = useState<Ponto[][]>([]);
  const [localProprieties, setLocalProprieties] = useState<Propriedades>(props);
  const [superficie, setSuperficie] = useState<SuperficieSpline | null>(null);
  const [curvas, setCurvas] = useState<CurvaSpline| null>(null);


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

  function validations(){
    if (
      !isValidScreenSize(localProprieties.tela.X, window.innerWidth) ||
      !isValidScreenSize(localProprieties.tela.Y, window.innerHeight)
    ) {
        Swal.fire({
            title: "Erro",
            text: "Tamanho da tela inválido",
            icon: "error"
        });
      return false
    }
    if (!isValidRGB(localProprieties.iluminacaoAmbiente)) {
        Swal.fire({
            title: "Erro",
            text: "Cor da iluminação ambiente inválida",
            icon: "error"
        });
      return false
    }
    if (!isValidRGB(localProprieties.intensidadeIluminacaoAmbiente)) {
        Swal.fire({
            title: "Erro",
            text: "Intensidade da iluminação ambiente inválida",
            icon: "error"
        });
      return false
    }
  if(localProprieties.pontosDeControle.X < 4 || localProprieties.pontosDeControle.Y < 4 || localProprieties.pontosDeControle.X > 100 || localProprieties.pontosDeControle.Y > 100){
        Swal.fire({
            title: "Erro",
            text: "Número de pontos de controle inválido",
            icon: "error"
        });
      return false
    }
    if(localProprieties.grauCurva < 0 || localProprieties.grauCurva > 360){
        Swal.fire({
            title: "Erro",
            text: "Grau da curva inválido",
            icon: "error"
        });
      return false
    }
    if(localProprieties.resolucaoSuperficie.X < 0 || localProprieties.resolucaoSuperficie.Y < 0){
        Swal.fire({
            title: "Erro",
            text: "Resolução da curva inválida",
            icon: "error"
        });
      return false
    }
    return true
  }

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!validations()) 
      return;
    props.setPropriedades(localProprieties);
    setSuperficie(new SuperficieSpline(localProprieties.pontosDeControle, props.canva, localProprieties.camera, localProprieties.pontoFocal, localProprieties.viewport, localProprieties.tela, localProprieties.resolucaoSuperficie))
    if (superficie) {
      superficie.executar();
      setPontos(superficie.getPontos());

    }
    const curvas = new CurvaSpline(localProprieties.pontosDeControle.Y*localProprieties.pontosDeControle.X, localProprieties.grauCurva, localProprieties.resolucaoCurva, props.canva);
    curvas.executar();

    Swal.fire({
        title: "Sucesso",
        text: "Propriedades alteradas com sucesso",
        icon: "success"
    });
  }

  function onClickAlterations(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if(!validations())
        return;
    props.setPropriedades(localProprieties);
    
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
      <span>
        <label>Rotação</label>
        <span>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="rotacao X"
            placeholder="X"
            value={localProprieties.rotacao?.X}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="rotacao Y"
            placeholder="Y"
            value={localProprieties.rotacao?.Y}
          ></input>
          <input
            className="form-input"
            onChange={onChangeProps}
            name="rotação Z"
            placeholder="Z"
            value={localProprieties.rotacao?.Z}
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
                name="resolucaoCurva"
                placeholder="0"
                value={localProprieties.resolucaoCurva}
              ></input>
              
            </span>
          </span>
          <span style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
          <label>Resolução da superfície</label>
          <span>
              <input
                className="form-input"
                onChange={onChangeProps}
                name="resolucaoSuperficie X"
                placeholder="X"
                value={localProprieties.resolucaoSuperficie.X}
              ></input>
              <input
                className="form-input"
                onChange={onChangeProps}
                name="resolucaoSuperficie Y"
                placeholder="Y"
                value={localProprieties.resolucaoSuperficie.Y}
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
      <button onClick={onClickAlterations} className="btn btn-aplicar">Aplicar Alterações</button>
      <button onClick={onClick} className="btn">
        Gerar Superficie
      </button>

      <button className="btn btn-info" onClick={onClickInfo}>&#9432;</button>
    </form>
  );
}
