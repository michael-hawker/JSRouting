
var logoSecondaryTileId = "JSToastRouting.Logo";

function addLiveTile(id, title, parameters) {
    if (typeof Windows != 'undefined') {
        // Prepare package images for all four tile sizes in our tile to be pinned as well as for the square30x30 logo used in the Apps view.  
        var square150x150Logo = new Windows.Foundation.Uri("ms-appx:///Assets/square150x150Tile-sdk.png");
        var wide310x150Logo = new Windows.Foundation.Uri("ms-appx:///Assets/wide310x150Tile-sdk.png");
        var square310x310Logo = new Windows.Foundation.Uri("ms-appx:///Assets/square310x310Tile-sdk.png");
        var square30x30Logo = new Windows.Foundation.Uri("ms-appx:///Assets/square30x30Tile-sdk.png");

        // During creation of secondary tile, an application may set additional arguments on the tile that will be passed in during activation.
        // These arguments should be meaningful to the application. In this sample, we'll pass in the date and time the secondary tile was pinned.
        var tileActivationArguments = JSON.stringify(parameters);  //logoSecondaryTileId + " WasPinnedAt=" + new Date().toLocaleTimeString();

        // Create a Secondary tile with all the required arguments.
        // Note the last argument specifies what size the Secondary tile should show up as by default in the Pin to start fly out.
        // It can be set to TileSize.Square150x150, TileSize.Wide310x150, or TileSize.Default.  
        // If set to TileSize.Wide310x150, then the asset for the wide size must be supplied as well.
        // TileSize.Default will default to the wide size if a wide size is provided, and to the medium size otherwise. 
        var secondaryTile = new Windows.UI.StartScreen.SecondaryTile(logoSecondaryTileId + id,
            title,
            tileActivationArguments,
            square150x150Logo,
            Windows.UI.StartScreen.TileSize.square150x150);

        if (!(Windows.Foundation.Metadata.ApiInformation.isTypePresent(("Windows.Phone.UI.Input.HardwareButtons")))) {
            secondaryTile.visualElements.wide310x150Logo = wide310x150Logo;
            secondaryTile.visualElements.square310x310Logo = square310x310Logo;
        }

        // Like the background color, the square30x30 logo is inherited from the parent application tile by default. 
        // Let's override it, just to see how that's done.
        secondaryTile.visualElements.square30x30Logo = square30x30Logo;

        // The display of the secondary tile name can be controlled for each tile size.
        // The default is false.
        secondaryTile.visualElements.showNameOnSquare150x150Logo = true;

        if (!(Windows.Foundation.Metadata.ApiInformation.isTypePresent(("Windows.Phone.UI.Input.HardwareButtons")))) {
            secondaryTile.visualElements.showNameOnWide310x150Logo = true;
            secondaryTile.visualElements.showNameOnSquare310x310Logo = true;
        }

        // Specify a foreground text value.
        // The tile background color is inherited from the parent unless a separate value is specified.
        secondaryTile.visualElements.foregroundText = Windows.UI.StartScreen.ForegroundText.Dark;

        // Set this to false if roaming doesn't make sense for the secondary tile.
        // The default is true;
        secondaryTile.roamingEnabled = false;

        // OK, the tile is created and we can now attempt to pin the tile.
        // Since pinning a secondary tile on Windows Phone will exit the app and take you to the start screen, any code after 
        // RequestCreateForSelectionAsync or RequestCreateAsync is not guaranteed to run.  For an example of how to use the OnSuspending event to do
        // work after RequestCreateForSelectionAsync or RequestCreateAsync returns, see Scenario9_PinTileAndUpdateOnSuspend in the SecondaryTiles.WindowsPhone project.
        secondaryTile.requestCreateAsync();
    }
}

// Update an existing secondary tile's arguments.
function changeTileArguments(id, parameters) {
    console.log("Update Arguments: " + id + ", " + JSON.stringify(parameters));

    if (typeof Windows != 'undefined') {
        if (id !== 0) {
            return Windows.UI.StartScreen.SecondaryTile.findAllAsync().then((tiles) => {
                return tiles.some((tile) => {
                    if (tile.tileId === logoSecondaryTileId + id) {
                        // Update Arguments of our Tile
                        tile.arguments = JSON.stringify(parameters);

                        // Push update
                        tile.updateAsync();

                        return true; // break
                    }
                });
            });
        }    
    }

    return false;
}

// Pop-up General Toast Notification to Desktop/Action Center
function updateLiveTile(id, message) {
    // Log the message to the console
    console.log("Tile: " + message);

    if (typeof Windows != 'undefined') {
        var Notifications = Windows.UI.Notifications;

        //Get the XML template where the notification content will be suplied
        var template = Notifications.TileTemplateType.tileSquare150x150PeekImageAndText01;
        var tileXml = Notifications.TileUpdateManager.getTemplateContent(template);

        //Supply the text to the XML content
        var tileTextElements = tileXml.getElementsByTagName("text");
        if (tileTextElements != null && tileTextElements.length > 0) {
            tileTextElements[0].appendChild(tileXml.createTextNode(message));
        }

        //Supply an image for the notification
        //Set the image this could be the background of the note, get the image from the web
        var tileImageElements = tileXml.getElementsByTagName("image");
        if (tileImageElements != null && tileImageElements.length > 0) {
            tileImageElements[0].setAttribute("src", "http://lorempixel.com/150/150/food/");
            tileImageElements[0].setAttribute("alt", "red graphic");
        }

        //Specify a long duration
        var tileNode = tileXml.selectSingleNode("/tile");
        tileNode.setAttribute("duration", "long");

        //Create a toast notification based on the specified XML
        var notification = new Notifications.TileNotification(tileXml);
        notification.tag = message.substring(0, 15); // only 16 characters can be used in tag.

        try {
            // Send the notification to the primary tile
            if (id === 0) {
                Notifications.TileUpdateManager.createTileUpdaterForApplication().update(notification);
            } else {
                // Get its updater and send the notification
                Notifications.TileUpdateManager.createTileUpdaterForSecondaryTile(logoSecondaryTileId + id).update(notification);
            }

            return true;
        } catch (err) {
            // Tile is probably unpinned.
            return false;
        }

    } else {
        //TODO: Fallback to website functionality
        console.log("ERROR: No Windows namespace was detected");
    }
};

function clearLiveTile(id) {
    console.log("Clear Tile: " + id);

    if (typeof Windows != 'undefined') {
        var Notifications = Windows.UI.Notifications;

        try {
            // Clear the notification to the primary tile
            if (id === 0) {
                Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
            } else {
                // Get its updater and send the clear request
                Notifications.TileUpdateManager.createTileUpdaterForSecondaryTile(logoSecondaryTileId + id).clear();
            }
            return true;
        } catch (err) {
            // Tile most likely unpinned.
            return false;
        }
    }
}