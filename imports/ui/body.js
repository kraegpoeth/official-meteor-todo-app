import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './body.html';
import './task.html'

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
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

    //insert task to Collection
    Tasks.insert({
      text,
      createdAt: new Date(),
    });

    //clear form
    target.text.value = '';
  },

  'change .hide-completed input'(event, instance) {
    console.log("change filter event - arguments: ", arguments);
    console.trace("change filter event - arguments: ", arguments);
    instance.state.set('hideCompleted', event.target.checked);

  },
});
