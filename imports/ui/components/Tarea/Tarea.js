import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';

class Tarea extends Component {

  constructor() {
    super();
    this.state = {

      nombreTarConst: "",
      descripcionTarConst: "",
      prioridadTarCons: ""
    }
  }

  getProyectos(e) {

    var proy = [];

    this.props.proyectosProps.forEach(doc => {

      proy.push(doc);
    });
    return proy;
  }

  onGuardar(e) {

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
      var usuarioId= localStorage.getItem("varSesionUsuarioName");
      proyects.forEach(doc => {

        if (doc.nombre === proyTar.nombre && proyTar.responsable_correo === usuarioId) {

          tarProyects = doc.tareas;
          tarProyects.push(tareaNueva);

          var proyectoModificar = {

            nombre: proyTar.nombre,
            descripcion: proyTar.descripcion,
            responsable: proyTar.responsable,
            responsable_correo: usuarioId,
            fecha_inicio: proyTar.fecha_inicio,
            fecha_fin: proyTar.fecha_fin,
            estado: proyTar.estado,
            tareas: tarProyects
          }

          Meteor.call('proyectos.update', proyTar._id, proyectoModificar);

        }
      });

      this.setState({

        nombreTarConst: "",
        descripcionTarConst: "",
        prioridadTarCons: ""
      });
    } else {
      this.mensaje("Para agregar una nueva tarea debe llenar todos los campos del formulario")
    }
  }

  convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  mensaje(msm) {

    alert(msm);
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

      return (
        <div className="login-page ng-scope ui-view" style={{ backgroundColor: "#F2F2F2" }}>
          <div className=" container " >

            <nav class="navbar navbar-expand-lg navbar-dark bg-dark  navbar-fixed-top ">
              <a className="nav-link" href="/proyectos"><img src="https://rawgit.com/start-react/ani-theme/master/build/c4584a3be5e75b1595685a1798c50743.png" className="user-avatar1" />  Management Tool</a>


              <ul className="navbar-nav ml-auto my-lg-0">

                <li className="nav-link1"> {usuarioId}&nbsp;&nbsp;
      <a className="nav-link" href="/login"><i className="fas fa-power-off"></i>LogOut</a>
                </li>
              </ul>

            </nav>
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

  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
  };
})(Tarea);