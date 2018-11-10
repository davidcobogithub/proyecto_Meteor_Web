import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';

class ProyectoDetalles extends Component {

  constructor() {
    super();
  
  }

  render() {

    if(localStorage.getItem("varSesion")!==""){

      var usuarioId = localStorage.getItem("varSesionUsuarioName")

    var nombre = localStorage.getItem("nomProyecto")
    var descrip = localStorage.getItem("descProyecto")
    var respon = localStorage.getItem("responProyecto")
    var responCorreo = localStorage.getItem("correoResponProyecto")
    var fechaIni = localStorage.getItem("fechaIniProyecto")
    var fechaFin = localStorage.getItem("fechaFinProyecto")
    var esta = localStorage.getItem("estadoProyecto")
    var tar = JSON.parse(localStorage.getItem("tareasProyecto"))

    if (nombre != null && fechaIni != null) {

      return (

        <div className="ProyectoDetalles container">
        
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

          <li className="list-group-item barra-busqueda">
            <div className="row alin-left">
              <div className="col-lg-4">
                Nombre:
          </div>
              <div className="col-lg-8">
                {nombre}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Descripción:
          </div>
              <div className="col-lg-8">
                {descrip}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Responsable:
          </div>
              <div className="col-lg-8">
                {respon}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Correo:
          </div>
              <div className="col-lg-8">
                {responCorreo}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Fecha de Inicio:
          </div>
              <div className="col-lg-8">
                {fechaIni}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Fecha de Entrega:
          </div>
              <div className="col-lg-8">
                {fechaFin}
              </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-4">
                Estado:
          </div>
              <div className="col-lg-8">
                {esta}
              </div>
            </div>
            <br/>
            <div className="row alin-left">
              <div className="col-lg-4">
                Tareas:
          </div>
            </div>
                    <div className="row alin-left">
              <div className="col-lg-12">
                <ul>
                  {tar.map(task => <li key={task.nombre}>Nombre: {task.nombre}<br/>Descripción: {task.descripcion}<br/>Prioridad: {task.prioridad} <br/> Fecha de Creación: {task.fecha_creacion} <br/><br/></li>)}
                </ul>
              </div>
            </div>
            <br />
          <br />
            <a className="btn btn-primary btn-agregar" href="/tareas">Agregar Nueva Tarea</a>
          </li>

                </div>
      );

    } 
    
  }else{
    return(
      <Redirect to="/login"/>
      );
  }
  }
}

export default withTracker(() => {

  return {
    userLoggin:Meteor.user()
  };
})(ProyectoDetalles);
