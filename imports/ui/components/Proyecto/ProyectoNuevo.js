import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap'

class ProyectoNuevo extends Component {

  constructor() {
    super();

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);

    this.state = {

      nombreProyConst: "",
      descripcionProyConst: "",
      responsableProyCons: "",
      fechaIniProyCons: "",
      fechaFinProyCons: "",
      estadoProyConst: "",
      tareaProyConst: "",
      tareasAddProyCons: [],
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

  getTareas(e) {

    var tar = [];
    var tarNotDupli = [];

    this.props.proyectosProps.forEach(element => {
      element.tareas.forEach(item => {
        tar.push(item);
      });
    });

    tarNotDupli = this.removeDuplicates(tar, "nombre")

    return tarNotDupli;
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  componentWillMount() {

    var nombre = localStorage.getItem("nomProyecto")
    var descrip = localStorage.getItem("descProyecto")
    var respon = localStorage.getItem("responProyecto")
    var fechaIni = localStorage.getItem("fechaIniProyecto")
    var fechaFin = localStorage.getItem("fechaFinProyecto")
    var esta = localStorage.getItem("estadoProyecto")

    this.setState({

      nombreProyConst: nombre,
      descripcionProyConst: descrip,
      responsableProyCons: respon,
      fechaIniProyCons: fechaIni,
      fechaFinProyCons: fechaFin,
      estadoProyConst: esta
    });
  }


  onGuardar(e) {

    e.preventDefault();

    var usuarioId = localStorage.getItem("varSesionUsuarioName")

    if (this.state.nombreProyConst !== "" && this.state.descripcionProyConst !== "" && this.state.responsableProyCons !== "" && this.state.fechaIniProyCons !== "" && this.state.fechaFinProyCons !== "" && this.state.estadoProyConst !== "SELECCIONE ESTADO" && this.state.tareaProyConst !== "SELECCIONE TAREA") {

      if (this.state.fechaIniProyCons < this.state.fechaFinProyCons) {

        var tareasCol = this.getTareas(this);
      
        var tare = JSON.parse(localStorage.getItem("tareasProyecto"))

        tareasCol.forEach(item => {

          if (item.nombre === this.state.tareaProyConst) {

           tare.push(item)

          }

        });

        var pers = JSON.parse(localStorage.getItem("proyectoNuevaTarea"))

        var proyectoModificar = {

          nombre: this.state.nombreProyConst,
          descripcion: this.state.descripcionProyConst,
          responsable: this.state.responsableProyCons,
          responsable_correo: usuarioId,
          fecha_inicio: this.state.fechaIniProyCons,
          fecha_fin: this.state.fechaFinProyCons,
          estado: this.state.estadoProyConst,
          tareas: tare,
          personas:pers.personas
        }

        var idProy = localStorage.getItem("idProyecto")
        var proyec = this.props.proyectoIdentificaProps;

        try {

          if (proyec[0]._id === idProy) {

            Meteor.call('proyectos.update', proyec[0]._id, proyectoModificar);
            this.setState({
              tipoAlerta: "success",
              mensajeAlerta: "Se modificó proyecto correctamente"
            });
            this.handleShowAlert();

            this.setState({

              nombreProyConst: "",
              descripcionProyConst: "",
              responsableProyCons: "",
              fechaIniProyCons: "",
              fechaFinProyCons: "",
              estadoProyConst: "SELECCIONE ESTADO",
              tareaProyConst: "SELECCIONE TAREA"
            });

          }
        } catch (error) {

          var tareaNuevo=[];

          tareasCol.forEach(item => {

            if (item.nombre === this.state.tareaProyConst) {
  
              tareaNuevo.push(item)
  
            }
  
          });

          var proyectoAgregar = {

            nombre: this.state.nombreProyConst,
            descripcion: this.state.descripcionProyConst,
            responsable: this.state.responsableProyCons,
            responsable_correo: usuarioId,
            fecha_inicio: this.state.fechaIniProyCons,
            fecha_fin: this.state.fechaFinProyCons,
            estado: this.state.estadoProyConst,
            tareas: tareaNuevo,
  
          }

          Meteor.call('proyectos.insert', proyectoAgregar);
          this.setState({
            tipoAlerta: "success",
            mensajeAlerta: "Se agregó nuevo proyecto correctamente"
          });
          this.handleShowAlert();
          this.setState({

            nombreProyConst: "",
            descripcionProyConst: "",
            responsableProyCons: "",
            fechaIniProyCons: "",
            fechaFinProyCons: "",
            estadoProyConst: "SELECCIONE ESTADO",
            tareaProyConst: "SELECCIONE TAREA"

          });

        }

      }
      else {

        this.setState({
          tipoAlerta: "danger",
          mensajeAlerta: "La fecha de inicio no puede ser mayor a la fecha de entrega del proyecto"
        });
        this.handleShowAlert();
      }
    } else {

      this.setState({
        tipoAlerta: "warning",
        mensajeAlerta: "Para agregar un nuevo proyecto debe llenar todos los campos del formulario"
      });
      this.handleShowAlert();
    }
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId = localStorage.getItem("varSesionUsuarioName")

      var tareaRes = this.getTareas(this);
      var tareasOpt = tareaRes.map(task => {

        return <option key={Math.random()}>{task.nombre}</option>;

      });

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
              <h1>ADMINISTRACIÓN DE PROYECTOS</h1>
            </div>

            <div className="form-group ">
              <input type="text" className="form-control" placeholder="Nombre" name="nombreProyConst" value={this.state.nombreProyConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group">

              <input type="text" className="form-control" placeholder="Descripción" name="descripcionProyConst" value={this.state.descripcionProyConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Responsable" name="responsableProyCons" value={this.state.responsableProyCons}
                onChange={this.updateInput.bind(this)} />
            </div>

            <div className="row form-group">
              <div className="col-lg-4">
                <p> Fecha de Inicio</p>
              </div>
              <div className="col-lg-8">
                <input className="form-control" type="date" name="fechaIniProyCons" value={this.state.fechaIniProyCons} onChange={this.updateInput.bind(this)}></input>
              </div>
            </div>
            <div className="row form-group">
              <div className="col-lg-4">
                <p> Fecha de Entrega</p>
              </div>
              <div className="col-lg-8">
                <input className="form-control" type="date" name="fechaFinProyCons" value={this.state.fechaFinProyCons} onChange={this.updateInput.bind(this)}></input>
              </div>
            </div>
            <div className="form-group">
              <select className="form-control" name="estadoProyConst" value={this.state.estadoProyConst} onChange={this.updateInput.bind(this)}>
                <option>SELECCIONE ESTADO</option>
                <option>EN PROCESO</option>
                <option>TERMINADO</option>
              </select>
            </div>
            <div className="form-group">
              <select className="form-control" name="tareaProyConst" value={this.state.tareaProyConst} onChange={this.updateInput.bind(this)}>
                <option>SELECCIONE TAREA</option>
                {tareasOpt}
              </select>
            </div>
            <button className="btn btn-primary">Agregar</button>
            <br />
            <br />
          </form>
        </div>
      );
    }
    else {

      return (
        <Redirect to="/login" />
      );
    }
  }

}

export default withTracker(() => {

  var idProy = localStorage.getItem("idProyecto")

  Meteor.subscribe('findProyectos');
  Meteor.subscribe('findPersonas');
  
  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
    proyectoIdentificaProps: ProyectosCollection.find({ _id: idProy }).fetch(),
  };
})(ProyectoNuevo);