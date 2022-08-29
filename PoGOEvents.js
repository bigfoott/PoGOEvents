// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;

async function main()
{
    var widget = new ListWidget();

    var rawInput = args.widgetParameter;
    var size = config.widgetFamily;

    if (size == undefined)
    {        
        throw new Error("This script must be run in a widget.")
    }
    else if (size == "extraLarge")
    {
        throw new Error("Unsupported widget size.")
    }

    var options = {
        category: "upcoming",
        theme: "system",
        eventWhitelist: [],
        eventBlacklist: [],
        specificEventBlacklist: []
    };
    try
    {
        var split = rawInput.toString().split("|");

        options.category = split[0].toLowerCase();

        if (split.length >= 2)
        {
            options.theme = split[1];
        }
        if (split.length >= 3)
        {
            if (split[2] == "")
                options.eventWhitelist = [];
            else
                options.eventWhitelist = split[2].replace(" ", "").split(",");
        }
        if (split.length >= 4)
        {
            if (split[3] == "")
                options.eventBlacklist = [];
            else
                options.eventBlacklist = split[3].replace(" ", "").split(",");
        }
        if (split.length >= 5)
        {
            if (split[4] == "")
                options.specificEventBlacklist = [];
            else
                options.specificEventBlacklist = split[4].replace(" ", "").split(",");
        }
    }
    catch {}

    var textMainColor = Color.dynamic(new Color("#000"), new Color("#d1d1d1"));
    var textAccentColor = Color.dynamic(new Color("#595959"), new Color("#a6a6a6"));
    widget.backgroundColor = Color.dynamic(new Color("#fff"), new Color("#212121"));

    switch (options.theme)
    {
        case "dark":
            textMainColor = new Color("#d1d1d1");
            textAccentColor = new Color("#a6a6a6");
            widget.backgroundColor = new Color("#212121");
            break;
        case "light":
            textMainColor = new Color("#000");
            textAccentColor = new Color("#595959");
            widget.backgroundColor = new Color("#fff");
            break;
    }

    var req = new Request("https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json");
  
    var allEvents = null;
    try { 
        allEvents = await req.loadJSON();
    }
    catch {}
 
    var topBar = widget.addStack();
    topBar.layoutHorizontally();

    var title = null;
    var catText = options.category.charAt(0).toUpperCase() + options.category.substr(1);

    if (size == "small")
    {
        title = topBar.addText("Pokémon GO Events")
        title.font = Font.boldSystemFont(10);

        widget.addSpacer(5);
    }
    else if (size == "medium")
    {
        title = topBar.addText(catText + " Pokémon GO Events")
        title.font = Font.boldSystemFont(12);

        widget.addSpacer(5);
    }
    else // large
    {
        title = topBar.addText(catText + " Pokémon GO Events")
        title.font = Font.boldSystemFont(14);

        widget.addSpacer(6);
    }
    title.textColor = textMainColor;

    var events = widget.addStack();
    events.layoutVertically();
    events.topAlignContent();

    var added = 0;
    var maxEvents = 4; // small
    if (size == "medium")
    {
        maxEvents = 5;
    }
    else if (size == "large")
    {
        maxEvents = 8;
    }

    for (var i = 0; i < allEvents.length; i++)
    {
        allEvents[i].start = Date.parse(allEvents[i].start);
        allEvents[i].end = Date.parse(allEvents[i].end);
    }

    if (options.category == "current")
    {
        allEvents.sort((a, b) => a.end - b.end);
    }
    else //upcoming
    {
        allEvents.sort((a, b) => a.start - b.start);
    }

    for (var i = 0; added < maxEvents && i < allEvents.length; i++)
    {
        let e = allEvents[i];

        if (options.eventWhitelist.length > 0 && !options.eventWhitelist.includes(e.eventType))
        {
            continue;
        }
        else if (options.eventBlacklist.length > 0 && options.eventBlacklist.includes(e.eventType))
        {
            continue;
        }
        if (options.specificEventBlacklist.length > 0 && options.specificEventBlacklist.includes(e.eventID))
        {
            continue;
        }

        let formattedTime = "";
        let prefix = "";

        let now = Date.now();

        if (options.category == "current")
        {
            if ((!e.start || e.start <= now) && e.end > now)
            {
                prefix = "Ends in ";
                formattedTime = formatTime(e.end - now);
            }
            else
            {
                continue;
            }
        }
        else //upcoming
        {
            if (e.start > now)
            {
                prefix = "Starts in ";
                formattedTime = formatTime(e.start - now);
            }
            else
            {
                continue;
            }
        }

        added++;

        var eventName = e.name;

        if (size != "small")
        {
            if (e.eventType == "pokemon-spotlight-hour")
            {
                eventName = `${e.extraData.spotlight.name} Spotlight (${e.extraData.spotlight.bonus})`;
            }
            else if (e.eventType == "research-breakthrough")
            {
                eventName = e.name.replace(" Research", "") + ` (${e.extraData.breakthrough.name})`;
            }
        }
        
        if (size == "small")
        {
            let event = events.addStack();
            event.layoutVertically();
            let top = event.addStack();
            let bottom = event.addStack();

            let dot = top.addText("● ");
            dot.textColor = eventColor[e.eventType];
            dot.font = Font.systemFont(8);

            let name = top.addText(eventName)
            name.textColor = textMainColor;
            name.font = Font.boldSystemFont(8);
            
            let time = bottom.addText(prefix + formattedTime);
            time.textColor = textAccentColor;
            time.font = Font.systemFont(8);

            if (added < maxEvents) events.addSpacer(3);
        }
        else if (size == "medium")
        {
            let event = events.addStack();
            event.layoutHorizontally();

            let dot = event.addText("● ");
            dot.textColor = eventColor[e.eventType];
            dot.font = Font.systemFont(10);

            let name = event.addText(eventName)
            name.textColor = textMainColor;
            name.font = Font.systemFont(10);

            event.addSpacer(null);
            
            let time = event.addText(prefix + formattedTime);
            time.textColor = textAccentColor;
            time.font = Font.systemFont(10);

            if (added < maxEvents) events.addSpacer(5);
        }
        else // large
        {
            let event = events.addStack();
            event.layoutVertically();
            let top = event.addStack();
            let bottom = event.addStack();

            let dot = top.addText("● " + e.heading);
            dot.textColor = eventColor[e.eventType];
            dot.font = Font.boldSystemFont(11);

            top.addSpacer(null);

            let time = top.addText(prefix + formattedTime);
            time.textColor = textAccentColor;
            time.font = Font.systemFont(11);

            let name = bottom.addText(eventName)
            name.textColor = textMainColor;
            name.font = Font.systemFont(11);

            if (added < maxEvents) events.addSpacer(5);
        }
    }

    if (added == 0)
    {
        if (size == "small")
        {
            let noEvent = events.addText(`No ${options.category} events.`);
            noEvent.textColor = textMainColor;
            noEvent.font = Font.systemFont(8);
        }
        else if (size == "medium")
        {
            let noEvent = events.addText(`No ${options.category} events.`);
            noEvent.textColor = textMainColor;
            noEvent.font = Font.systemFont(10);
        }
        else // large
        {
            let noEvent = events.addText(`No ${options.category} events.`);
            noEvent.textColor = textMainColor;
            noEvent.font = Font.systemFont(11);
        }
    }

    widget.addSpacer(null);

    var bottomBar = widget.addStack();
    
    var refreshIcon = bottomBar.addImage(SFSymbol.named("arrow.clockwise").image)
    refreshIcon.imageSize = new Size(9, 9);
    refreshIcon.tintColor = textAccentColor;

    bottomBar.addSpacer(2);

    var dateText = bottomBar.addDate(new Date());
    dateText.applyRelativeStyle();
    dateText.textColor=textAccentColor;
    dateText.font = Font.systemFont(8);

    Script.setWidget(widget);
}

