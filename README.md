# Bus

![latest version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ferichsia7.github.io%2Fbus%2Fversion.json&query=hash&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNNDgwLTI5MHEtNzEuNDYgMC0xMjMuNDYtNDUuNVQyOTIuMDgtNDUwSDEzMHEtMTIuNzUgMC0yMS4zNy04LjYzLTguNjMtOC42My04LjYzLTIxLjM4IDAtMTIuNzYgOC42My0yMS4zN1ExMTcuMjUtNTEwIDEzMC01MTBoMTYyLjA4cTEyLjQ2LTY5IDY0LjQ2LTExNC41UTQwOC41NC02NzAgNDgwLTY3MHQxMjMuNjUgNDUuNXE1Mi4yIDQ1LjUgNjQuMjcgMTE0LjVIODMwcTEyLjc1IDAgMjEuMzcgOC42MyA4LjYzIDguNjMgOC42MyAyMS4zOCAwIDEyLjc2LTguNjMgMjEuMzdRODQyLjc1LTQ1MCA4MzAtNDUwSDY2Ny45MnEtMTIuMDcgNjktNjQuMjcgMTE0LjVRNTUxLjQ2LTI5MCA0ODAtMjkwWm0wLTYwcTUzLjg1IDAgOTEuOTItMzguMDhRNjEwLTQyNi4xNSA2MTAtNDgwdC0zOC4wOC05MS45MlE1MzMuODUtNjEwIDQ4MC02MTB0LTkxLjkyIDM4LjA4UTM1MC01MzMuODUgMzUwLTQ4MHQzOC4wOCA5MS45MlE0MjYuMTUtMzUwIDQ4MC0zNTBaIi8%2BPC9zdmc%2B&label=latest%20version&labelColor=329cff&color=329cff)
![latest build](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ferichsia7.github.io%2Fbus%2Fversion.json&query=build&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMjkyLjA4LTQ4NnExNi4zMS0zMi42MSAzNC43Ny02Mi44NSAxOC40Ni0zMC4yMyA0MC42OS01OS42OWwtNTguNjktMTEuNzdxLTMuMDgtLjc3LTUuOTYuMTktMi44OS45Ny01LjIgMy4yN2wtOTAuNTQgOTAuNTRxLTEuMTUgMS4xNi0uNzcgMi43LjM5IDEuNTMgMS45MyAyLjNMMjkyLjA4LTQ4NlptNDcwLjA3LTI4Ni45MnEtODEuMTUgNC4zMS0xNTYuMDQgNDAuODEtNzQuODggMzYuNS0xMzguMzQgOTkuOTZRNDI0LjYxLTU4OSAzOTEuNjEtNTQxcS0zMyA0OC01MS42OSA5Mi42OWwxMTMuNjIgMTEzUTQ5OC4yMy0zNTQgNTQ2LjQyLTM4N3Q5MS4zNS03Ni4xNXE2My40Ni02My40NiA5OS45Ni0xMzcuODUgMzYuNS03NC4zOCA0MC44MS0xNTUuNTQgMC0zLjIzLS45My02LjI3LS45Mi0zLjA0LTMuNTMtNS42NS0yLjYyLTIuNjItNS42Ni0zLjU0LTMuMDQtLjkyLTYuMjctLjkyWk01NDUuMjMtNTQwLjIzcS0yMC4zMS0yMC4zMS0yMC4zMS00OS4zOCAwLTI5LjA4IDIwLjMxLTQ5LjM5IDIwLjMxLTIwLjMxIDQ5LjY5LTIwLjMxIDI5LjM5IDAgNDkuNjkgMjAuMzEgMjAuMzEgMjAuMzEgMjAuMzEgNDkuMzkgMCAyOS4wNy0yMC4zMSA0OS4zOC0yMC4zIDIwLjMxLTQ5LjY5IDIwLjMxLTI5LjM4IDAtNDkuNjktMjAuMzFabS01NCAyNTMuMTUgMzUuMzEgODQuMzlxLjc3IDEuNTQgMi4zIDEuNzMgMS41NC4xOSAyLjctLjk2bDkwLjU0LTkwLjE2cTIuMy0yLjMxIDMuMjctNS4xOS45Ni0yLjg5LjE5LTUuOTZsLTExLjc3LTU4LjY5cS0yOS40NiAyMi4yMy01OS42OSA0MC4zOC0zMC4yNCAxOC4xNS02Mi44NSAzNC40NlptMzQ0LjQ2LTUwNC43NnEzLjc3IDEwNS0zNi45NiAxOTkuNDktNDAuNzMgOTQuNS0xMjUuMzUgMTc5LjEyLTEuOTIgMS45Mi0zLjY1IDMuNDZ0LTMuNjUgMy40NmwxOC40NiA5MC45MnEzLjYxIDE4LjA4LTEuODEgMzUuMTYtNS40MiAxNy4wNy0xOC4yNyAyOS45Mkw1NDUuNzctMTMxLjYycS0xMy40NiAxMy40Ni0zMi41NCAxMC4xNi0xOS4wOC0zLjMxLTI2LjMxLTIxLjM5bC01NC40Ni0xMjgtMTU2LjM4LTE1Ni43Ny0xMjgtNTQuNDZxLTE4LjA4LTcuMjMtMjEuNS0yNi4zLTMuNDItMTkuMDggMTAuMDQtMzIuNTRsMTE4LjY5LTExOC42OXExMi44NS0xMi44NSAzMC4yMy0xOC4wOCAxNy4zOC01LjIzIDM1LjQ2LTEuNjJsOTAuOTIgMTguNDdxMS45My0xLjkzIDMuMjctMy40NyAxLjM1LTEuNTMgMy4yNy0zLjQ2IDg0LjYyLTg0LjYxIDE3OS4xMi0xMjUuNTQgOTQuNS00MC45MiAxOTkuNS0zNy4xNSA3LjIzLjYyIDE0LjI2IDMuNTQgNy4wNCAyLjkyIDEyLjY2IDguNTQgNS42MSA1LjYxIDguMzQgMTIuNDYgMi43MyA2Ljg0IDMuMzUgMTQuMDhaTTE4MC44NS0zMTcuMTVxMjkuMjMtMjkuMjMgNzEuMjctMjkuMzUgNDIuMDMtLjExIDcxLjI2IDI5LjEyIDI5LjIzIDI5LjIzIDI4LjkzIDcxLjI2LS4zMSA0Mi4wNC0yOS41NCA3MS4yNy00MC42OSA0MC42OS05NiA0OS41LTU1LjMxIDguODEtMTExLjMxIDE1LjUgNi43LTU2LjM4IDE1LjctMTExLjUgOS01NS4xMSA0OS42OS05NS44Wm00Mi43NyA0Mi41M3EtMTcuMzkgMTcuMzktMjQuMDggNDEuMzktNi42OSAyNC0xMC4zMSA0OS4zOCAyNS4zOS0zLjYxIDQ5LjM5LTEwLjE5VDI4MC0yMThxMTItMTIgMTIuNjItMjguODEuNjEtMTYuODEtMTEuMzktMjguODF0LTI4LjgxLTExLjVxLTE2LjguNS0yOC44IDEyLjVaIi8%2BPC9zdmc%2B&label=latest%20build&labelColor=329cff&color=329cff)
![timestamp](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ferichsia7.github.io%2Fbus%2Fversion.json&query=timestamp&style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNNTEwLTQ5Mi4xNVYtNjUwcTAtMTIuNzUtOC42My0yMS4zOC04LjYzLTguNjItMjEuMzgtOC42Mi0xMi43NiAwLTIxLjM3IDguNjJRNDUwLTY2Mi43NSA0NTAtNjUwdjE2Ny4wOHEwIDcuMDYgMi42MiAxMy42OCAyLjYxIDYuNjIgOC4yMyAxMi4yNGwxMzcgMTM3cTguMyA4LjMxIDIwLjg4IDguNSAxMi41OC4xOSAyMS4yNy04LjV0OC42OS0yMS4wOHEwLTEyLjM4LTguNjktMjEuMDdsLTEzMC0xMzBaTTQ4MC4wNy0xMDBxLTc4Ljg0IDAtMTQ4LjIxLTI5LjkydC0xMjAuNjgtODEuMjFxLTUxLjMxLTUxLjI5LTgxLjI1LTEyMC42M1ExMDAtNDAxLjEgMTAwLTQ3OS45M3EwLTc4Ljg0IDI5LjkyLTE0OC4yMXQ4MS4yMS0xMjAuNjhxNTEuMjktNTEuMzEgMTIwLjYzLTgxLjI1UTQwMS4xLTg2MCA0NzkuOTMtODYwcTc4Ljg0IDAgMTQ4LjIxIDI5LjkydDEyMC42OCA4MS4yMXE1MS4zMSA1MS4yOSA4MS4yNSAxMjAuNjNRODYwLTU1OC45IDg2MC00ODAuMDdxMCA3OC44NC0yOS45MiAxNDguMjF0LTgxLjIxIDEyMC42OHEtNTEuMjkgNTEuMzEtMTIwLjYzIDgxLjI1UTU1OC45LTEwMCA0ODAuMDctMTAwWk00ODAtNDgwWm0wIDMyMHExMzMgMCAyMjYuNS05My41VDgwMC00ODBxMC0xMzMtOTMuNS0yMjYuNVQ0ODAtODAwcS0xMzMgMC0yMjYuNSA5My41VDE2MC00ODBxMCAxMzMgOTMuNSAyMjYuNVQ0ODAtMTYwWiIvPjwvc3ZnPg%3D%3D&label=timestamp&labelColor=329cff&color=329cff)
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

