if(Meteor.isServer){
	Meteor.methods({
		// Check if the receiver is ready.
		khipu_check_cobrador_state: function(){
			var data = {
				receiver_id : khipu.config.receiver_id
			}

			var response = Meteor.call('khipu_do_call_json', 'receiverStatus', data);
			return response;
		},

		// Get available banks list
		khipu_get_banks: function(){
			var data = {
				receiver_id : khipu.config.receiver_id
			}

			var response = Meteor.call('khipu_do_call_json', 'receiverBanks', data);
			return response;
		},

		// Tell khipu that they're going to receive a payment (with the needed data)
		khipu_get_new_payment: function(email, bankId, amount, subject, body, transaction_id){

			transaction_id = typeof transaction_id !== 'undefined' ? transaction_id : Math.random().toString(36).substring(7).toLowerCase();

			if( khipu.payments.find({transaction_id: transaction_id}).fetch().length >= 1 ){
				console.log("die at",0);
				return false;
			}

			// Defaults:
			var return_url = typeof khipu.config.return_url !== 'undefined' ? khipu.config.return_url : process.env.ROOT_URL+'/khipu/return';
			var cancel_url = typeof khipu.config.cancel_url !== 'undefined' ? khipu.config.cancel_url : process.env.ROOT_URL+'/khipu/cancel';
			var picture_url = typeof khipu.config.picture_url !== 'undefined' ? khipu.config.picture_url : '';

			var data = {
				receiver_id: khipu.config.receiver_id,
				subject: subject,
				body: body,
				amount: amount,
				payer_email: email,
				bank_id: 'Bawdf',
				expires_date: '',
				transaction_id: transaction_id,
				custom: email,
				notify_url: '',
				return_url: return_url,
				cancel_url: cancel_url,
				picture_url: picture_url,
			}

			var response = Meteor.call('khipu_do_call_json', 'createPaymentURL', data);
			response = JSON.parse(response);
			if(response && typeof response.error == "undefined"){
				data.khipu_id = response.id;
				data.bill_id = response['bill-id'];
				data.url = response.url;
				data.manual_url = response['manual-url'];
				data.mobile_url = response['mobile-url'];
				data.ready_for_terminal = response['ready-for-terminal'];
				data.payed = 'false';

				var payment = khipu.payments.insert(data);

				var respuesta = { data: {
					"id": data.khipu_id,
					"bill-id": data.bill_id,
					"url": data.url,
					"manual_url": response['manual-url'],
					"mobile_url": response['mobile-url'],
					"ready-for-terminal": response['ready-for-terminal']
					//"ready-for-terminal": true
				}, transaction_id: transaction_id };
				console.log("got here:", respuesta);
				return respuesta;
			} else {
				console.log("die at",1);
				return false;
			}
		},

		// Receive the payment confirmation and check if it's correct (returns object)
		khipu_verify_payment_notification: function(data){
			var newData = {
				receiver_id: khipu.config.receiver_id,
				notification_token: data.notification_token
			};

			var response = Meteor.call('khipu_do_call_json', 'getPaymentNotification', newData);
			response = JSON.parse(response);

			if(response.notification_token != newData.notification_token || response.receiver_id != newData.receiver_id){
				return false;
			}

			var transaction = khipu.payments.findOne({transaction_id: response.transaction_id});


			if(transaction.amount == response.amount){
				khipu.payments.update(transaction._id, { $set: {payed: true} });
				return transaction_id;
			} else {
				return false;
			}
		},

		update_payment_notification_url: function(){

			var url = typeof khipu.config.notify_url !== 'undefined' ? khipu.config.notify_url : process.env.ROOT_URL+'/khipu/receive/';

			var data = {
				receiver_id: khipu.config.receiver_id,
				url: url,
				api_version: '1.3'
			};

			return Meteor.call('khipu_do_call_json', 'updatePaymentNotificationUrl', data);
		},

		// Send Khipu a HTTP Request
		khipu_do_call_json: function(url, data, doHash){
			// Hash requested by default
			doHash = typeof doHash !== 'undefined' ? doHash : true;

			// Data is serialized this way (receiver_id=1234&amount=1&...)
			var serialized = Meteor.call('serialize', data);

			// Hash is calculated with the serialized data and the secret key (only if requested)
			if(doHash){
				var hash = CryptoJS.HmacSHA256(serialized, khipu.config.secret).toString();
				// the hash is now sent with the data
				data.hash = hash;
			}


			this.unblock();
			// We call the ...

			try{
				var result = HTTP.call('POST', khipu.config.url+url, {data: data});
				result.url = url;
				khipu.logs.insert(result);
				return result.content;
			} catch(e){
				e.error = true;
				e.date = new Date();
				khipu.logs.insert(e);
				return false;
			}
		},

		// Added function to serialize an object
		serialize: function(obj){
			var str = "";
			for (var key in obj) {
			    if (str != "") {
			        str += "&";
			    }
			    str += key + "=" + obj[key];
			}
			return str;
		}
	});
}

Meteor.publish('khipuPayments', function(){
	return khipu.payments.find();
});

Meteor.publish('khipuLogs', function(){
	return khipu.logs.find();
});
