// add clean and clan all tasks
import {deleteAsync} from 'del';
import path from 'path';

// Define the paths
const paths = {
    dist: 'dist',
    node: 'node_modules',
    tauri: 'src-tauri',
    tauri_target: 'src-tauri/target',
    idea: '.idea',
    vscode: '.vscode',
};

const locks = ['Cargo.lock', 'package-lock.json', 'yarn.lock']

export function clean() {
    return deleteAsync([paths.dist, paths.tauri_target, ...locks.map(lock => path.join(paths.tauri, lock)), ...locks.map(lock => lock)]);
}

export function cleanAll() {
    return deleteAsync([
        paths.node,
        paths.idea,
        paths.vscode,
    ]);
}