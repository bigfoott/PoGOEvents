![Preview](https://github.com/bigfoott/PoGOEvents/blob/master/docs/preview.png?raw=true)

# PoGOEvents

PoGOEvents is a [Scriptable](https://scriptable.app/) widget that displays current and upcoming [Pokemon GO](https://pokemongolive.com/) events.

All event data is gathered from from [ScrapedDuck](https://github.com/bigfoott/ScrapedDuck), which scrapes [LeekDuck.com](https://leekduck.com) periodically.

# Installation

1. Install [Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188?uo=4) from the app store.

2. In the app, create a new script and copy/paste the contents of [PoGOEvents.js](https://raw.githubusercontent.com/bigfoott/PoGOEvents/master/PoGOEvents.js)

3. Add a Scriptable widget to your home screen (Small, Medium, and Large widgets are supported). Then edit the widget and select the newly created script in the script field.

4. To customize your widget, see [Customization](#customization).

# Customization

## With Script

Due to limitations of Scriptable's parameter field, I've created [a separate script](https://raw.githubusercontent.com/bigfoott/PoGOEvents/master/PoGOEventsConfig.js) (not a widget) that makes it easier to configure the widget to look the way you want.

To use, run the config script within Scriptable itself by tapping on it. You will then be prompted with the following questions:

**1. What type of events should be displayed?**

- Current Events / Upcoming Events

*If you'd like to see both current and upcoming events, you will need to add multiple widgets. Optionally, you can place them in a widget stack, making it easy to swipe between current and upcoming.*

**2. What stype of widget do you want?**
- System Theme / Dark Theme / Light Theme

**3. Do you want to whitelist any specific event types?**
- Yes / No

*If you want to only see specific event types in this widget, select yes. You will then be prompted to list event types into a text field. For event types, see [Event Types](#event-types) below.*


**4. Do you want to blacklist specific event types?**
- Yes / No

*If you want to never see specific event types in this widget, select yes. You will then be prompted to list event types into a text field. For event types, see [Event Types](#event-types) below.*

**5. Do you want to blacklist specific events?**
- Yes / No

*If there are specific events that you never want to see in this widget (Ex: an event that lasts the entire season), select yes. You will then be prompted to list event **IDs** into a text field. Event IDs are the last section of the URL of the event's page.*

Example:
- `URL: https://www.leekduck.com/events/season-of-alola/`
- `ID: season-of-alola`


You are then given a string that you can copy and paste into the parameter field on the widget itself.

## Without Script

If you'd like to manually write out the parameters, here is how they are interpreted by the widget:

```
<category>|<theme>|<whitelisted even types separated by commas>|<blacklisted event types separated by commas>|<blacklisted event IDs separated by commas>
```

If a field is unused (at the end), you can optionally leave out the blank `|` characters. For example, if you only set a category and theme, `<category>|<theme>` would be valid.

# Event Types

LeekDuck has events categorized into several event types. These types are listed in the ScrapedDuck event documentation [here](https://github.com/bigfoott/ScrapedDuck/blob/master/docs/EVENTS.md#list-of-event-types).
