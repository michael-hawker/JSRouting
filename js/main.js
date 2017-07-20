// Hook into Buttons
var arguments = "";
var tileid = "";

window.addEventListener("DOMContentLoaded", (ev) => {
    // Toasts
    document.getElementById("toast1").addEventListener("click", () => {
        toastNotification("Making Toast!", { "url": "toast1", "message": "toast", "user": "67890" });
    });
    document.getElementById("toast2").addEventListener("click", () => {
        toastNotification("Making Burnt Toast!", { "url": "toast2", "message": "burnt", "user": "12345" });
    });

    // Live Tiles
    document.getElementById("liveaddprimary").addEventListener("click", () => {
        // Pin Primary Tile to Start - Creators Edition Feature
        if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.UI.StartScreen.StartScreenManager")) {
            Windows.ApplicationModel.Package.current.getAppListEntriesAsync().then((entries) => {
                var entry = entries[0];

                if (Windows.UI.StartScreen.StartScreenManager.getDefault().supportsAppListEntry(entry)) {
                    Windows.UI.StartScreen.StartScreenManager.getDefault().containsAppListEntryAsync(entry).then((isPinned) => {
                        if (!isPinned) {
                            Windows.UI.StartScreen.StartScreenManager.getDefault().requestAddAppListEntryAsync(entry).then((result) => {
                                console.log("Pinned result: " + result);
                            });
                        } else {
                            console.log("App is already Pinned");
                        }
                    });
                } else {
                    console.log("Can't Pin App, Not Supported");
                }
            });
        } else {
            console.log("API is only supported on Creators Update.");
        }
        window.setTimeout(getTileInfo, 1500);
    });
    document.getElementById("liveadd").addEventListener("click", () => {
        addLiveTile(1, 'Test Tile', { time: new Date().toLocaleTimeString(), message: "hello from a tile", "user": "12345" });
        window.setTimeout(getTileInfo, 1500);
    });
    document.getElementById("liveadd2").addEventListener("click", () => {
        addLiveTile(2, 'Test Tile 2', { time: new Date().toLocaleTimeString(), message: "hello from tile 2", "user": "12345" });
        window.setTimeout(getTileInfo, 1500);
    });

    // Update Live Tile Buttons
    document.getElementById("liveupdate").addEventListener("click", () => {
        updateLiveTile(0, 'Primary Test');
    });
    document.getElementById("liveupdate2").addEventListener("click", () => {
        updateLiveTile(1, 'Secondary Test');
        changeTileArguments(1, { time: new Date().toLocaleTimeString(), message: "secondary tile", "user": "12345" });
        window.setTimeout(getTileInfo, 500);
    });
    document.getElementById("liveupdate3").addEventListener("click", () => {
        updateLiveTile(2, 'Third Test');
        changeTileArguments(2, { time: new Date().toLocaleTimeString(), message: "third tile", "user": "12345" });
        window.setTimeout(getTileInfo, 500);
    });

    // Clear Live Tile Buttons
    document.getElementById("liveclear").addEventListener("click", () => {
        clearLiveTile(0);
    });
    document.getElementById("liveclear2").addEventListener("click", () => {
        clearLiveTile(1);
        changeTileArguments(1, { time: new Date().toLocaleTimeString(), message: "secondary cleared", "user": "12345" });
        window.setTimeout(getTileInfo, 500);
    });
    document.getElementById("liveclear3").addEventListener("click", () => {
        clearLiveTile(2);
        changeTileArguments(2, { time: new Date().toLocaleTimeString(), message: "third cleared", "user": "12345" });
        window.setTimeout(getTileInfo, 500);
    });

    // Show activation arguments
    document.getElementById("arguments").innerText = arguments;
    document.getElementById("tileid").innerText = tileid;

    getTileInfo();
});

function getTileInfo() {
    if (window.Windows) {
        // Show App Tile List
        Windows.UI.StartScreen.SecondaryTile.findAllAsync().then((tiles) => {
            document.getElementById("secondary").innerHTML = "";
            tiles.forEach((tile) => {
                document.getElementById("secondary").innerHTML += "<p>Id: " + tile.tileId + "</p><p>Arguments: " + tile.arguments + "</p>";
            });
        });

        // Only works on Creators Edition
        if (Windows.Foundation.Metadata.ApiInformation.isTypePresent("Windows.UI.StartScreen.StartScreenManager")) {
            // Primary tile API's supported!
            Windows.ApplicationModel.Package.current.getAppListEntriesAsync().then((entries) => {
                var entry = entries[0];

                Windows.UI.StartScreen.StartScreenManager.getDefault().containsAppListEntryAsync(entry).then((isPinned) => {
                    document.getElementById("primary").innerHTML = "<p>Display Name: " + entry.displayInfo.displayName + "</p><p>IsPinned: " + isPinned + "</p > ";
                });
            });
        }
    }
}

// Check for Windows Activation
if (window.Windows) {
    Windows.UI.WebUI.WebUIApplication.addEventListener('activated', function (args) {
        console.log(args);

        if (args && args.detail.length > 0) {
            tileid = args.detail[0].tileId;
        } else {
            tileid = "Unknown";
        }

        // Show on Page
        var element = document.getElementById("tileid");
        if (element) {
            element.innerText = tileid;
        }

        if (args && args.arguments) {
            arguments = args.arguments;

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
        } else {
            arguments = "";
        }

        // Show Arguments on Page
        var element = document.getElementById("arguments");
        if (element) {
            element.innerText = arguments;
        }
    });
}