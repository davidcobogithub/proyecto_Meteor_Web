import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const ProyectosCollection = new Mongo.Collection('proyectos');
export const PersonasCollection = new Mongo.Collection('personas');

Meteor.methods({
    'proyectos.insert'(task) {
   
        ProyectosCollection.insert(task);
    },
    'proyectos.update'(taskId, task) {

        ProyectosCollection.update(taskId, task);
    },
    'personas.insert'(task) {
   
        PersonasCollection.insert(task);
    },
    'personas.update'(taskId, task) {

        PersonasCollection.update(taskId, task);
    },
});