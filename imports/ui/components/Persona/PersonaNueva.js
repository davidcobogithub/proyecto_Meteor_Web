import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { PersonasCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';
import { Alert } from 'react-bootstrap'

class PersonaNueva extends Component {

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

    if (this.state.nombrePersConst !== "" && this.state.fechaNacimientoPersConst !== "" && this.state.correoPersConst !== "" && this.state.cargoPersConst !== "") {

      var personaAgregar = {

        nombre: this.state.nombrePersConst,
        fecha_nacimiento: this.state.fechaNacimientoPersConst,
        correo: this.state.correoPersConst,
        cargo: this.state.cargoPersConst
      }

      var idPersona = localStorage.getItem("idPersona")
      var person = this.props.personaIdentificaProps;

      try {
        
        if (person[0]._id === idPersona) {
          Meteor.call('personas.update', person[0]._id, personaAgregar);
          this.setState({
            tipoAlerta: "success",
            mensajeAlerta: "Se modificó persona correctamente"
          });
          this.handleShowAlert();
  
          this.setState({
  
            nombrePersConst: "",
            fechaNacimientoPersConst: "",
            correoPersConst: "",
            cargoPersConst: "",
          });
        }
      } catch (error) {
        
        Meteor.call('personas.insert', personaAgregar);
        this.setState({
          tipoAlerta: "success",
          mensajeAlerta: "Se agregó nueva persona correctamente"
        });
        this.handleShowAlert();

        this.setState({

          nombrePersConst: "",
          fechaNacimientoPersConst: "",
          correoPersConst: "",
          cargoPersConst: "",
        });
      }

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
  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

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
              <h1>MANEJO DE PERSONAL</h1>
            </div>

            <div className="form-group ">
              <input type="text" className="form-control" placeholder="Nombre" name="nombrePersConst" value={this.state.nombrePersConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="row form-group">
              <div className="col-lg-4">
                <p> Fecha de Nacimiento</p>
              </div>
              <div className="col-lg-8">
                <input className="form-control" type="date" name="fechaNacimientoPersConst" value={this.state.fechaNacimientoPersConst} onChange={this.updateInput.bind(this)}></input>
              </div>
            </div>
            <div className="form-group ">
              <input type="text" className="form-control" placeholder="Correo" name="correoPersConst" value={this.state.correoPersConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <div className="form-group ">
              <input type="text" className="form-control" placeholder="Cargo" name="cargoPersConst" value={this.state.cargoPersConst}
                onChange={this.updateInput.bind(this)} />
            </div>
            <button className="btn btn-primary">Aceptar</button>
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

  var idPersona = localStorage.getItem("idPersona")

  return {
    proyectosProps: ProyectosCollection.find({}),
    personasProps: PersonasCollection.find({}),
    personaIdentificaProps: PersonasCollection.find({ _id: idPersona }).fetch(),
  };
})(PersonaNueva);