- **Bus Arrival Time**: This feature requires setting Personal Schedule. After set, it will work on route and location page.
- **Data Usage**: See the transferred data quantity.
- **Storage**: See the drive space used by Bus on your device.

### Notification

- **Schedule Notifications**: You can set up notifications to remind you about bus arrivals based on their estimated times.
- **Backend Requirements**: When you close Bus, operating systems typically restrict its access to system resources. This makes it difficult to handle notifications using frontend technologies alone. To use the notification feature, you'll need to set up backend infrastructure—though you can use free services like Cloudflare Worker for this purpose.
- **Bus Notification Worker**: You can set up a worker using [@EricHsia7/bus-notification-worker](https://github.com/EricHsia7/bus-notification-worker).

## Privacy

Your privacy and security are our top priorities. Your all data are stored locally except for the notification feature[^1]. The data is only used for improving your using experience, and not for advertising. You can see them in [./src/data](./src/data/).

[^1]: There's an exception that your data may be sent to and stored on providers you choose, if you're using the notification feature.

## Concepts

### Locations & Stops

Locations and stops are different in some aspects. Stops are route-position pair, which means a stop can be only on a route, at single geolocation, and towards one direction. On the other hand, a location is a collection of such stops sharing the approximately same geolocation.

## Dependencies

- **Packages**: See them in [package.json](./package.json).
- **Data References**: See them in [getAPIURL.ts](./src/data/apis/getAPIURL/index.ts) and learn more on the website [pto.gov.taipei](https://pto.gov.taipei/News_Content.aspx?n=A1DF07A86105B6BB&s=55E8ADD164E4F579&sms=2479B630A6BD8079).

## Affiliated Repositories

- [@EricHsia7/material-symbols-list](https://github.com/EricHsia7/material-symbols-list)
- [@EricHsia7/bus-alternative-static-apis](https://github.com/EricHsia7/bus-alternative-static-apis)
- [@EricHsia7/bus-notification-worker](https://github.com/EricHsia7/bus-notification-worker)

## Materials Used

- [Google Material Symbols](https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols)
