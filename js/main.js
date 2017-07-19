// Hook into Buttons
var arguments = ""
window.addEventListener("DOMContentLoaded", (ev) => {
    document.getElementById("toast1").addEventListener("click", () => {
        toastNotification("Making Toast!", { "url": "toast1", "message": "toast", "user": "67890" });
    });
    document.getElementById("toast2").addEventListener("click", () => {
        toastNotification("Making Burnt Toast!", { "url": "toast2", "message": "burnt", "user": "12345" });
    });

    document.getElementById("arguments").innerText = arguments;
});

// Check for Windows Activation
if (window.Windows) {
    Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {
        console.log(args);

        if (args && args.arguments) {
            arguments = args.arguments;
            // Show Arguments on Page
            var element = document.getElementById("arguments");
            if (element) {
                element.innerText = arguments;
            }

            // Parse JSON Blob
            var json = JSON.parse(args.arguments);

            // If we have a url, let's navigate to that page
            if (json && json.url) {
                if (document.getElementById("navigate").checked)
                {
                    window.location.assign(json.url + ".html");
                } else {
                    window.setTimeout(() => {
                        window.location.assign(json.url + ".html");
                    }, 2000); // Add Delay so we can see arguments before navigation
                }
            }
        }
    });
}

// Pop-up General Toast Notification to Desktop/Action Center
function toastNotification(message, parameters) {
    // Log the message to the console
    console.log("Notification: " + message);

    if (typeof Windows != 'undefined') {
        //Error detection
        // var text = document.createTextNode("Calling the Notifications")
        // document.body.appendChild(text);
        // Log to the console
        var Notifications = Windows.UI.Notifications;
        //Get the XML template where the notification content will be suplied
        var template = Notifications.ToastTemplateType.toastImageAndText01;
        var toastXml = Notifications.ToastNotificationManager.getTemplateContent(template);
        //Supply the text to the XML content
        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode(message));
        //Supply an image for the notification
        var toastImageElements = toastXml.getElementsByTagName("image");
        //Set the image this could be the background of the note, get the image from the web
        toastImageElements[0].setAttribute("src", "http://lorempixel.com/44/36/food/");
        toastImageElements[0].setAttribute("alt", "red graphic");
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