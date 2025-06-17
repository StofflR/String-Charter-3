# [String Charter 3](stofflr.github.io/String-Charter-3/)

This is a web application to visualize train schedules. 

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
or
- [WebStorm](https://www.jetbrains.com/webstorm/)

## Requirements
To run the app yarn is required. See https://yarnpkg.com/getting-started/install on how to install yarn.

## Setup and Building
Run 

```yarn```

 to install all package dependencies.
Executing 

```yarn run dev```

 will launch the application in development mode. The application will be available via localhost.

## Building and running

### Web app
Executing 

```yarn run build``` 

will create the application in the _.\dist_.
The web application is now 'portable' and the contents of the _.\dist_ folder can be moved to the desired directory.
To run the application a HTTP Server is required. For testing purposes 

```python3 -m http.server```

 could be used.

### Tauri
Install tauri and its dependencies. See https://v2.tauri.app/ to install tauri for your platform.
Note: Once Rust is installed the console needs to be refreshed to properly work.

To execute the tauri dev build run

```yarn tauri dev```

and 

 ```yarn tauri build```

to build the application.
The generated build can be found in the folder _./src-tauri/target/\*type\*/bundle_.

### Deploying Github pages
To deploy the application the branch _gh-pages_ needs to exist in your repo and Github pages need to be activated on Github as well.
Running 

```yarn run deploy```

 will push to the branch and the page will be visible. For this repo the corresponding page is [String Charter 3](https://stofflr.github.io/String-Charter-3/).

### Data sources
* [ÖBB](https://data.oebb.at/de/datensaetze~soll-fahrplan-gtfs~), ÖBB-Personenverkehr AG, CC-BY 4.0
* [GTFS.de](https://gtfs.de/en/feeds/), GTFS Feeds for Germany, CC-BY 4.0
* [Mobilitätsverbünde Österreich](https://data.mobilitaetsverbuende.at/de/data-sets), several GTFS datasets
of austrian federal transport agencies, registration and licence agreement necessary
* [SNCB/NMBS](https://gtfs.irail.be/nmbs/gtfs/latest.zip), GTFS Feed for the National Railway Company of Belgium, CC0

