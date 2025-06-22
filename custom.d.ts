declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module '*.ico' {
    const content: string;
    export default content;
}

declare module '*.zip' {
    const content: string;
    export default content;
}