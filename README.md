# Tauri + Vanilla TS

This template should help get you started developing with Tauri in vanilla HTML, CSS and Typescript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Requirements
To run the app yarn is required. See https://yarnpkg.com/getting-started/install on how to install yarn.

## Setup § Building
Run `yarn` to install all package dependencies.
Executing `yarn run dev` will launch the application in development mode. The application will be available via localhost.

## Building and running

### Web app
Executing `yarn run build` will create the application in the _.\dist_.
The web application is now 'portable' and the contents of the _.\dist_ folder can be moved to the desired directory.
To run the application a HTTP Server is required. For testing purposes `python3 -m http.server` could be used.

### Tauri
Install tauri and its dependencies. See https://v2.tauri.app/ to install tauri for your platform.
Note: Once Rust is installed the console needs to be refreshed to properly work.

To execute the tauri dev build run `yarn tauri dev` and `yarn tauri build` to build the application.
The generated build can be found in the folder _./src-tauri/target/\*type\*/bundle_.