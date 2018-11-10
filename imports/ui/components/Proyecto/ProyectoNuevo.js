import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';

class ProyectoNuevo extends Component {

  constructor() {
    super();
    this.state = {

      nombreProyConst: "",
      descripcionProyConst: "",
      responsableProyCons: "",
      fechaIniProyCons: "",
      fechaFinProyCons: "",
      estadoProyConst: "",
      tareaProyConst: "",
      tareasAddProyCons: []
    }

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

  onGuardar(e) {

    var usuarioId = localStorage.getItem("varSesionUsuarioName")

    if (this.state.nombreProyConst !== "" && this.state.descripcionProyConst !== "" && this.state.responsableProyCons !== "" && this.state.fechaIniProyCons !== "" && this.state.fechaFinProyCons !== "" && this.state.estadoProyConst !== "SELECCIONE ESTADO" && this.state.tareaProyConst !== "SELECCIONE TAREA") {

      if (this.state.fechaIniProyCons < this.state.fechaFinProyCons) {

        var tareasCol = this.getTareas(this);

        tareasCol.forEach(item => {

          if (item.nombre === this.state.tareaProyConst) {

            this.state.tareasAddProyCons.push(item)

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
          tareas: this.state.tareasAddProyCons
        }

        Meteor.call('proyectos.insert', proyectoAgregar);

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
      else {
        this.mensaje("La fecha de inicio no puede ser mayor a la fecha de entrega del proyecto")
      }
    } else {
      this.mensaje("Para agregar un nuevo proyecto debe llenar todos los campos del formulario")
    }
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  mensaje(msm) {

    alert(msm);
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId = localStorage.getItem("varSesionUsuarioName")

      var tareaRes = this.getTareas(this);
      var tareasOpt = tareaRes.map(task => {

        return <option key={task.nombre}>{task.nombre}</option>;

      });

      return (
        <div className="ProyectoNuevo container">
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
          <form className="form-nuevoProy" onSubmit={this.onGuardar.bind(this)}>

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

  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
  };
})(ProyectoNuevo);