function formatTime(time) {
    var timeSec = Math.floor(time / 1000);

    var days = Math.floor(timeSec / (3600*24));
    var hours = Math.floor(timeSec % (3600*24) / 3600);
    var minutes = Math.floor(timeSec % 3600 / 60);

    var formatted = ""
    if (days > 0)
        formatted = `${days}d ${hours}h`;
    else if (hours > 0)
            formatted = `${hours}h ${minutes}m`;
    else if (minutes > 0)
        formatted = `${minutes}m`;
    else
        formatted = "< 1m"

    return formatted;
}

var eventColor = {};
eventColor["community-day"] = new Color("#1660a9");
eventColor["raid-day"] = new Color("#e74c3c");
eventColor["raid-battles"] = new Color("#c0392b");
eventColor["event"] = new Color("#27ae60");
eventColor["raid-hour"] = new Color("#c0392b");
eventColor["research"] = new Color("#1abc9c");
eventColor["timed-research"] = new Color("#1abc9c");
eventColor["limited-research"] = new Color("#159e83");
eventColor["live-event"] = new Color("#d63031");
eventColor["pokemon-go-fest"] = new Color("#153d94");
eventColor["research-breakthrough"] = new Color("#795548");
eventColor["special-research"] = new Color("#13a185");
eventColor["global-challenge"] = new Color("#0a64b5");
eventColor["go-rocket-takeover"] = new Color("#1e1e1e");
eventColor["team-go-rocket"] = new Color("#1e1e1e");
eventColor["giovanni-special-research"] = new Color("#1e272e");
eventColor["safari-zone"] = new Color("#3d7141");
eventColor["ticketed-event"] = new Color("#de3e9b");
eventColor["go-battle-league"] = new Color("#8e44ad");
eventColor["pokemon-spotlight-hour"] = new Color("#e58e26");
eventColor["bonus-hour"] = new Color("#40407a");
eventColor["update"] = new Color("#2980b9");
eventColor["raid-weekend"] = new Color("#6f1e51");
eventColor["potential-ultra-unlock"] = new Color("#2c3e50");
eventColor["location-specific"] = new Color("#284b92");
eventColor["season"] = new Color("#38ada9");

main();