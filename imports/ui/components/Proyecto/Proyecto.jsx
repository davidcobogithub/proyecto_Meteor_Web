import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'react-bootstrap'

class Proyecto extends Component {

  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {

      resul: [],
      nombreProyConst: "",
      redir:null,
      msg:null,
      show: false,
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
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

        arreglo.push(<li className="list-group-item rojo">
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

          <li className="list-group-item">
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
      show: true
    });

  }

  convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  render() {

    var nombre = localStorage.getItem("nomProyecto")
    var descrip = localStorage.getItem("descProyecto")
    var respon = localStorage.getItem("responProyecto")
    var responCorreo = localStorage.getItem("correoResponProyecto")
    var fechaIni = localStorage.getItem("fechaIniProyecto")
    var fechaFin = localStorage.getItem("fechaFinProyecto")
    var esta = localStorage.getItem("estadoProyecto")
    var tar = JSON.parse(localStorage.getItem("tareasProyecto"))

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId= localStorage.getItem("varSesionUsuarioName");


    return (
      <div className="login-page ng-scope ui-view"  style={{backgroundColor: "#F2F2F2"}}>

      <div className=" container " >

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark  navbar-fixed-top ">
          <a className="nav-link" href="/proyectos"><img src="https://rawgit.com/start-react/ani-theme/master/build/c4584a3be5e75b1595685a1798c50743.png" className="user-avatar1" />  Management Tool</a>
      
        
          <ul className="navbar-nav ml-auto my-lg-0">

            <li className="nav-link1"> {usuarioId}&nbsp;&nbsp;
              <a className="nav-link" href="/login"><i className="fas fa-power-off"></i>LogOut</a>
            </li>
          </ul>

        </nav>
      </div>

      <div className="form-group">
        <input type="text" className="form-control barra-busqueda" placeholder="Buscar Proyectos Por Nombre" name="nombreProyConst" value={this.state.nombreProyConst}
          onChange={this.updateInput.bind(this)} />
        
        {this.state.msg}
      </div>
      {this.state.resul.map(item =>
        <div className="cuadros my-3 mr-3" style={{ display: 'inline-block' }} key={Math.random()}>{item}
        </div>)}
      <div className="form-group bajar">

        <a className="btn btn-primary btn-buscar" href="/proyectoNuevo">Agregar Nuevo Proyecto</a>
      </div>

      <Modal show={this.state.show} onHide={this.handleClose}>
        <div >
          <Modal.Header >
            {/* <Modal.Title>REGISTRO A MANAGEMENT TOOL</Modal.Title> */}
            <button type="button" className="close" onClick={this.handleClose} data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>
        </div>
        <Modal.Body>
          
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
            <br />
            <div className="row alin-left">
              <div className="col-lg-4">
                Tareas:
      </div>
            </div>
            <div className="row alin-left">
              <div className="col-lg-12">
                <ul>
                  {tar.map(task => <li key={task.nombre}>Nombre: {task.nombre}<br />Descripción: {task.descripcion}<br />Prioridad: {task.prioridad} <br /> Fecha de Creación: {task.fecha_creacion} <br /><br /></li>)}
                </ul>
              </div>
            </div>
            <br />
            <br />
            <a className="btn btn-primary btn-agregar" href="/tareas">Agregar Nueva Tarea</a>
          
        </Modal.Body>

      </Modal>
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