Template.payments.helpers({
	pagos: function() {
        var pagos = khipu.payments.find().fetch();
        return pagos;
    }
});
