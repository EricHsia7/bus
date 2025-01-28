# Bus

[![latest version](https://img.shields.io/badge/dynamic/json?label=latest+version&query=hash&url=https%3A%2F%2Ferichsia7.github.io%2Fbus%2Fversion.json&color=18B2FF)](https://erichsia7.github.io/bus)
[![latest build](https://img.shields.io/badge/dynamic/json?label=latest+builld&query=build&url=https%3A%2F%2Ferichsia7.github.io%2Fbus%2Fversion.json&color=18B2FF)](https://erichsia7.github.io/bus)
![Netlify Status](https://api.netlify.com/api/v1/badges/96537a9f-5bb2-4d96-8d04-c48820a1b60b/deploy-status)

Bus is a user-friendly web application designed to simplify your travel experience. Whether you're a frequent traveler, daily commuter, or simply exploring new places, Bus provides tools to help you find routes, manage locations, and organize your journeys effortlessly.

## Getting Started

Open this application in your browser via one of the urls.

- [erichsia7.github.io/bus](https://erichsia7.github.io/bus/)
- [erichsia7-bus.netlify.app](https://erichsia7-bus.netlify.app/)

## Key Features

### Supported Regions

- Taipei, Taiwan
- New Taipei, Taiwan

### Easy Search

Quickly find routes, locations, and places of interest within the app.

### Integration

- **All-in-One Page**: Display stops of a route or location on a single page.
- **Visualized Diagram**: Show departure time scheduled by its provider in a simplified and readable calendar.
- **Position**: Highlight the bus stop where you are currently present.

### Personalization

- **Customizable Display**: You can customize time-formatting mode, location labels, folder icons, etc.
- **Personal Schedule**: By entering your schedules and routines, Bus is allowed to save estimated time data in specified period and cater to bus arrival time.
- **Folder**: Save important stops, locations, and routes in folders for quick reference.

### Analytics

- **Bus Arrival Time**: This feature requires setting Personal Schedule. After set, it will work in route page.
- **Data Usage**: See the transferred data quantity.
- **Storage**: See the drive space used by Bus on your device.

### Notification

- **Schedule Notifications**: You can set up notifications to remind you about bus arrivals based on their estimated times.
- **Backend Requirements**: When you close Bus, operating systems typically restrict its access to system resources. This makes it difficult to handle notifications using frontend technologies alone. To use the notification feature, you'll need to set up backend infrastructure—though you can use free services like Cloudflare Worker for this purpose.
- **Bus Notification Worker**: You can set up a worker using [@EricHsia7/bus-notification-worker](https://github.com/EricHsia7/bus-notification-worker).

## Privacy

Your privacy and security are our top priorities. Your all data are stored locally except for notification features[^1]. The data is only used for improving your using experience, and not for advertising. You can see them in [./src/data](./src/data/).

[^1]: There's an exception that your data may be sent to and stored on providers you choose, if you're using the notification features.

## Concepts

### Locations & Stops

Locations and stops are different in some aspects. Stops are route-position pair, which means a stop can be only on a route, at single geolocation, and towards one direction. On the other hand, a location is a collection of such stops sharing the approximately same geolocation.

## Dependencies

- **Packages**: See them in [package.json](./package.json).
- **Data References**: See them in [getAPIURL.ts](./src/data/apis/getAPIURL/index.ts) and learn more on the website [pto.gov.taipei](https://pto.gov.taipei/News_Content.aspx?n=A1DF07A86105B6BB&s=55E8ADD164E4F579&sms=2479B630A6BD8079).

## Related Repositories

- [@EricHsia7/material-symbols-list](https://github.com/EricHsia7/material-symbols-list)
- [@EricHsia7/bus-alternative-static-apis](https://github.com/EricHsia7/bus-alternative-static-apis)
- [@EricHsia7/bus-notification-worker](https://github.com/EricHsia7/bus-notification-worker).


## Materials Used

- [Google Material Symbols](https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols)
