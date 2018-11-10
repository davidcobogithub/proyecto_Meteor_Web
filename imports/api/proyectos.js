import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const ProyectosCollection = new Mongo.Collection('proyectos');

Meteor.methods({
    'proyectos.insert'(task) {
   
        ProyectosCollection.insert(task);
        alert("Se agregó nuevo proyecto correctamente");
    },
    'proyectos.update'(taskId, task) {

        ProyectosCollection.update(taskId, task);
        alert("Se agregó nueva tarea correctamente")
    },
});