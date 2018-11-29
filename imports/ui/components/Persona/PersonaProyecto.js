import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { PersonasCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap'

class PersonaProyecto extends Component {

  constructor() {
    super();

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShowAlert = this.handleShowAlert.bind(this);

    this.state = {

      nombrePersConst: "",
      fechaNacimientoPersConst: "",
      correoPersConst: "",
      cargoPersConst: "",
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

  componentWillMount() {

    var nombre = localStorage.getItem("nomPersona")
    var fechaNaci = localStorage.getItem("fechaPersona")
    var cor = localStorage.getItem("correoPersona")
    var carg = localStorage.getItem("cargoPersona")

    this.setState({

      nombrePersConst: nombre,
      fechaNacimientoPersConst: fechaNaci,
      correoPersConst: cor,
      cargoPersConst: carg
    });
  }


  onGuardar(e) {

    e.preventDefault();

    if (this.state.nombrePersConst !== "SELECCIONE PERSONAL" && this.state.fechaNacimientoPersConst !== "" && this.state.correoPersConst !== "" && this.state.cargoPersConst !== "") {


      var proyTar = JSON.parse(localStorage.getItem("proyectoNuevaTarea"));
    var usuarioId = localStorage.getItem("varSesionUsuarioName")

      var personaAgregar = {

        nombre: this.state.nombrePersConst,
        fecha_nacimiento: this.state.fechaNacimientoPersConst,
        correo: this.state.correoPersConst,
        cargo: this.state.cargoPersConst
      }

      var tarProyects = [];
      var personasProyects = [];

      var proyects = this.getProyectos(this);
      var usuarioId = localStorage.getItem("varSesionUsuarioName");

      proyects.forEach(doc => {

        if (doc.nombre === proyTar.nombre) {

          tarProyects = doc.tareas;
        
          if (doc.personas) {

            personasProyects = doc.personas;
          personasProyects.push(personaAgregar);
          }else{
            personasProyects.push(personaAgregar);
          }
      
          var proyectoModificar = {

            nombre: proyTar.nombre,
            descripcion: proyTar.descripcion,
            responsable: proyTar.responsable,
            responsable_correo: usuarioId,
            fecha_inicio: proyTar.fecha_inicio,
            fecha_fin: proyTar.fecha_fin,
            estado: proyTar.estado,
            tareas: tarProyects,
            personas: personasProyects

          }

          Meteor.call('proyectos.update', proyTar._id, proyectoModificar);
          this.setState({
            tipoAlerta: "success",
            mensajeAlerta: "Se agregó nueva persona correctamente al proyecto"
          });
          this.handleShowAlert();
  
          this.setState({
  
            nombrePersConst: "SELECCIONE PERSONAL",
            fechaNacimientoPersConst: "",
            correoPersConst: "",
            cargoPersConst: "",
          });
        }
      });
    
    } else {

      this.setState({
        tipoAlerta: "warning",
        mensajeAlerta: "Para agregar una nueva persona debe llenar todos los campos del formulario"
      });
      this.handleShowAlert();
    }
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });

    this.props.personasProps.forEach(element => {

     if (e.target.value === element.nombre) {
       
      this.setState({
        nombrePersConst:element.nombre,
        fechaNacimientoPersConst: element.fecha_nacimiento,
        correoPersConst: element.correo,
        cargoPersConst: element.cargo
      });
     }
    
  });


  }

  getProyectos(e) {

    var proy = [];

    this.props.proyectosProps.forEach(doc => {

      proy.push(doc);
    });
    return proy;
  }

  getTareas(e) {

    var tar = [];
  
    this.props.personasProps.forEach(element => {

        tar.push(element.nombre);
      
    });

    return tar;
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId = localStorage.getItem("varSesionUsuarioName")
      var proyTar = JSON.parse(localStorage.getItem("proyectoNuevaTarea"));

      var alerta = null;
      if (this.state.showAlert) {

        alerta =
          <Alert className="alertas" bsStyle={this.state.tipoAlerta} onDismiss={this.handleDismiss}>
            <p>
              {this.state.mensajeAlerta}
            </p>

          </Alert>

      }

      var tareaRes = this.getTareas(this);
      var tareasOpt = tareaRes.map(task => {
      
        return <option key={Math.random()}>{task}</option>;

      });

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
              <h1>AGREGAR NUEVA PERSONA AL PROYECTO: {proyTar.nombre}</h1>
            </div>

            <div className="form-group ">

              <select className="form-control" name="tareaProyConst" value={this.state.tareaProyConst} onChange={this.updateInput.bind(this)}>
                <option>SELECCIONE PERSONAL</option>
                {tareasOpt}
              </select>
         
            </div>
            <div className="row form-group">
              <div className="col-lg-4">
                <p> Fecha de Nacimiento</p>
              </div>
              <div className="col-lg-8">
                <input className="form-control" readOnly type="date" name="fechaNacimientoPersConst" value={this.state.fechaNacimientoPersConst} onChange={this.updateInput.bind(this)}></input>
              </div>
            </div>
            <div className="form-group ">
              <input type="text" readOnly className="form-control" placeholder="Correo" name="correoPersConst" value={this.state.correoPersConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group ">
              <input type="text" readOnly className="form-control" placeholder="Cargo" name="cargoPersConst" value={this.state.cargoPersConst}
                onChange={this.updateInput.bind(this)} />
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

  Meteor.subscribe('findProyectos');
  Meteor.subscribe('findPersonas');

  return {
    proyectosProps: ProyectosCollection.find({}),
    personasProps: PersonasCollection.find({}).fetch(),

  };
})(PersonaProyecto);