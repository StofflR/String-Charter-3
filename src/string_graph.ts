import {Trip} from "./interfaces";
import {D3Generator} from "./chartgen/D3Generator.ts";

let d3Gen: D3Generator | null = null;

let offsetX : number | undefined = undefined;
let offsetY : number | undefined = undefined;
let viewBoxX : number | undefined = undefined;
let viewBoxY : number | undefined = undefined;

export function updateViewBox(scale: number, offset: number): void {
    if (!d3Gen) {
        d3Gen = new D3Generator([], true, false, 0, 0, 0, 0);
    }
    let scaledWidth = d3Gen.getWidth() * (d3Gen.axisFlip ? 1 : scale / 100 );
    let scaledHeight = d3Gen.getHeight() * (d3Gen.axisFlip ? scale / 100 : 1);

    let maxOffsetX = d3Gen.getWidth() - scaledWidth;
    let maxOffsetY = d3Gen.getHeight() - scaledHeight;

    offsetX = maxOffsetX * (offset / 100);
    offsetY = maxOffsetY * (offset / 100);

    viewBoxX = d3Gen.getOffsetX()+ d3Gen.getOffsetY() + scaledWidth
    viewBoxY = d3Gen.getOffsetY() + d3Gen.getOffsetX() + scaledHeight
    d3Gen.updateViewBox(offsetX, offsetY, viewBoxX, viewBoxY);
}

export function generateStringGraph(data: Trip[], axisFlip: boolean, compare: boolean): void {
    if(!offsetX || !offsetY || !viewBoxX || !viewBoxY)
        updateViewBox(100, 0);

    d3Gen = new D3Generator(data, !axisFlip, compare, offsetX!, offsetY!, viewBoxX!, viewBoxY!);
    d3Gen.generate();
}