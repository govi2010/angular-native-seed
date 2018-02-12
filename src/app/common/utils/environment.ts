import { of } from "rxjs/observable/of";
import { Observable } from "rxjs/Observable";

export class dialogs { };
export class Page {
    public backgroundColor: Color;
    public backgroundSpanUnderStatusBar: boolean;
    public actionBarHidden: boolean;
};
export class Color {
    constructor(a: number, b: number, c: number, d: number) {

    }
};
export class topmost { };
export const isIOS: boolean = false;
export enum AnimationCurve {
    ease
}
