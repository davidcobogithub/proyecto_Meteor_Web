import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap'

class TareaNueva extends Component {

  constructor() {
    super();

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);

    this.state = {

      nombreTarConst: "",
      descripcionTarConst: "",
      prioridadTarCons: "",
      showAlert: false,
      tipoAlerta: "info",
      mensajeAlerta: ""
    }
  }


  handleDismiss() {
    this.setState({ showAlert: false });
  }

  handleShowAlert() {
    this.setState({ showAlert: true });


    setTimeout(function () {
      this.setState({ showAlert: false });
    }.bind(this), 8000);


  }

  getProyectos(e) {

    var proy = [];

    this.props.proyectosProps.forEach(doc => {

      proy.push(doc);
    });
    return proy;
  }

  onGuardar(e) {

    e.preventDefault();

    var proyTar = JSON.parse(localStorage.getItem("proyectoNuevaTarea"));
    var usuarioId = localStorage.getItem("varSesionUsuarioName")

    if (this.state.nombreTarConst !== "" && this.state.descripcionTarConst !== ""
      && this.state.prioridadTarCons !== "SELECCIONE PRIORIDAD") {

      var date = new Date()
      var dateFormat = this.convertDateFormat(date.toLocaleDateString()).toString()

      var tareaNueva = {

        nombre: this.state.nombreTarConst,
        descripcion: this.state.descripcionTarConst,
        prioridad: this.state.prioridadTarCons,
        fecha_creacion: dateFormat
      }

      var tarProyects = [];
      var proyects = this.getProyectos(this);
      var usuarioId = localStorage.getItem("varSesionUsuarioName");

      var personasProyects = [];
      
      proyects.forEach(doc => {

        if (doc.nombre === proyTar.nombre && proyTar.responsable_correo === usuarioId) {

          tarProyects = doc.tareas;
          tarProyects.push(tareaNueva);
          
          personasProyects = doc.personas;

          var proyectoModificar = {

            nombre: proyTar.nombre,
            descripcion: proyTar.descripcion,
            responsable: proyTar.responsable,
            responsable_correo: usuarioId,
            fecha_inicio: proyTar.fecha_inicio,
            fecha_fin: proyTar.fecha_fin,
            estado: proyTar.estado,
            tareas: tarProyects,
            personas:personasProyects
          }

          

          Meteor.call('proyectos.update', proyTar._id, proyectoModificar);
          this.setState({
            tipoAlerta: "success",
            mensajeAlerta: "Se agregó nueva tarea correctamente"
          });
          this.handleShowAlert();

        }
      });

      this.setState({

        nombreTarConst: "",
        descripcionTarConst: "",
        prioridadTarCons: ""
      });
    } else {

      this.setState({
        tipoAlerta: "warning",
        mensajeAlerta: "Para agregar una nueva tarea debe llenar todos los campos del formulario"
      });
      this.handleShowAlert();
    }
  }

  convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var proyTar = JSON.parse(localStorage.getItem("proyectoNuevaTarea"));
      var usuarioId = localStorage.getItem("varSesionUsuarioName")


      var alerta = null;
      if (this.state.showAlert) {

        alerta =
          <Alert className="alertas" bsStyle={this.state.tipoAlerta} onDismiss={this.handleDismiss}>
            <p>
              {this.state.mensajeAlerta}
            </p>

          </Alert>

      }

      return (
        <div className="login-page ng-scope ui-view" style={{ backgroundColor: "#F2F2F2" }}>
          <div className=" container " >

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark  navbar-fixed-top ">
              <a className="nav-link" href="/proyectos"><img src="https://rawgit.com/start-react/ani-theme/master/build/c4584a3be5e75b1595685a1798c50743.png" className="user-avatar1" />  Management Tool</a>
              
              <a className="nav-link" href="/personas">Personal</a>

              <ul className="navbar-nav ml-auto my-lg-0">

                <li className="nav-link1"> {usuarioId}&nbsp;&nbsp;
      <a className="nav-link" href="/login"><i className="fas fa-power-off"></i>LogOut</a>
                </li>
              </ul>

            </nav>
          </div>

          <div className="row" style={{ float: "right", marginTop: "70px" }}>

            {alerta}

          </div>

          <form className="form-nuevoProy" onSubmit={this.onGuardar.bind(this)}>

            <div>
              <h1>Agregar Tareas Para: {proyTar.nombre} </h1>
            </div>

            <div className="form-group">
              <input type="text" className="form-control" placeholder="Nombre" name="nombreTarConst" value={this.state.nombreTarConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group">

              <input type="text" className="form-control" placeholder="Descripción" name="descripcionTarConst" value={this.state.descripcionTarConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group">
              <select className="form-control" name="prioridadTarCons" value={this.state.prioridadTarCons} onChange={this.updateInput.bind(this)}>
                <option>SELECCIONE PRIORIDAD</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <button className="btn btn-primary">Agregar</button>

          </form>
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

  Meteor.subscribe('findProyectos');


  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
  };
})(TareaNueva);