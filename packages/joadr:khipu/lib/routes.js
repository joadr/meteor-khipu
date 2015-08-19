Router.map(function(){
	this.route('khipuButton', {
		path: '/testing',
		//where: 'server',
	});

	// Get khipu response
	this.route('serverFile', {
		path: '/khipu/receive/',
		//where: 'server',

		action: function () {
			var data = {
				notification_token: this.request.body.notification_token
			};

			Meteor.call('khipu_verify_payment_notification', data, function(error, response){
				if(!error && response != false){
					if(typeof khipu.verifiedPayment == 'function'){
						khipu.verifiedPayment(response);
					}
					this.response.end("confirmed transaction");
				}
			});
		}
	});

	// The place where you return when the transaction is made. WARNING: Doesn't mean that the person payed, there must be a check before asuming that
    this.route('khipuReturn', {
    	path: '/khipu/return'
    });

    // The place where people gets when they cancel the operation.
    this.route('khipuCancel', {
    	path: '/khipu/cancel'
    });

	// Here appears all payments
    this.route('payments', {
    	path: '/khipu/payments',
    	waitOn: function () {
    		return Meteor.subscribe('khipuPayments');
    	}
    });
});