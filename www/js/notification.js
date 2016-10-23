////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// START push Notification :////////////////////////////////////////////////////////////////
	 var register_for_notifs;// = window.sessionStorage.getItem('register_for_notifs');
	 function onNotificationGCM(e) {
		//alert("uuuuuu");
		//$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

		switch( e.event )
		{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				//$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				//console.log("regID = " + e.regid);
				//alert("regID = " + e.regid);
				//if(register_for_notifs){
					var temp_udid;
					if(window.localStorage.getItem('uuid') == null)
					{
						window.plugins.uniqueDeviceID.get(uniqueDeviceIDsuccess_index, uniqueDeviceIDfail_index);
						temp_udid	=	"";
					}
					else
					{
						var temp_udid = window.localStorage.getItem('uuid');
					}
					$.ajax({ type: "POST",
							url: "http://imamali.net/app-json/set_new_user.php", 
							data: {regID : e.regid,user:window.localStorage.getItem('uuid'),OS:device.platform},
							async: false,
							success : function(text)
							{
								//last_articles_version = text;
								console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    Notification registration text : ' + text);
								window.sessionStorage.setItem('register_for_notifs','yes');
							}
					});
				//}
			}
		break;

		case 'message':
			// if this flag is set, this notification happened while we were in the foreground.
			// you might want to play a sound to get the user's attention, throw up a dialog, etc.
			if ( e.foreground )
			{
				//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

				// if the notification contains a soundname, play it.
				//var my_media = new Media("/android_asset/www/"+e.soundname);
				//my_media.play();
			}
			else
			{  // otherwise we were launched because the user touched a notification in the notification tray.
				/*
				if ( e.coldstart )
				{
					$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				}
				else
				{
					$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				}
				*/
			}
			
			//alert(e.payload.message);
			navigator.notification.alert(
				e.payload.message,  // message
				successHandler,         // callback
				'ÇÚáÇä',            // title
				'äÚã'                  // buttonName
			);
			//alert(e.payload.msgcnt);
			/*
			$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
			$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
			*/
		break;

		case 'error':
			//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		break;

		default:
			//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		break;
	  }
	}
	function successHandler (result) {
		//alert('result = ' + result);
	}
	// result contains any error description text returned from the plugin call
	function errorHandler (error) {
		//alert('error = ' + error);
	}
// END push Notification ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


function register_notification() {
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
// START push Notification :////////////////////////////////////////////////////////////////
			if (networkState == Connection.NONE) {
			
			}
			else
			{
				if(window.sessionStorage.getItem('register_for_notifs') == null)
				{
					pushNotification = window.plugins.pushNotification;
					console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    register_for_notifs : no // ' + device.platform);
					if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
						pushNotification.register(successHandler,errorHandler,{"senderID":"1069136326484","ecb":"onNotificationGCM"});
					} else {
						pushNotification.register(tokenHandler,errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"onNotificationGCM"});//"onNotificationAPN"});
					}
				}
			}
			function tokenHandler(result) {
				console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    Notification Callback Success! Result (ios) = '+result);
				
				var temp_udid;
				if(window.localStorage.getItem('uuid') == null)
				{
					window.plugins.uniqueDeviceID.get(uniqueDeviceIDsuccess_index, uniqueDeviceIDfail_index);
					temp_udid	=	"";
				}
				else
				{
					var temp_udid = window.localStorage.getItem('uuid');
				}
				//if(register_for_notifs){
					$.ajax({ type: "POST",
							url: "http://imamali.net/app-json/set_new_user.php", 
							data: {regID : result,user:window.localStorage.getItem('uuid'),OS:device.platform},
							async: false,
							success : function(text)
							{
								//last_articles_version = text;
								console.log('SMGROUP ::::::::::::::::::::::::::::::::::::    Notification registration text : ' + text);
								window.sessionStorage.setItem('register_for_notifs','yes');
							}
					});
				//}
			}
// END push Notification ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
}
















