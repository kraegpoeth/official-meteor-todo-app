import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js'
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe("tasks");
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')){
      //if hide-completed is checked, filter tasks
      return Tasks.find({ checked: {$ne: true} }, {sort: {createdAt: -1} });
    }
    //otherwise, return all tasks
    return Tasks.find({}, {sort: {createdAt: -1} });
  },
  incompleteCount(){
    return Tasks.find({ checked: {$ne: true} }).count();
  },
});

Template.body.events({
  "submit .new-task": function(e){
    e.preventDefault();

    // get value from element
    const target = e.target;
    const text = target.text.value;

    //inser a task into the colleciton
    Meteor.call('tasks.insert', text);

    //clear form
    target.text.value = '';
  },

  'change .hide-completed input'(event, NULL, instance) {
    // a second NULL argument is passed because we have meteortoys installed
    // this can be see with: console.trace("change filter event - arguments: ", arguments);
    instance.state.set('hideCompleted', event.target.checked);

  },
});
