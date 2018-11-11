import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import { Modal } from 'react-bootstrap'

class Login extends Component {

  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);


    localStorage.setItem("varSesion", "")

    this.state = {

      usuarioConst: "",
      passwordConst: "",
      usuarioConstModal: "",
      passwordConstModal: "",
      usuariosConst: [],
      redir: null,
      registro: null,
      show: false,
    }

  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleIngresarSistema(e) {

    if (Meteor.isClient) {

      var emailVar = this.state.usuarioConst;
      var passwordVar = this.state.passwordConst;

      if (emailVar !== "" && passwordVar !== "") {

        Meteor.loginWithPassword(emailVar, passwordVar, function (error) {
          localStorage.setItem("varia", null)
          if (error) {
            alert(error.reason);
            return;
          } else {
            localStorage.setItem("varia", null)
            localStorage.setItem("varia", JSON.stringify(Meteor.user()))
          }
        }
        );
      } else {
        this.mensaje("Error, debe completar todos los campos")
        localStorage.setItem("varia", null)
      }
    }
  }

  ingresoLogin(e) {
    e.preventDefault();
    this.handleIngresarSistema(e)

    var res = JSON.parse(localStorage.getItem("varia"))

    if (res != null) {
      localStorage.setItem("varSesion", res._id)
      this.setState({
        redir: <Redirect to='/proyectos' />
        // redir: <Redirect to='https://tallermeteorproy.herokuapp.com/proyectos' />

      });

    }
  }

  handleClickAceptarRegistro(e) {

    if (Meteor.isClient) {

      e.preventDefault();

      if (this.state.usuarioConstModal !== "" && this.state.passwordConstModal !== "") {

        if (this.state.usuarioConstModal.includes("@")) {

          var emailVar = this.state.usuarioConstModal;
          var passwordVar = this.state.passwordConstModal;

          Accounts.createUser({
            email: emailVar,
            password: passwordVar
          });
          this.mensaje("Se ha creado nuevo usuario")
          this.handleClose();
          this.setState({
            redir: <Redirect to='/login' />

          });
        } else {
          this.mensaje("El usuario no tiene el formato de correo, xxx@dominio.com")
        }
      }
      else {
        this.mensaje("Debes completar los campos para registrar nuevo usuario")
      }
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

    return (
      // <div className="Login">


      <div className="login-page ng-scope ui-view" style={{ backgroundImage: "url(  http://www.ormeco.com.co/wp-content/uploads/2015/06/GERENCIA-DE-PROYECTOS.jpg  )" }}>
        <div className="row">
          <div className="col-md-4 col-lg-4 col-md-offset-4 col-lg-offset-4">
            <img src="https://rawgit.com/start-react/ani-theme/master/build/c4584a3be5e75b1595685a1798c50743.png" className="user-avatar" />
            <h1 style={{ color: "white", fontWeight: "800" }}>Management Tool</h1>
            <form role="form" className="ng-pristine ng-valid">
              <div className="form-content">
                <div className="form-group">
                  <input type="text" className="form-control  input-lg" placeholder="Usuario" name="usuarioConst" value={this.state.usuarioConst}
                    onChange={this.updateInput.bind(this)} />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control  input-lg" placeholder="Contraseña" name="passwordConst" value={this.state.passwordConst}
                    onChange={this.updateInput.bind(this)} />
                </div>
              </div>
              <button className="btn btn-white btn-outline btn-lg btn-rounded" onClick={this.ingresoLogin.bind(this)}>Ingresar</button>

            </form>
            <br />
            <button className="btn btn-white btn-outline btn-lg btn-rounded" onClick={this.handleShow}>Registrar</button>
          </div>
        </div>
        {/* <h1>BIENVENIDO A MANAGEMENT TOOL</h1>
        <br />
        <br />
        <br />
        <form>
          <div className="form-group">

            <input type="text" className="form-control" placeholder="Usuario" name="usuarioConst" value={this.state.usuarioConst}
              onChange={this.updateInput.bind(this)} />
          </div>

          <div className="form-group">

            <input type="password" className="form-control" placeholder="Contraseña" name="passwordConst" value={this.state.passwordConst}
              onChange={this.updateInput.bind(this)} />
          </div>
          <button className="btn btn-primary btn-lg" onClick={this.ingresoLogin.bind(this)}>Ingresar</button>
        </form>
        <br />
        <button className="btn btn-primary btn-lg" onClick={this.handleShow}>Registrar</button> */}

        <Modal show={this.state.show} onHide={this.handleClose}>
          <div >
            <Modal.Header >
              <Modal.Title>REGISTRO A MANAGEMENT TOOL</Modal.Title>
              <button type="button" className="close" onClick={this.handleClose} data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Modal.Header>
          </div>
          <Modal.Body>
            <form>
              <div className="form-group">

                <input type="text" className="form-control" placeholder="Usuario" name="usuarioConstModal" value={this.state.usuarioConstModal}
                  onChange={this.updateInput.bind(this)} />
              </div>

              <div className="form-group">

                <input type="password" className="form-control" placeholder="Contraseña" name="passwordConstModal" value={this.state.passwordConstModal}
                  onChange={this.updateInput.bind(this)} />
              </div>
              <button className="btn btn-primary" onClick={this.handleClickAceptarRegistro.bind(this)}>Aceptar</button>

            </form>
          </Modal.Body>

        </Modal>

        {this.state.registro}
        {this.state.redir}
      </div>
    );
  }
}

export default Login;