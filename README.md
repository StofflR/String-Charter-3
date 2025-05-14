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

## How to build web app and executables:
- Make sure all necessary prerequisites for Tauri are installed (Node, Rust,...)
- Change into the src-tauri directory: cd src-tauri
- To build the windows executables: npm run tauri build (for other platforms see https://tauri.app/v1/guides/building/)
The installation files for the app will be generated in the folder \src-tauri\target\release\bundle\
