// Hook into Buttons
var arguments = ""
window.addEventListener("DOMContentLoaded", (ev) => {
    // Toasts
    document.getElementById("toast1").addEventListener("click", () => {
        toastNotification("Making Toast!", { "url": "toast1", "message": "toast", "user": "67890" });
    });
    document.getElementById("toast2").addEventListener("click", () => {
        toastNotification("Making Burnt Toast!", { "url": "toast2", "message": "burnt", "user": "12345" });
    });

    // Live Tiles
    document.getElementById("liveadd").addEventListener("click", () => {
        addLiveTile('Test Tile', { time: new Date().toLocaleTimeString(), message: "hello from tile", "user": "12345" });
    });

    // Show activation arguments
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