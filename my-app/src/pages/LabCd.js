import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ImagemGrafico from "../components/ImagemGrafico";
import seta1 from "../assets/seta1.png";
import seta2 from "../assets/seta2.png";
import home from "../assets/home.png";
import GeradorPDF from "../components/GeradorPDF";
import "../styles/LabCd.css";

const LabCd = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    bituminous_matrix: "CAP-30/45",
    sieve_3_8: 80.8,
    sieve_4: 54.8,
    sieve_200: 7.6,
    nominal_maximum_size: 12.5,
    binder_content: 4.6,
    binder_viscosity: 360,
    penetration: 53,
    softening_point: 52,
    void_volume: 3.6,
  });

  const [graficos, setGraficos] = useState([]);
  const [mostrarImagens, setMostrarImagens] = useState(false);
  const [exibirFormulario, setExibirFormulario] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erroMensagem, setErroMensagem] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(true);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setDadosFormulario((prevDados) => ({
      ...prevDados,
      [name]: value,
    }));
  };

  const enviarDadosParaAPI = async (endpoint) => {
    try {
      const url = `/${endpoint}?bituminous_matrix=${dadosFormulario.bituminous_matrix}&sieve_3_8=${dadosFormulario.sieve_3_8}&sieve_4=${dadosFormulario.sieve_4}&sieve_200=${dadosFormulario.sieve_200}&nominal_maximum_size=${dadosFormulario.nominal_maximum_size}&binder_content=${dadosFormulario.binder_content}&binder_viscosity=${dadosFormulario.binder_viscosity}&penetration=${dadosFormulario.penetration}&softening_point=${dadosFormulario.softening_point}&void_volume=${dadosFormulario.void_volume}`;

      const resposta = await api.get(url, { responseType: "arraybuffer" });

      if (resposta.data) {
        const imagemBlob = new Blob([resposta.data], { type: "image/png" });

        setGraficos((prevGraficos) => [
          ...prevGraficos,
          { nome: endpoint, imagem: URL.createObjectURL(imagemBlob) },
        ]);
      } else {
        console.error("Resposta da API não contém imagem do gráfico.");
      }
    } catch (erro) {
      console.error("Erro ao enviar dados para a API:", erro);
      throw erro;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setGraficos([]);
      setMostrarImagens(false);
      setCarregando(true);
      setErroMensagem(null);

      await enviarDadosParaAPI("reduced-frequency");
      await enviarDadosParaAPI("low-frequency");
      await enviarDadosParaAPI("intermediate-frequency");
      await enviarDadosParaAPI("high-frequency");

      setMostrarImagens(true);
    } catch (erro) {
      console.error("Erro ao enviar dados para a API:", erro);
      setErroMensagem("Não foi possível fazer essa previsão");
    } finally {
      setCarregando(false);
      
      if (window.innerWidth <= 767) {
        setFormularioAberto(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setExibirFormulario(false);
      } else {
        setExibirFormulario(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="containerLabCd">
      <div className="headerLab">
        <button
          className="toggleFormButton"
          onClick={() => setFormularioAberto(!formularioAberto)}
        >
          <img src={formularioAberto ? seta2 : seta1} alt="setas"></img>
        </button>

        <Link to="/" className="buttonHome">
          <img src={home} alt="casa"></img>
          Home
        </Link>
      </div>
      <div className="containerForm">
        {formularioAberto && (
          <form onSubmit={handleSubmit}>
            <h1>Inputs</h1>
            <label>
              Bituminous matrix
              <select
                type="text"
                name="bituminous_matrix"
                value={dadosFormulario.bituminous_matrix}
                onChange={handleChange}
              >
                <option value="CAP-30/45">CAP-30/45</option>
                <option value="CAP-50/70">CAP-50/70</option>
              </select>
            </label>
            <label>
              Pass through sieve #3/8 (%)
              <input
                type="number"
                name="sieve_3_8"
                value={dadosFormulario.sieve_3_8}
                onChange={handleChange}
              />
            </label>
            <label>
              Pass through sieve #4 (%)
              <input
                type="number"
                name="sieve_4"
                value={dadosFormulario.sieve_4}
                onChange={handleChange}
              />
            </label>
            <label>
              Pass through sieve #200 (%)
              <input
                type="number"
                name="sieve_200"
                value={dadosFormulario.sieve_200}
                onChange={handleChange}
              />
            </label>
            <label>
              Nominal maximum size (mm)
              <input
                type="number"
                name="nominal_maximum_size"
                value={dadosFormulario.nominal_maximum_size}
                onChange={handleChange}
              />
            </label>
            <label>
              Binder content (%)
              <input
                type="number"
                name="binder_content"
                value={dadosFormulario.binder_content}
                onChange={handleChange}
              />
            </label>
            <label>
              Binder viscosity ()
              <input
                type="number"
                name="binder_viscosity"
                value={dadosFormulario.binder_viscosity}
                onChange={handleChange}
              />
            </label>
            <label>
              Penetration
              <input
                type="number"
                name="penetration"
                value={dadosFormulario.penetration}
                onChange={handleChange}
              />
            </label>
            <label>
              Softening point
              <input
                type="number"
                name="softening_point"
                value={dadosFormulario.softening_point}
                onChange={handleChange}
              />
            </label>
            <label>
              Void volume (%)
              <input
                type="number"
                name="void_volume"
                value={dadosFormulario.void_volume}
                onChange={handleChange}
              />
            </label>
            <button className="buttonEnviar" type="submit">
              Fazer Previsão
            </button>
          </form>
        )}

        {carregando && <div className="loading"></div>}
        {erroMensagem && <div className="erro-mensagem">{erroMensagem}</div>}

        <div>
          {mostrarImagens && !carregando && (
            <div>
              {graficos.map((grafico) => (
                <div key={grafico.nome} className="graficos">
                  <h2>{grafico.nome}</h2>
                  <ImagemGrafico url={grafico.imagem} />
                </div>
              ))}
            </div>
          )}
          {mostrarImagens && !carregando && (
            <GeradorPDF dadosFormulario={dadosFormulario} graficos={graficos} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LabCd;
