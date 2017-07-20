// Pop-up General Toast Notification to Desktop/Action Center
function toastNotification(message, parameters) {
    // Log the message to the console
    console.log("Notification: " + message);

    if (typeof Windows != 'undefined') {
        var Notifications = Windows.UI.Notifications;

        //Get the XML template where the notification content will be suplied
        var template = Notifications.ToastTemplateType.toastImageAndText01;
        var toastXml = Notifications.ToastNotificationManager.getTemplateContent(template);

        //Supply the text to the XML content
        var toastTextElements = toastXml.getElementsByTagName("text");
        if (toastTextElements != null && toastTextElements.length > 0) {
            toastTextElements[0].appendChild(toastXml.createTextNode(message));
        }

        //Supply an image for the notification
        //Set the image this could be the background of the note, get the image from the web
        var toastImageElements = toastXml.getElementsByTagName("image");
        if (toastImageElements != null && toastImageElements.length > 0) {
            toastImageElements[0].setAttribute("src", "http://lorempixel.com/44/36/food/");
            toastImageElements[0].setAttribute("alt", "red graphic");
        }

        //Specify a long duration
        var toastNode = toastXml.selectSingleNode("/toast");
        toastNode.setAttribute("duration", "long");

        //Specify the audio for the toast notification
        var toastNode = toastXml.selectSingleNode("/toast");
        var audio = toastXml.createElement("audio");
        audio.setAttribute("src", "ms-winsoundevent:Notification.IM");

        //Specify launch paramater
        toastXml.selectSingleNode("/toast").setAttribute("launch", JSON.stringify(parameters)); // Note: Would set these parameters to capture when relaunching the application

        //Create a toast notification based on the specified XML
        var toast = new Notifications.ToastNotification(toastXml);

        //Send the toast notification
        var toastNotifier = Notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);

    } else {
        //TODO: Fallback to website functionality
        console.log("ERROR: No Windows namespace was detected");
    }
};
