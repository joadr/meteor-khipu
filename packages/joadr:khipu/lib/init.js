khipu = {};

khipu.config = {
	url: 'https://khipu.com/api/1.3/',
	receiver_id: '26618',
	secret: 'f078e5e44442591086ccdc9e81305eb22b99665d'
};

khipu.config.return_url = "http://conejitas1.meteor.com/khipu/return";
khipu.config.cancel_url = "http://conejitas1.meteor.com/khipu/cancel";

khipu.payments = new Mongo.Collection("khipuPayments");

khipu.logs = new Mongo.Collection("khipuLogs");