import React from 'react';
import './style.css';
import Img from '../src/assets/logo.svg';

export const App = () => {
  const [dados, setDados] = React.useState(null);
  const [loterica, setLoterica] = React.useState(null);
  const [sorteados, setSorteados] = React.useState(null);
  const [valueSelected, setValueSelected] = React.useState();

  React.useEffect(() => {
    fecthApi();
  }, []);

  const fecthApi = async () => {
    const response = await fetch(
      'https://brainn-api-loterias.herokuapp.com/api/v1/loterias',
    );
    const json = await response.json();
    setDados(json);
  };

  const fetchLoterica = async (e) => {
    const response = await fetch(
      'https://brainn-api-loterias.herokuapp.com/api/v1/loterias-concursos',
    );
    const json = await response.json();
    setLoterica(json[e].concursoId);
    setValueSelected(e);
  };

  const fetchConcurso = async () => {
    const response = await fetch(
      `https://brainn-api-loterias.herokuapp.com/api/v1/concursos/${loterica}`,
    );
    const json = await response.json();
    const { error } = await json;
    if (error) {
      return;
    }
    setSorteados(json);
  };
  React.useEffect(() => {
    fetchConcurso();
  }, [loterica]);

  const attNumeros = () => {
    const dados = sorteados.data.split('T');
    const dadosAtt = dados[0].replace(
      /([0-9]{4})[-]([0-9]{2})[-]([0-9]{2})/g,
      '$3/$2/$1',
    );
    return dadosAtt;
  };
  const style = () => {
    if (dados[valueSelected].nome === 'mega-sena') {
      return 'containerNavBar';
    }
    if (dados[valueSelected].nome === 'quina') {
      return 'containerNavBar1';
    }
    if (dados[valueSelected].nome === 'lotofácil') {
      return 'containerNavBar2';
    }
    if (dados[valueSelected].nome === 'lotomania') {
      return 'containerNavBar3';
    }
    if (dados[valueSelected].nome === 'timemania') {
      return 'containerNavBar4';
    }
    if (dados[valueSelected].nome === 'dia de sorte') {
      return 'containerNavBar5';
    }
  };

  if (!dados) return null;
  return (
    <div className="containerPage">
      <div className={dados[valueSelected] ? style() : 'containerNavBar'}>
        {' '}
        <select
          className="select"
          id="loterica"
          onChange={({ target }) => fetchLoterica(target.value)}
        >
          {dados.map((dado) => (
            <option key={dado.id} value={dado.id}>
              {dado.nome.toUpperCase()}
            </option>
          ))}
        </select>
        {valueSelected && (
          <p className="concursoName">
            <img style={{ paddingRight: '20px' }} src={Img} alt="IMG" />
            {dados[valueSelected].nome.toUpperCase()}
          </p>
        )}
        <div className="containerInfos">
          <div>
            <p className="concurso">CONCURSO</p>
            {sorteados && (
              <p className="concursoDados">
                {sorteados.id} - {attNumeros()}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="containerNumbers">
        {' '}
        {sorteados &&
          sorteados.numeros.map((numero) => (
            <p className="numbers" key={numero}>
              {numero}
            </p>
          ))}
      </div>
    </div>
  );
};
