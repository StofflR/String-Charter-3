# Tauri + Vanilla TS

This template should help get you started developing with Tauri in vanilla HTML, CSS and Typescript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## How to build web app and executables:
- Make sure all necessary prerequisites for Tauri are installed (Node, Rust,...)
- Run: npm install
- Change into the src-tauri directory: cd src-tauri
- To start the Web App with a Vite server: npm start dev
- To build the Web App: npm run build
- To build the windows executables: npm run tauri build (for other platforms see https://tauri.app/v1/guides/building/)
The installation files for the app will be generated in the folder \src-tauri\target\release\bundle\
