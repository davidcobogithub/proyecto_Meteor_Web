import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';

class Proyecto extends Component {

  constructor() {
    super();
    this.state = {

      resul: [],
      nombreProyConst: "",
      redir:null,
      msg:null
    }
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.value != "") {
      
    var item = [];

    var usuarioId= localStorage.getItem("varSesionUsuarioName");

    this.props.proyectosProps.forEach(element => {

      if (element.nombre.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()) && 
      element.responsable_correo === usuarioId) {
      
        item.push(element);
      }
      else{
     
        this.setState({
          msg: <p>No se encontraron proyectos con nombre {e.target.value}</p>,
          resul:[]

        });
      }
    
    });
   
      this.verificarProyectoEnRojo(item)
  }
  else{

    this.setState({
      resul: [],
      msg:null
    });
  }
  
  }

  verificarProyectoEnRojo(arre) {

    var arreglo = [];

    var date = new Date()
    var dateFormat = this.convertDateFormat(date.toLocaleDateString()).toString()
    
    arre.forEach(element => {

      this.setState({
        msg:null

      });

      if (element.estado !== "TERMINADO" &&
        element.fecha_fin < dateFormat) {

        arreglo.push(<li className="list-group-item barra-busqueda rojo">
          {"Nombre: " + element.nombre}
          <br />
          {"Fecha de Inicio: " + element.fecha_inicio}
          <br />
          {"Fecha de Entrega: " + element.fecha_fin}
          <br />
          {"Estado: " + element.estado}
          <br />
          <br />
          <button type="button" value={JSON.stringify(element)} className="btn btn-info" onClick={this.handleClickVerDetalles.bind(this)}>Ver Detalles</button>
        </li>);
      }
      else {

        arreglo.push(

          <li className="list-group-item barra-busqueda">
            {"Nombre: " + element.nombre}
            <br />
            {"Fecha de Inicio: " + element.fecha_inicio}
            <br />
            {"Fecha de Entrega: " + element.fecha_fin}
            <br />
            {"Estado: " + element.estado}
            <br />
            <br />
            <button type="button" value={JSON.stringify(element)} className="btn btn-info" onClick={this.handleClickVerDetalles.bind(this)}>Ver Detalles</button>
          </li>
        );

      }

    });

    this.setState({
      resul: arreglo
    });

  }

  handleClickVerDetalles(e) {

    var elem = JSON.parse(e.target.value)

    localStorage.setItem("nomProyecto", elem.nombre)
    localStorage.setItem("descProyecto", elem.descripcion)
    localStorage.setItem("responProyecto", elem.responsable)
    localStorage.setItem("correoResponProyecto", elem.responsable_correo)
    localStorage.setItem("fechaIniProyecto", elem.fecha_inicio)
    localStorage.setItem("fechaFinProyecto", elem.fecha_fin)
    localStorage.setItem("estadoProyecto", elem.estado)
    localStorage.setItem("tareasProyecto", JSON.stringify(elem.tareas))
    localStorage.setItem("proyectoNuevaTarea", JSON.stringify(elem))

    this.setState({
      redir: <Redirect to='/proyectoDetalles'/>
   
    });

  }

  convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId= localStorage.getItem("varSesionUsuarioName");


    return (
      <div className="Proyecto container">

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/proyectos"><i className="fas fa-wrench fa-2x"></i><i className="fas fa-toolbox fa-2x"></i> HOME Management Tool</a>

          <ul className="navbar-nav ml-auto my-lg-0">

            <li className="nav-item">
            {usuarioId}
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login"><i className="fas fa-power-off"></i> Cerrar Sesión</a>
            </li>

          </ul>

        </nav>

        <div className="form-group">
          <input type="text" className="form-control barra-busqueda" placeholder="Buscar Proyectos Por Nombre" name="nombreProyConst" value={this.state.nombreProyConst} 
            onChange={this.updateInput.bind(this)} />
          <br />
          {this.state.msg}
        </div>
        {this.state.resul.map(item => <div style={{display: 'inline-block'}} key={Math.random()}>{item}</div>)}
        <div className="form-group bajar">

          <a className="btn btn-primary btn-buscar" href="/proyectoNuevo">Agregar Nuevo Proyecto</a>
        </div>
        {this.state.redir}

      </div>
    );
    } else {
      return (
        <Redirect to="/login" />
      );
    }

  }
}

export default withTracker(() => {
  try {
    localStorage.setItem("varSesionUsuarioName", Meteor.user().emails[0].address)
  } catch (error) {
    
  }
  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
  };
})(Proyecto);


