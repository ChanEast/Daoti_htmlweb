//var imported = document.createElement('script');
//imported.src = "js/modernizr.custom.js";
//document.head.appendChild(imported);
//imported.src = "js/classie.js";
//document.head.appendChild(imported);
//imported.src = "js/notificationFx.js";
//document.head.appendChild(imported);
document.write("<script src='../../js/jquery-3.2.1.min.js'></script>");
document.write("<script type='text/javascript' src='modernizr.custom.js'></script>");
document.write("<script type='text/javascript' src='classie.js'></script>");
document.write("<script type='text/javascript' src='notificationFx.js'></script>");
$.getScript("plug-ins/js/modernizr.custom.js");
$.getScript("plug-ins/js/classie.js");
$.getScript("plug-ins/js/notificationFx.js");
var showMessage = "";

function setShowMessage(index) {
	showMessage = index;
	alert("success");
}
 
(function() {
	var bttn = document.getElementById('notification-trigger');

	// make sure..
	bttn.disabled = false;

	bttn.addEventListener('click', function() {
		// simulate loading (for demo purposes only)
		classie.add(bttn, 'active');
		setTimeout(function() {

			classie.remove(bttn, 'active');

			// create the notification
			var notification = new NotificationFx({
				message: showMessage,
				layout: 'growl',
				effect: 'jelly',
				type: 'notice', // notice, warning, error or success
				onClose: function() {
					bttn.disabled = false;
				}
			});

			// show the notification
			notification.show();

		}, 600);

		// disable the button (for demo purposes only)
		this.disabled = true;
	});
})();
