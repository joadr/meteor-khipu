Template.banks.helpers({
	banks: function () {
		Meteor.call('khipu_get_banks', function(error, response){
			Session.set('banks', JSON.parse(response).banks);
		})
		return Session.get('banks');
	}
});

Template.banks.events({
	'click #sendBank': function(){
		
	}
});
