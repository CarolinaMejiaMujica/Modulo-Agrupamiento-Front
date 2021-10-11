import React from 'react';
import './App.css';
import {Helmet} from "react-helmet";
import Navbar from './components/Navbar';
import EspacioTiempo from './components/espacio-temporal';
import {BrowserRouter as Router} from 'react-router-dom';
import Tabla from './components/tabla';
import Agrupamiento from './components/agrupamiento';

function App(){

  const [state,setState] = React.useState({
    fechaIni: 'Wed Mar 05 2020 20:51:01 GMT-0500',
    fechaFin: 'Wed Sep 01 2021 20:00:01 GMT-0500',
    algoritmo: 0,
    departamentos: ['Todos','Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco',
    'Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios',
    'Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali'],
    valor:0,
    agrupamiento:0
  })

  const pasarDatos = (e) => {
    setState({
      fechaIni: e.fechaIni,
      fechaFin: e.fechaFin,
      algoritmo: e.algoritmo,
      departamentos: e.departamentos,
      valor:1,
      agrupamiento:1
    })
  }

  return(
    <Router>
      <Helmet>
        <style>{"body { background-color: #F6F7FF; }"}</style>
      </Helmet>
      <Navbar />
      <section className="contenido wrapper">
        <EspacioTiempo pasarDatos={pasarDatos}/>
        <Tabla estado={state}></Tabla>
        <Agrupamiento estado={state}/>
      </section>      
    </Router>
  );
}

export default App;