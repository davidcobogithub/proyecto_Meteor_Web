import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Proyecto from './Proyecto/Proyecto';
import ProyectoNuevo from './Proyecto/ProyectoNuevo';
import Tarea from './Tarea/Tarea'
import Login from './Login/Login'

const AppRoutes = () =>
    <Switch>
     
     {/* <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/proyectos"  component={Proyecto}/>
      <Route exact path="/proyectoNuevo" component={ProyectoNuevo}/>
      <Route exact path="/tareas" component={Tarea}/> */}

       <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path={process.env.PUBLIC_URL +'/proyectos'}  component={Proyecto}/>
      <Route exact path={process.env.PUBLIC_URL +'/proyectoNuevo'} component={ProyectoNuevo}/>
      <Route exact path={process.env.PUBLIC_URL +'/tareas'} component={Tarea}/>
    
    </Switch>
export default AppRoutes;