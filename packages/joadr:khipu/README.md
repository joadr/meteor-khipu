# English:
## Khipu package for meteor projects
This package contains everything you need to receive money on your bank account using Khipu
Developed by Joaquín Díaz (Joadr)

## Configuration
In a Server folder add the following lines and complete the the values
```
khipu.config = {
	url: 'https://khipu.com/api/1.3/', //Khipu api (leave it like this unless you know what you are doing)
	receiver_id: '', // Your receiver ID in khipu
	secret: '', // Your Secret Key
}
```

## Optional Configuration
In the previous object you can add the following lines in order to override some default settings.

### Return URL
The return url is the url where the user is taken once he completed the transaction, but remember, this doesn't mean that the payment is ready and confirmed, the user just completed the process
```javascript
	return_url: 'http://mysite.com/returnURL',
```

### Cancel URL
The cancel url is the url where the user is taken if he decides to cancel in the middle of the process.
```javascript
	cancel_url: 'http://mysite.com/cancelURL',
```

### Notify URL
The notify url is the url where khipu sends the notification that the payment has been successfully paid, here you can say for sure that you have the money in your bank account.
This package will automatically setup your khipu account in order to receive notification correctly.
DO NOT CHANGE THIS CONFIGURATION UNLESS YOU KNOW WHAT YOU ARE DOING
```javascript
	notify_url: 'http://mysite.com/notifyURL',
```

## Payment Verification
When khipu sends you the payment confirmation, the internal collection gets updated (khipuPayments), updating the transaction_id record as paid. In case the developer wants to do something with this transaction like providing a service or giving a product, the developer must define a function that will receive the transaction_id as a parameter. The function must be defined this way:
```javascript
	khipu.verifiedPayment = function(transaction_id){
		// do something with the transaction for example get the payed amount or find who paid it.
		payment = khipuPayments.findOne({transaction_id: transaction_id});
		if(payment){
			amount = payment.amount;
			// do something with this
		}
	};
```

======

# Español:
## Extensión Khipu para proyectos meteor
Esta extensión tiene todo lo que necesitas para recibir dinero en tu cuenta bancaria usando Khipu
Desarrollado por Joaquín Díaz (Joadr)

## Configuración
En la carpeta "Server" de tu proyecto, crea un archivo y escribe las siguientes líneas y cambia los valores según corresponda
```javascript
khipu.config = {
	url: 'https://khipu.com/api/1.3/', //Khipu api (leave it like this unless you know what you are doing)
	receiver_id: '', // Your receiver ID in khipu
	secret: '', // Your Secret Key
}
```
## Configuración opcional:
En el objeto khipu.config además puedes agregar los siguientes parámetros, los cuales son opcionales ya que sobrescriben configuraciones por defecto.

### Return URL
El return url es el url donde el usuario será mandado una vez haya terminado la transacción. ESTO NO SIGNIFICA QUE EL USUARIO HA PAGADO CORRECTAMENTE, sólo significa que siguió todos los pasos, aún falta la confirmación del pago.
```javascript
	return_url: 'http://mysite.com/returnURL',
```
### Cancel URL
El cancel_url corresponde al url al cual se va a enviar al cliente en caso de que cancele la operación de pago.
```javascript
	cancel_url: 'http://mysite.com/cancelURL',
```

### Notify URL
El notify url  corresponde al url al cual khipu mandará la notificación de que un pago ha sido confirmado por lo que recien en este punto se puede saber con certeza de que contienes el dinero en tu banco.
Este package configurará automáticamente tu cuenta khipu para que envíe las notificaciones al este url por lo que no es necesario hacerlo de forma manual.
NO CAMBIES ESTA CONFIGURACIÓN A MENOS QUE SEPAS EXACTAMENTE LO QUE ESTÁS HACIENDO.
```javascript
	notify_url: 'http://mysite.com/notifyURL',
```

## Diagrama de flujo
Las transacciones en khipu tienen un flujo de 5 pasos los cuales corresponden a:
![alt text](https://s3.amazonaws.com/static.khipu.com/flujo-pago.png "Diagrama flujo")

## Verificación del pago:
Cuando khipu te envía la confirmación de pago, se actualiza la base de datos interna (KhipuPayments) poniendo el transaction_id como pagado. En caso de que el desarrollador desee hacer algo una vez se haya confirmado el pago, como proveer un servicio o enviar un producto, debe definir una función que recibirá como parámetro el transaction_id. Por lo que debe ser definida de la siguiente forma:
```javascript
	khipu.verifiedPayment = function(transaction_id){
		// do something with the transaction for example get the payed amount or find who paid it.
		payment = khipuPayments.findOne({transaction_id: transaction_id});
		if(payment){
			amount = payment.amount;
			// do something with this
		}
	};
```

