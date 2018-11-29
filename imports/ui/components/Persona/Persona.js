import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { ProyectosCollection } from '../../../api/proyectos.js';
import { PersonasCollection } from '../../../api/proyectos.js';
import { Meteor } from 'meteor/meteor';

class Personas extends Component {

  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {

      resul: [],
      nombreProyConst: "",
      redir: null,
      msg: null,
      show: false,
    }

  }

  componentWillReceiveProps() {

    this.mostrarProyectosDefault();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  mostrarProyectosDefault() {

    var item = [];

    this.props.personasProps.forEach(element => {

      item.push(element);

    });

    this.verificarProyectoEnRojo(item)

  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.value != "") {

      var item = [];

      this.props.personasProps.forEach(element => {

        if (element.nombre.trim().toLowerCase().includes(e.target.value.trim().toLowerCase())) {

          item.push(element);
        }
        else {

          this.setState({
            msg: <p>No se encontraron personas con nombre {e.target.value}</p>,
            resul: []

          });
        }

      });

      this.verificarProyectoEnRojo(item)
    }
    else {

      this.setState({
        resul: [],
        msg: null
      });

      this.mostrarProyectosDefault();
    }

  }

  verificarProyectoEnRojo(arre) {

    var arreglo = [];

    arre.forEach(element => {

      this.setState({
        msg: null

      });

      arreglo.push(

        <li className="list-group-item">
          {"Nombre: " + element.nombre}
          <br />
          {"Fecha de Nacimiento: " + element.fecha_nacimiento}
          <br />
          {"Correo: " + element.correo}
          <br />
          {"Cargo: " + element.cargo}
          <br />
          <br />

          <button type="button" value={JSON.stringify(element)} className="btn btn-info" onClick={this.handleClickVerDetalles.bind(this)}>Modificar</button>
        </li>
      );

    });

    this.setState({
      resul: arreglo
    });

  }

  handleClickVerDetalles(e) {

    var elem = JSON.parse(e.target.value)

    localStorage.setItem("idPersona", elem._id)
    localStorage.setItem("nomPersona", elem.nombre)
    localStorage.setItem("fechaPersona", elem.fecha_nacimiento)
    localStorage.setItem("correoPersona", elem.correo)
    localStorage.setItem("cargoPersona", elem.cargo)

    this.setState({

      redir: <Redirect to='/personaNueva' />

    });

  }

  handleGoPersonaNueva(e) {

    localStorage.setItem("idPersona", "")
    localStorage.setItem("nomPersona", "")
    localStorage.setItem("fechaPersona", "")
    localStorage.setItem("correoPersona", "")
    localStorage.setItem("cargoPersona", "")

    this.setState({

      redir: <Redirect to='/personaNueva' />

    });

  }

  render() {

    if (localStorage.getItem("varSesion") !== "") {

      var usuarioId = localStorage.getItem("varSesionUsuarioName");


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



          <div className="form-group">
            <input type="text" className="form-control barra-busqueda" placeholder="Buscar Personas Por Nombre" name="nombreProyConst" value={this.state.nombreProyConst}
              onChange={this.updateInput.bind(this)} />

            {this.state.msg}
          </div>

          {this.state.resul.map(item =>
            <div className="cuadros my-3 mr-3" style={{ display: 'inline-block' }} key={Math.random()}>{item}
            </div>)}
          <div className="form-group bajar">

            <button className="btn btn-primary btn-buscar" onClick={this.handleGoPersonaNueva.bind(this)}>Agregar Nueva Persona</button>
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
  
  Meteor.subscribe('findProyectos');
  Meteor.subscribe('findPersonas');

  return {
    proyectosProps: ProyectosCollection.find({}).fetch(),
    personasProps: PersonasCollection.find({})
  };
})(Personas);