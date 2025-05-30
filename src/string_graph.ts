import {Trip} from "./interfaces";
import {D3Generator} from "./chartgen/D3Generator.ts";


export function generateStringGraph(data: Trip[], axisFlip: boolean): void {
    let d3Gen = new D3Generator(data, !axisFlip);
    d3Gen.generate();
}