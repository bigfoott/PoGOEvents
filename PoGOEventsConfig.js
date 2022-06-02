// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: cogs;

var options = {}
var cancel = false;

{
    let alert = new Alert();
    alert.title = "Pokemon GO Events Config";
    alert.message = "What type of events should be displayed?";
    alert.addAction("Current Events");
    alert.addAction("Upcoming Events");

    let result = await alert.presentAlert();
    
    switch (result)
    {
        case 0:
            options.category = "current";
            break;
        case 1:
            options.category = "upcoming";
            break;
    }
}

{
    let alert = new Alert();
    alert.title = "Pokemon GO Events Config";
    alert.message = "What style of widget do you want?";
    alert.addAction("System Theme");
    alert.addAction("Dark Theme");
    alert.addAction("Light Theme");

    let result = await alert.presentAlert();
    
    switch (result)
    {
        case 0:
            options.theme = "system";
            break;
        case 1:
            options.theme = "dark";
            break;
        case 2:
            options.theme = "light";
            break;
    }
}

{
    let alert = new Alert();
    alert.title = "Pokemon GO Events Config";
    alert.message = "Do you want to whitelist specific event types?";
    alert.addAction("Yes");
    alert.addAction("No");

    let result = await alert.presentAlert(); 

    console.log(result);
    if (result == 0)
    {
        let alert = new Alert();
        alert.title = "Pokemon GO Events Config";
        alert.message = "Enter a list of event types separated by commas.\n(Check the README for a list of event types)\n\nEx: \"safari-zone,raid-hour,research\"";
        alert.addTextField();
        alert.addAction("Submit");
        alert.addCancelAction("Cancel");

        var out = await alert.presentAlert();

        if (out == 0)
        {
            let result = alert.textFieldValue(0);

            options.eventWhitelist = result;
        }
        else
        {
            cancel = true;
        }
    }
    else
    {
        options.eventWhitelist = "";

        let alert = new Alert();
        alert.title = "Pokemon GO Events Config";
        alert.message = "Do you want to blacklist specific event types?";
        alert.addAction("Yes");
        alert.addAction("No");

        let result = await alert.presentAlert(); 

        if (result == 0)
        {
            let alert = new Alert();
            alert.title = "Pokemon GO Events Config";
            alert.message = "Enter a list of event types separated by commas.\n(Check the README for a list of event types)\n\nEx: \"safari-zone,raid-hour,research\"";
            alert.addTextField();
            alert.addAction("Submit");
            alert.addCancelAction("Cancel");

            var out = await alert.presentAlert();

            if (out == 0)
            {
                let result = alert.textFieldValue(0);

                options.eventBlacklist = result;
            }
            else
            {
                cancel = true;
            }
        }
        else
        {
            options.eventBlacklist = "";
        }
    }
}

if (!cancel)
{
    let alert = new Alert();
    alert.title = "Pokemon GO Events Config";
    alert.message = "Do you want to blacklist specific events?";
    alert.addAction("Yes");
    alert.addAction("No");

    let result = await alert.presentAlert(); 

    if (result == 0)
    {
        let alert = new Alert();
        alert.title = "Pokemon GO Events Config";
        alert.message = "Enter a list of event IDs separated by commas.\n(Check the README for info on how to get event IDs)\n\nEx: \"season-of-go,pokemon-go-fest-2022\"";
        alert.addTextField();
        alert.addAction("Submit");
        alert.addCancelAction("Cancel");

        var out = await alert.presentAlert();

        if (out == 0)
        {
            let result = alert.textFieldValue(0);

            options.specificEventBlacklist = result;
        }
        else
        {
            cancel = true;
        }
    }
    else
    {
        options.specificEventBlacklist = "";
    }
}

if (!cancel)
{
    let parameter = `${options.category}|${options.theme}|${options.eventWhitelist}|${options.eventBlacklist}|${options.specificEventBlacklist}`

    let alert = new Alert();
    alert.title = "Pokemon GO Events Config";
    alert.message = "Here is your generated parameter string! Paste this into the \"Parameter\" field on the widget.";
    alert.addTextField("", parameter);
    alert.addAction("Copy to Clipboard");
    alert.addAction("Close");

    let result = await alert.presentAlert();

    if (result == 0)
    {
        Pasteboard.copy(parameter);
    }
}