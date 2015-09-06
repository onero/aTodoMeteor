aTodo = new Mongo.Collection('aTodo');

//  Server
if(Meteor.isServer){
  Meteor.publish('aTodo', function(){
    if(!this.userId){
      return aTodo.find();
    } else {
      return aTodo.find({userId: this.userId});
    }
  });
}

//  Client
if (Meteor.isClient) {
  Meteor.subscribe("aTodo");
  // Template Helpers
  Template.main.helpers({
    aTodo: function(){
      return aTodo.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.main.events({
    'submit .new-aTodo': function(event){
       var text = event.target.text.value;

       Meteor.call('addaTodo', text);

      //  Clear Form
      event.target.text.value= '';

      // Prevent Submit
       return false;
    },

    "click .toggle-checked": function(){
      Meteor.call('setChecked', this._id, !this.checked);
    },

      "click .delete-aTodo": function() {
        if (confirm('Are You Sure?')) {
            Meteor.call('deleteaTodo', this._id);
        }
      }
    });

    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });
}

// Meteor Methods
Meteor.methods({
  addaTodo:function(text){
     if(!Meteor.userId()){
       throw new Meteor.Error('Not authorized')
     }
     aTodo.insert({
       text: text,
       createdAt: new Date(),
       userId: Meteor.userId(),
       username: Meteor.user().username
     });
  },
  deleteaTodo: function(aTodoId) {
    if(!Meteor.userId()){
      throw new Meteor.Error('Not authorized');
    }
    aTodo.remove(aTodoId);
  },
  setChecked: function(aTodoId, setChecked) {
    if(!Meteor.userId()){
      throw new Meteor.Error('Not authorized');
    }
    aTodo.update(aTodoId, {$set: {checked: setChecked}});
  }
});
