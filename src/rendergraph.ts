/** @license
 * shogi-graph-ts
 * Copyright (c) Mizar <https://github.com/mizar>
 */

import { BaseType, Selection } from "d3-selection";

export const YAxis = {
    PseudoSigmoid: 0 as const,
    Tanh: 1 as const,
    Linear1000: 2 as const,
    Linear1200: 3 as const,
    Linear2000: 4 as const,
    Linear3000: 5 as const,
    Atan: 6 as const
};
export type YAxis = typeof YAxis[keyof typeof YAxis];
const YScale = {
    None: 0 as const,
    Score: 1 as const,
    WinRate: 2 as const
};
type YScale = typeof YScale[keyof typeof YScale];
const XScale = {
    None: 0 as const,
    Ply: 1 as const
};
type XScale = typeof XScale[keyof typeof XScale];
const Line = {
    None: 0 as const,
    Nml: 1 as const,
    Bld: 2 as const,
    EBld: 3 as const
};
type Line = typeof Line[keyof typeof Line];
interface GryphFamilyInfo {
    n: string;
    s: string;
    l: string;
}
interface Mark {
    c: string;
    v: number;
    s: boolean;
    m: Line;
    l: Line;
}
interface Rgb {
    r: number;
    g: number;
    b: number;
}
export interface SvgScoreGraphProp {
    maxPly: number;
    width: number;
    height: number;
    pad: number;
    capPad: number;
    lWidthNml: number;
    lWidthBld: number;
    lWidthBorder: number;
    lWidthScore: number;
    scaleLength: number;
    scalePad: number;
    cRadiusScore: number;
    colorBackground: Rgb;
    colorGridNml: Rgb;
    colorGridBld: Rgb;
    colorGridEBld: Rgb;
    colorGridBorder: Rgb;
    colorPly: Rgb;
    colorPlayer0: Rgb;
    colorPlayer1: Rgb;
    colorPlayer2: Rgb;
    colorCap: Rgb;
    fSizeLw: number;
    fSizeLh: number;
    fSizeRw: number;
    fSizeRh: number;
    fSizeBw: number;
    fSizeBh: number;
    fSizeCap: number;
    plotYAxisType: YAxis;
    gridYAxisType: YScale;
    lType: YScale;
    rType: YScale;
    tType: XScale;
    bType: XScale;
    score: number[];
    comment: string[];
    caption: string;
    capLink: string;
    plyCallback: (ply: number) => void;
}

function getScoreEval(yaxis: YAxis): (score: number) => number {
    switch (yaxis) {
        case YAxis.PseudoSigmoid:
            return (score: number): number =>
                Math.asin(
                    Math.atan(score * ((Math.PI * Math.PI) / 4800)) *
                        (2 / Math.PI)
                ) *
                (2 / Math.PI);
        case YAxis.Atan:
            return (score: number): number =>
                Math.atan(score * (Math.PI / 2400)) * (2 / Math.PI);
        case YAxis.Tanh:
            return (score: number): number => Math.tanh(score / 1200);
        case YAxis.Linear1000:
            return (score: number): number =>
                Math.min(Math.max(score / 1000, -1), +1);
        case YAxis.Linear1200:
            return (score: number): number =>
                Math.min(Math.max(score / 1200, -1), +1);
        case YAxis.Linear2000:
            return (score: number): number =>
                Math.min(Math.max(score / 2000, -1), +1);
        case YAxis.Linear3000:
            return (score: number): number =>
                Math.min(Math.max(score / 3000, -1), +1);
        default:
            return (): number => Number.NaN;
    }
}

function getVper(yaxis: YAxis): Mark[] {
    switch (yaxis) {
        case YAxis.PseudoSigmoid:
        case YAxis.Atan:
            return [
                100,
                99.999999,
                99.99999,
                99.9999,
                99.999,
                99.99,
                99.9,
                99,
                95,
                90,
                85,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                15,
                10,
                5,
                1,
                0.1,
                0.01,
                0.001,
                0.0001,
                0.00001,
                0.000001,
                0
            ].map(vp => {
                const s = vp % 1 === 0 && vp % 10 !== 5;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        case YAxis.Tanh:
            return [
                100,
                95,
                90,
                85,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                15,
                10,
                5,
                0
            ].map(vp => {
                const s = vp % 1 === 0 && vp % 10 !== 5;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        case YAxis.Linear1000:
            return [
                84,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                16
            ].map(vp => {
                const s = vp % 1 === 0 && vp % 10 !== 5;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        case YAxis.Linear1200:
            return [
                87,
                85,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                15,
                13
            ].map(vp => {
                const s = vp % 1 === 0 && vp % 10 !== 5;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        case YAxis.Linear2000:
            return [
                96,
                95,
                94,
                93,
                92,
                91,
                90,
                85,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                15,
                10,
                9,
                8,
                7,
                6,
                5,
                4
            ].map(vp => {
                const s =
                    vp % 1 === 0 &&
                    vp % 10 !== 5 &&
                    vp !== 6 &&
                    vp !== 7 &&
                    vp !== 8 &&
                    vp !== 9 &&
                    vp !== 91 &&
                    vp !== 92 &&
                    vp !== 93 &&
                    vp !== 94;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        case YAxis.Linear3000:
            return [
                99,
                98,
                97,
                96,
                95,
                94,
                93,
                92,
                91,
                90,
                85,
                80,
                75,
                70,
                65,
                60,
                55,
                50,
                45,
                40,
                35,
                30,
                25,
                20,
                15,
                10,
                9,
                8,
                7,
                6,
                5,
                4,
                3,
                2,
                1
            ].map(vp => {
                const s =
                    (vp % 1 === 0 &&
                        vp % 10 !== 5 &&
                        vp !== 3 &&
                        vp !== 4 &&
                        vp !== 6 &&
                        vp !== 7 &&
                        vp !== 8 &&
                        vp !== 9 &&
                        vp !== 91 &&
                        vp !== 92 &&
                        vp !== 93 &&
                        vp !== 94 &&
                        vp !== 96 &&
                        vp !== 97) ||
                    vp === 5 ||
                    vp === 95;
                return {
                    c: `${vp}%`,
                    v: vp / 100,
                    s: s && vp !== 40 && vp !== 60,
                    m: vp % 50 === 0 ? Line.EBld : s ? Line.Bld : Line.Nml,
                    l: vp % 100 === 0 ? Line.None : s ? Line.Bld : Line.Nml
                };
            });
        default:
            return [];
    }
}

function getVsc(yaxis: YAxis): Mark[] {
    switch (yaxis) {
        case YAxis.PseudoSigmoid:
            return [
                { c: "+∞", v: +Infinity, s: true, m: Line.EBld, l: Line.None },
                { c: "+99999", v: +99999, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+9999", v: +9999, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+9000", v: +9000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+8000", v: +8000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+7000", v: +7000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+6000", v: +6000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+5000", v: +5000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+4000", v: +4000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+3000", v: +3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2500", v: +2500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+2000", v: +2000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1500", v: +1500, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-500", v: -500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1500", v: -1500, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2000", v: -2000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2500", v: -2500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-3000", v: -3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-4000", v: -4000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-5000", v: -5000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-6000", v: -6000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-7000", v: -7000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-8000", v: -8000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-9000", v: -9000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-9999", v: -9999, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-99999", v: -99999, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-∞", v: -Infinity, s: true, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Atan:
            return [
                { c: "+∞", v: +Infinity, s: false, m: Line.EBld, l: Line.None },
                { c: "+99999", v: +99999, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+9999", v: +9999, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+9000", v: +9000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+8000", v: +8000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+7000", v: +7000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+6000", v: +6000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+5000", v: +5000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+4000", v: +4000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+3000", v: +3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2500", v: +2500, s: false, m: Line.None, l: Line.None },
                { c: "+2000", v: +2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+1900", v: +1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1800", v: +1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1700", v: +1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1600", v: +1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1500", v: +1500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "+1400", v: +1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1300", v: +1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1200", v: +1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1100", v: +1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-500", v: -500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1100", v: -1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1200", v: -1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1300", v: -1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1400", v: -1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1500", v: -1500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "-1600", v: -1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1700", v: -1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1800", v: -1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1900", v: -1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2000", v: -2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-2500", v: -2500, s: false, m: Line.None, l: Line.None },
                { c: "-3000", v: -3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-4000", v: -4000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-5000", v: -5000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-6000", v: -6000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-7000", v: -7000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-8000", v: -8000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-9000", v: -9000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-9999", v: -9999, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-99999", v: -99999, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-∞", v: -Infinity, s: false, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Tanh:
            return [
                { c: "+∞", v: +Infinity, s: false, m: Line.EBld, l: Line.None },
                { c: "+3000", v: +3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2500", v: +2500, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2000", v: +2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+1900", v: +1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1800", v: +1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1700", v: +1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1600", v: +1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1500", v: +1500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "+1400", v: +1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1300", v: +1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1200", v: +1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1100", v: +1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-500", v: -500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1100", v: -1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1200", v: -1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1300", v: -1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1400", v: -1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1500", v: -1500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "-1600", v: -1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1700", v: -1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1800", v: -1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1900", v: -1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2000", v: -2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-2500", v: -2500, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-3000", v: -3000, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-∞", v: -Infinity, s: false, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Linear1000:
            return [
                { c: "+1000", v: +1000, s: true, m: Line.EBld, l: Line.None },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+500", v: +500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-500", v: -500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Linear1200:
            return [
                { c: "+1200", v: +1200, s: true, m: Line.EBld, l: Line.None },
                { c: "+1100", v: +1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: true, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: true, m: Line.Bld, l: Line.Nml },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-500", v: -500, s: false, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: true, m: Line.Bld, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1100", v: -1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1200", v: -1200, s: true, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Linear2000:
            return [
                { c: "+2000", v: +2000, s: true, m: Line.EBld, l: Line.None },
                { c: "+1900", v: +1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1800", v: +1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1700", v: +1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1600", v: +1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1500", v: +1500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+1400", v: +1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1300", v: +1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1200", v: +1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1100", v: +1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-500", v: -500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1100", v: -1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1200", v: -1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1300", v: -1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1400", v: -1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1500", v: -1500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1600", v: -1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1700", v: -1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1800", v: -1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1900", v: -1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2000", v: -2000, s: true, m: Line.EBld, l: Line.None }
            ];
        case YAxis.Linear3000:
            return [
                { c: "+3000", v: +3000, s: true, m: Line.EBld, l: Line.None },
                { c: "+2900", v: +2900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2800", v: +2800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2700", v: +2700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2600", v: +2600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2500", v: +2500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+2400", v: +2400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2300", v: +2300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2200", v: +2200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2100", v: +2100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+2000", v: +2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+1900", v: +1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1800", v: +1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1700", v: +1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1600", v: +1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1500", v: +1500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+1400", v: +1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1300", v: +1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1200", v: +1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1100", v: +1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+1000", v: +1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+900", v: +900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+800", v: +800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+700", v: +700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+600", v: +600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+500", v: +500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "+400", v: +400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+300", v: +300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+200", v: +200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "+100", v: +100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "±0", v: 0, s: true, m: Line.EBld, l: Line.EBld },
                { c: "-100", v: -100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-200", v: -200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-300", v: -300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-400", v: -400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-500", v: -500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-600", v: -600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-700", v: -700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-800", v: -800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-900", v: -900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1000", v: -1000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1100", v: -1100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1200", v: -1200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1300", v: -1300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1400", v: -1400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1500", v: -1500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-1600", v: -1600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1700", v: -1700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1800", v: -1800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-1900", v: -1900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2000", v: -2000, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-2100", v: -2100, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2200", v: -2200, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2300", v: -2300, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2400", v: -2400, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2500", v: -2500, s: true, m: Line.Bld, l: Line.Bld },
                { c: "-2600", v: -2600, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2700", v: -2700, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2800", v: -2800, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-2900", v: -2900, s: false, m: Line.Nml, l: Line.Nml },
                { c: "-3000", v: -3000, s: true, m: Line.EBld, l: Line.None }
            ];
        default:
            return [];
    }
}

function writeSvg<GElement extends BaseType>(
    parlent: Selection<GElement, unknown, HTMLElement, unknown>,
    {
        maxPly,
        width,
        height,
        pad,
        capPad,
        lWidthNml,
        lWidthBld,
        lWidthBorder,
        lWidthScore,
        scaleLength,
        scalePad,
        cRadiusScore,
        colorBackground,
        colorGridNml,
        colorGridBld,
        colorGridEBld,
        colorGridBorder,
        colorPly,
        colorPlayer0,
        colorPlayer1,
        colorPlayer2,
        colorCap,
        fSizeLw,
        fSizeLh,
        fSizeRw,
        fSizeRh,
        fSizeBw,
        fSizeBh,
        fSizeCap,
        plotYAxisType,
        gridYAxisType,
        lType,
        rType,
        tType,
        bType,
        score,
        comment,
        caption,
        capLink,
        plyCallback
    }: SvgScoreGraphProp
): void {
    const hheight = height / 2;
    const fix = (v: number): string => v.toFixed(3).replace(/\.?0+$/, "");
    const vPerScore = (_value: number): number =>
        600 * Math.log(_value / (1 - _value));
    const scoreEval: (n: number) => number = getScoreEval(plotYAxisType);
    const vper: Mark[] = getVper(plotYAxisType);
    const vsc: Mark[] = getVsc(plotYAxisType);
    const gryphHeight = 0.75;
    const gryphFamilyInconsolata: GryphFamilyInfo = {
        n: "Inconsolata",
        s: "https://github.com/google/fonts/tree/master/ofl/inconsolata",
        l: "https://github.com/google/fonts/blob/master/ofl/inconsolata/OFL.txt"
    };
    const gryphFamilyDejavuSans: GryphFamilyInfo = {
        n: "DejaVu Sans",
        s: "https://dejavu-fonts.github.io/",
        l: "https://dejavu-fonts.github.io/License.html"
    };
    const gryphData: {
        [char: string]:
            | { i: string; f: GryphFamilyInfo; p: string; w: number }
            | undefined;
    } = {
        // embedded "Inconsolata" font gryph
        // https://github.com/google/fonts/tree/master/ofl/inconsolata
        // https://github.com/google/fonts/blob/master/ofl/inconsolata/OFL.txt
        /*
        "%": {w: 0.45, p: "M-0.11,-0.073Q-0.14,-0.073 -0.166,-0.099Q-0.191,-0.107 -0.207,-0.137Q-0.222,-0.167 -0.222,-0.204Q-0.222,-0.241 -0.207,-0.279Q-0.191,-0.299 -0.166,-0.316Q-0.14,-0.334 -0.11,-0.334Q-0.079,-0.334 -0.054,-0.316Q-0.029,-0.299 -0.014,-0.269Q0.002,-0.249 0.002,-0.203Q0.002,-0.146 -0.03,-0.109Q-0.062,-0.073 -0.11,-0.073ZM-0.204,0.3L0.141,-0.323H0.198L-0.15,0.3ZM-0.11,-0.126Q-0.091,-0.126 -0.076,-0.143Q-0.061,-0.161 -0.061,-0.204Q-0.061,-0.247 -0.077,-0.264Q-0.093,-0.282 -0.112,-0.282Q-0.13,-0.282 -0.146,-0.264Q-0.161,-0.247 -0.161,-0.204Q-0.161,-0.162 -0.145,-0.144Q-0.129,-0.126 -0.11,-0.126ZM0.121,0.31Q0.091,0.31 0.065,0.293Q0.04,0.276 0.024,0.247Q0.009,0.217 0.009,0.181Q0.009,0.144 0.024,0.115Q0.04,0.086 0.065,0.069Q0.091,0.051 0.121,0.051Q0.152,0.051 0.177,0.069Q0.202,0.086 0.217,0.116Q0.232,0.145 0.232,0.181Q0.232,0.217 0.217,0.247Q0.202,0.276 0.176,0.293Q0.151,0.31 0.121,0.31ZM0.122,0.26Q0.142,0.26 0.157,0.241Q0.173,0.222 0.173,0.182Q0.173,0.147 0.159,0.125Q0.145,0.102 0.12,0.102Q0.1,0.102 0.084,0.12Q0.068,0.138 0.068,0.18Q0.068,0.223 0.085,0.242Q0.102,0.26 0.122,0.26Z"},
        "+": {w: 0.45, p: "M-0.029,-0.238V-0.068H-0.206V-0.006H-0.029V0.181H0.034V-0.006H0.205V-0.068H0.034V-0.238Z"},
        "-": {w: 0.45, p: "M-0.18,-0.063V0.003H0.18V-0.063Z"},
        ".": {w: 0.45, p: "M0.047,0.238C0.047,0.207 0.021,0.181 -0.012,0.181C-0.045,0.181 -0.071,0.207 -0.071,0.238C-0.071,0.27 -0.045,0.296 -0.012,0.296C0.021,0.296 0.047,0.27 0.047,0.238Z"},
        "0": {w: 0.45, p: "M0,-0.343C-0.099,-0.343 -0.201,-0.221 -0.201,-0.022C-0.201,0.18 -0.098,0.296 0.001,0.296C0.091,0.296 0.198,0.198 0.198,-0.017C0.198,-0.229 0.096,-0.343 0,-0.343ZM0.097,-0.2L-0.122,0.084C-0.131,0.049 -0.136,0.01 -0.136,-0.034C-0.136,-0.194 -0.063,-0.282 -0.001,-0.282C0.033,-0.282 0.07,-0.255 0.097,-0.2ZM0.12,-0.134C0.129,-0.099 0.133,-0.057 0.133,-0.008C0.133,0.166 0.058,0.232 0.003,0.232C-0.034,0.232 -0.072,0.202 -0.099,0.147Z"},
        "1": {w: 0.45, p: "M0.049,-0.339H0.001L-0.162,-0.254L-0.146,-0.215L-0.021,-0.252V0.285H0.049Z"},
        "2": {w: 0.45, p: "M-0.173,-0.242L-0.122,-0.201C-0.116,-0.21 -0.119,-0.216 -0.113,-0.224C-0.098,-0.247 -0.061,-0.281 -0.007,-0.281C0.06,-0.281 0.113,-0.23 0.113,-0.163C0.113,-0.087 0.049,-0.032 0.004,0.009C-0.067,0.073 -0.125,0.137 -0.177,0.24V0.284H0.189V0.215C0.182,0.212 0.177,0.217 0.175,0.219C0.171,0.223 0.169,0.223 0.165,0.223H-0.097C-0.045,0.133 0.028,0.071 0.073,0.029C0.118,-0.014 0.182,-0.078 0.182,-0.168C0.182,-0.265 0.103,-0.343 0.002,-0.343C-0.069,-0.343 -0.136,-0.305 -0.173,-0.242Z"},
        "3": {w: 0.45, p: "M0.16,-0.183C0.16,-0.268 0.088,-0.341 -0.011,-0.341C-0.067,-0.341 -0.122,-0.317 -0.161,-0.274L-0.122,-0.231C-0.093,-0.262 -0.053,-0.279 -0.014,-0.279C0.05,-0.279 0.094,-0.234 0.094,-0.181C0.094,-0.144 0.071,-0.102 0.027,-0.083C0.016,-0.079 -0.012,-0.068 -0.071,-0.068V-0.012C-0.061,-0.013 -0.05,-0.014 -0.039,-0.014C0.045,-0.014 0.107,0.03 0.107,0.105C0.107,0.173 0.055,0.232 -0.018,0.232C-0.076,0.232 -0.111,0.194 -0.116,0.189C-0.124,0.18 -0.12,0.17 -0.129,0.161L-0.181,0.224C-0.14,0.271 -0.08,0.295 -0.018,0.295C0.102,0.295 0.174,0.21 0.174,0.113C0.174,0.039 0.132,-0.024 0.067,-0.048C0.123,-0.069 0.16,-0.122 0.16,-0.183Z"},
        "4": {w: 0.45, p: "M0.063,-0.339L-0.202,0.06V0.112H0.049V0.284H0.121V0.113H0.202V0.051H0.121V-0.339ZM0.05,-0.228V0.051H-0.133Z"},
        "5": {w: 0.45, p: "M-0.144,-0.339L-0.166,-0.022L-0.121,-0.004C-0.091,-0.042 -0.047,-0.063 -0.004,-0.063C0.061,-0.063 0.123,-0.013 0.123,0.086C0.123,0.182 0.064,0.234 -0.003,0.234C-0.07,0.234 -0.114,0.183 -0.117,0.177C-0.121,0.169 -0.116,0.159 -0.125,0.153L-0.187,0.2C-0.145,0.261 -0.076,0.296 -0.002,0.296C0.106,0.296 0.195,0.223 0.195,0.088C0.195,-0.046 0.111,-0.12 0.006,-0.12C-0.028,-0.12 -0.063,-0.112 -0.095,-0.096L-0.086,-0.276H0.172V-0.339Z"},
        "6": {w: 0.45, p: "M0.037,-0.346C-0.038,-0.346 -0.118,-0.3 -0.157,-0.191C-0.178,-0.132 -0.183,-0.059 -0.183,0.001C-0.183,0.074 -0.176,0.152 -0.136,0.212C-0.1,0.267 -0.044,0.295 0.011,0.295C0.106,0.295 0.189,0.215 0.189,0.086C0.189,-0.043 0.106,-0.118 0.018,-0.118C-0.036,-0.118 -0.087,-0.089 -0.114,-0.043C-0.11,-0.256 -0.008,-0.284 0.037,-0.284C0.078,-0.284 0.106,-0.262 0.11,-0.258C0.116,-0.251 0.116,-0.242 0.125,-0.235L0.173,-0.289C0.137,-0.325 0.087,-0.346 0.037,-0.346ZM0.011,-0.056C0.061,-0.056 0.121,-0.017 0.121,0.09C0.121,0.187 0.067,0.233 0.014,0.233C-0.062,0.233 -0.119,0.144 -0.111,0.027C-0.083,-0.024 -0.035,-0.056 0.011,-0.056Z"},
        "7": {w: 0.45, p: "M-0.172,-0.339V-0.272H0.095C0.063,-0.198 0.033,-0.124 0.004,-0.049C-0.038,0.061 -0.078,0.172 -0.115,0.284H-0.036C-0.006,0.186 0.027,0.089 0.063,-0.007C0.099,-0.106 0.139,-0.203 0.181,-0.3V-0.339Z"},
        "8": {w: 0.45, p: "M0.008,-0.346C-0.088,-0.346 -0.161,-0.277 -0.161,-0.193C-0.161,-0.132 -0.122,-0.076 -0.066,-0.047C-0.14,-0.012 -0.19,0.056 -0.19,0.128C-0.19,0.221 -0.108,0.295 -0.001,0.295C0.108,0.295 0.191,0.219 0.191,0.124C0.191,0.05 0.141,-0.016 0.071,-0.049C0.131,-0.08 0.17,-0.139 0.17,-0.199C0.17,-0.281 0.099,-0.346 0.008,-0.346ZM-0.013,-0.018C0.067,0.007 0.12,0.062 0.12,0.123C0.12,0.183 0.069,0.232 0.002,0.232C-0.066,0.232 -0.118,0.181 -0.118,0.119C-0.118,0.06 -0.072,0.006 -0.013,-0.018ZM0.002,-0.288C0.058,-0.288 0.102,-0.246 0.102,-0.194C0.102,-0.146 0.065,-0.1 0.016,-0.074C0.016,-0.074 -0.094,-0.116 -0.094,-0.199C-0.094,-0.248 -0.052,-0.288 0.002,-0.288Z"},
        "9": {w: 0.45, p: "M-0.033,0.295C0.043,0.295 0.122,0.249 0.16,0.15C0.171,0.121 0.187,0.067 0.187,-0.035C0.187,-0.113 0.18,-0.167 0.165,-0.209C0.133,-0.305 0.061,-0.345 -0.004,-0.345C-0.101,-0.345 -0.182,-0.259 -0.182,-0.138C-0.182,-0.019 -0.102,0.058 -0.011,0.058C0.04,0.058 0.088,0.033 0.117,-0.009C0.114,0.088 0.098,0.13 0.092,0.145C0.065,0.208 0.013,0.231 -0.031,0.231C-0.076,0.231 -0.106,0.209 -0.106,0.208C-0.115,0.202 -0.112,0.191 -0.123,0.184L-0.171,0.238C-0.134,0.274 -0.085,0.295 -0.033,0.295ZM-0.005,-0.003C-0.06,-0.003 -0.114,-0.048 -0.114,-0.141C-0.114,-0.232 -0.062,-0.283 -0.005,-0.283C0.065,-0.283 0.125,-0.205 0.114,-0.079C0.086,-0.032 0.04,-0.003 -0.005,-0.003Z"},
        "±": {w: 0.45, p: "M-0.205,0.204V0.267H0.207V0.204ZM-0.029,-0.29V-0.119H-0.206V-0.058H-0.029V0.129H0.034V-0.058H0.205V-0.119H0.034V-0.29Z"},
        */
        "%": {
            i: "k",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.11-.073q-.03 0-.056-.026-.025-.008-.041-.038-.015-.03-.015-.067 0-.037.015-.075.016-.02.041-.037.026-.018.056-.018.031 0 .056.018.025.017.04.047.016.02.016.066 0 .057-.032.094-.032.036-.08.036zM-.204.3l.345-.623h.057L-.15.3zm.094-.426q.019 0 .034-.017.015-.018.015-.061t-.016-.06q-.016-.018-.035-.018-.018 0-.034.018-.015.017-.015.06 0 .042.016.06.016.018.035.018zM.121.31Q.091.31.065.293.04.276.024.247.009.217.009.181q0-.037.015-.066Q.04.086.065.069.091.051.121.051q.031 0 .056.018.025.017.04.047.015.029.015.065 0 .036-.015.066Q.202.276.176.293.151.31.121.31zM.122.26q.02 0 .035-.019Q.173.222.173.182q0-.035-.014-.057Q.145.102.12.102.1.102.084.12.068.138.068.18q0 .043.017.062Q.102.26.122.26z"
        },
        "+": {
            i: "l",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.029-.238v.17h-.177v.062h.177v.187h.063v-.187h.171v-.062H.034v-.17z"
        },
        "-": {
            i: "m",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p: "M-.18-.063v.066h.36v-.066z"
        },
        ".": {
            i: "n",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M.047.238A.058.058 0 00-.012.181a.058.058 0 00-.059.057c0 .032.026.058.059.058A.058.058 0 00.047.238z"
        },
        "0": {
            i: "a",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M0-.343c-.099 0-.201.122-.201.321 0 .202.103.318.202.318.09 0 .197-.098.197-.313C.198-.229.096-.343 0-.343zM.097-.2l-.219.284a.471.471 0 01-.014-.118c0-.16.073-.248.135-.248.034 0 .071.027.098.082zm.023.066a.514.514 0 01.013.126c0 .174-.075.24-.13.24-.037 0-.075-.03-.102-.085z"
        },
        "1": {
            i: "b",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p: "M.049-.339H.001l-.163.085.016.039.125-.037v.537h.07z"
        },
        "2": {
            i: "c",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.173-.242l.051.041c.006-.009.003-.015.009-.023a.13.13 0 01.106-.057c.067 0 .12.051.12.118 0 .076-.064.131-.109.172A.742.742 0 00-.177.24v.044h.366V.215C.182.212.177.217.175.219.171.223.169.223.165.223h-.262c.052-.09.125-.152.17-.194.045-.043.109-.107.109-.197a.176.176 0 00-.18-.175.204.204 0 00-.175.101z"
        },
        "3": {
            i: "d",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M.16-.183c0-.085-.072-.158-.171-.158a.203.203 0 00-.15.067l.039.043a.15.15 0 01.108-.048c.064 0 .108.045.108.098a.11.11 0 01-.067.098c-.011.004-.039.015-.098.015v.056a.323.323 0 01.032-.002c.084 0 .146.044.146.119a.125.125 0 01-.125.127c-.058 0-.093-.038-.098-.043C-.124.18-.12.17-.129.161l-.052.063a.214.214 0 00.163.071C.102.295.174.21.174.113a.168.168 0 00-.107-.161.143.143 0 00.093-.135z"
        },
        "4": {
            i: "e",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M.063-.339L-.202.06v.052h.251v.172h.072V.113h.081V.051H.121v-.39zM.05-.228v.279h-.183z"
        },
        "5": {
            i: "f",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.144-.339l-.022.317.045.018a.151.151 0 01.117-.059c.065 0 .127.05.127.149 0 .096-.059.148-.126.148A.15.15 0 01-.117.177C-.121.169-.116.159-.125.153L-.187.2a.223.223 0 00.185.096C.106.296.195.223.195.088.195-.046.111-.12.006-.12a.227.227 0 00-.101.024l.009-.18h.258v-.063z"
        },
        "6": {
            i: "g",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M.037-.346c-.075 0-.155.046-.194.155a.601.601 0 00-.026.192.38.38 0 00.047.211.176.176 0 00.147.083c.095 0 .178-.08.178-.209S.106-.118.018-.118a.154.154 0 00-.132.075c.004-.213.106-.241.151-.241.041 0 .069.022.073.026.006.007.006.016.015.023l.048-.054a.195.195 0 00-.136-.057zm-.026.29c.05 0 .11.039.11.146 0 .097-.054.143-.107.143-.076 0-.133-.089-.125-.206.028-.051.076-.083.122-.083z"
        },
        "7": {
            i: "h",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.172-.339v.067h.267a6.129 6.129 0 00-.21.556h.079A4.98 4.98 0 01.181-.3v-.039z"
        },
        "8": {
            i: "i",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M.008-.346c-.096 0-.169.069-.169.153a.17.17 0 00.095.146C-.14-.012-.19.056-.19.128c0 .093.082.167.189.167.109 0 .192-.076.192-.171 0-.074-.05-.14-.12-.173a.175.175 0 00.099-.15c0-.082-.071-.147-.162-.147zm-.021.328c.08.025.133.08.133.141 0 .06-.051.109-.118.109-.068 0-.12-.051-.12-.113 0-.059.046-.113.105-.137zm.015-.27c.056 0 .1.042.1.094 0 .048-.037.094-.086.12 0 0-.11-.042-.11-.125 0-.049.042-.089.096-.089z"
        },
        "9": {
            i: "j",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.033.295C.043.295.122.249.16.15a.505.505 0 00.027-.185.521.521 0 00-.022-.174C.133-.305.061-.345-.004-.345c-.097 0-.178.086-.178.207 0 .119.08.196.171.196a.156.156 0 00.128-.067.433.433 0 01-.025.154.133.133 0 01-.198.063C-.115.202-.112.191-.123.184l-.048.054a.198.198 0 00.138.057zm.028-.298c-.055 0-.109-.045-.109-.138 0-.091.052-.142.109-.142.07 0 .13.078.119.204-.028.047-.074.076-.119.076z"
        },
        "±": {
            i: "o",
            f: gryphFamilyInconsolata,
            w: 0.45,
            p:
                "M-.205.204v.063h.412V.204zm.176-.494v.171h-.177v.061h.177v.187h.063v-.187h.171v-.061H.034V-.29z"
        },
        // "Infinity" symbol gryph import from "DejaVu Sans" font and modify full-width
        // https://dejavu-fonts.github.io/
        // https://dejavu-fonts.github.io/License.html
        /*
        "∞": {w: 0.90, p: "M0.054,0.112Q0.033,0.093 -0.001,0.048Q-0.046,0.112 -0.087,0.14Q-0.138,0.174 -0.216,0.174Q-0.308,0.174 -0.369,0.12Q-0.433,0.063 -0.433,-0.031Q-0.433,-0.121 -0.369,-0.182Q-0.312,-0.236 -0.215,-0.236Q-0.165,-0.236 -0.128,-0.22Q-0.085,-0.202 -0.056,-0.172Q-0.029,-0.145 -0.001,-0.108Q0.045,-0.172 0.085,-0.201Q0.136,-0.235 0.214,-0.235Q0.306,-0.235 0.367,-0.181Q0.431,-0.124 0.431,-0.03Q0.431,0.06 0.367,0.121Q0.31,0.175 0.213,0.175Q0.163,0.175 0.126,0.159Q0.089,0.144 0.054,0.111ZM-0.224,0.104Q-0.111,0.104 -0.044,-0.025Q-0.131,-0.166 -0.224,-0.166Q-0.292,-0.166 -0.327,-0.127Q-0.365,-0.086 -0.365,-0.031Q-0.365,0.029 -0.327,0.066Q-0.289,0.104 -0.224,0.104ZM0.222,-0.164Q0.12,-0.164 0.042,-0.035Q0.128,0.106 0.222,0.106Q0.29,0.106 0.325,0.067Q0.363,0.026 0.363,-0.029Q0.363,-0.089 0.325,-0.126Q0.287,-0.164 0.222,-0.164Z"},
        */
        "∞": {
            i: "p",
            f: gryphFamilyDejavuSans,
            w: 0.9,
            p:
                "M.054.112Q.033.093-.001.048-.046.112-.087.14q-.051.034-.129.034-.092 0-.153-.054-.064-.057-.064-.151 0-.09.064-.151.057-.054.154-.054.05 0 .087.016.043.018.072.048.027.027.055.064.046-.064.086-.093.051-.034.129-.034.092 0 .153.054.064.057.064.151 0 .09-.064.151Q.31.175.213.175q-.05 0-.087-.016Q.089.144.054.111zM-.224.104q.113 0 .18-.129-.087-.141-.18-.141-.068 0-.103.039-.038.041-.038.096 0 .06.038.097.038.038.103.038zm.446-.268q-.102 0-.18.129.086.141.18.141.068 0 .103-.039.038-.041.038-.096 0-.06-.038-.097Q.287-.164.222-.164z"
        }
    };
    const strPxWidth = (str: string): number =>
        // 文字列の文字配列化で str.split("") を用いるとUn: icode文字（コードポイント）毎ではなく、
        // UTF-16コードユニット毎に分割されるため、U+10000以上のコードポイントの文字はサロゲートペアが破壊される。
        // 代わりに [...str] や Array.from(str) 等を用いる。
        // cf: https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript/34717402#34717402
        [...str].reduce((p, c) => p + (gryphData[c]?.w ?? 0), 0);
    const strSubGryphId = (str: string, i: number): string =>
        gryphData[str.charAt(i)]?.i ?? "";
    const hsc = ((): {
        v: number;
        s: boolean;
        m: 0 | 1 | 2 | 3;
        l: 0 | 1 | 2 | 3;
    }[] => {
        const res: { v: number; s: boolean; m: Line; l: Line }[] = [
            {
                v: 1,
                s: true,
                m: Line.EBld,
                l: Line.Nml
            }
        ];
        for (let i = 10; i <= width; i += 10) {
            res.push({
                v: i,
                s:
                    (i % 50 === 0 || i + 10 > maxPly) &&
                    (i === maxPly ||
                        i + strPxWidth(`${maxPly}`) * fSizeBw < maxPly),
                m:
                    i === width
                        ? Line.None
                        : i % 50 !== 0
                        ? Line.Nml
                        : Line.EBld,
                l: i === width ? Line.None : i % 50 !== 0 ? Line.Nml : Line.Bld
            });
        }
        if (maxPly % 10 !== 0) {
            res.push({
                v: maxPly,
                s: true,
                m: maxPly % 50 !== 0 ? Line.Nml : Line.EBld,
                l: maxPly % 50 !== 0 ? Line.Nml : Line.Bld
            });
        }
        return res;
    })();
    const rgb = (v: { r: number; g: number; b: number }): string => {
        const a = [v.r, v.g, v.b].map(c => Math.round(c));
        return (
            "#" +
            a
                .map(c =>
                    a.some(n => n % 17 !== 0)
                        ? (c + 256).toString(16).substr(1)
                        : (c / 17).toString(16)
                )
                .join("")
        );
    };
    const vRgb = (v: number): string => {
        const a = (e: "r" | "g" | "b"): number =>
            colorPlayer0[e] * (1 - Math.abs(v)) +
            colorPlayer1[e] * Math.max(v, 0) +
            colorPlayer2[e] * Math.max(-v, 0);
        return rgb({ r: a("r"), g: a("g"), b: a("b") });
    };
    const lPad =
        Math.max(
            lType === 1
                ? fSizeLw * strPxWidth("+9999") + scaleLength * 1.25
                : lType === 2
                ? fSizeLw * strPxWidth("100%") + scaleLength * 1.25
                : 0,
            (fSizeBw * strPxWidth("0")) / 2
        ) + pad;
    const rPad =
        Math.max(
            rType === 1
                ? fSizeRw * strPxWidth("+9999") + scaleLength * 1.25
                : rType === 2
                ? fSizeRw * strPxWidth("100%") + scaleLength * 1.25
                : 0,
            (fSizeBw * strPxWidth(maxPly.toFixed())) / 2 - maxPly + width
        ) + pad;
    const tCapBase =
        (tType === 1 ? fSizeBh * gryphHeight + scalePad : 0) + capPad;
    const tPad =
        Math.max(
            (tType === 1 ? fSizeBh * gryphHeight + scalePad : 0) +
                (caption && fSizeCap ? fSizeCap + capPad : 0),
            lType === 1 || lType === 2 ? (fSizeLh * gryphHeight) / 2 : 0,
            rType === 1 || rType === 2 ? (fSizeRh * gryphHeight) / 2 : 0
        ) + pad;
    const bPad =
        Math.max(
            bType === 1 ? fSizeBh * gryphHeight + scaleLength * 1.25 : 0,
            lType === 1 || lType === 2 ? (fSizeLh * gryphHeight) / 2 : 0,
            rType === 1 || rType === 2 ? (fSizeRh * gryphHeight) / 2 : 0
        ) + pad;
    const svg = parlent
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr(
            "viewBox",
            `${fix(-lPad)} ${fix(-tPad - hheight)} ${fix(
                width + lPad + rPad
            )} ${fix(height + tPad + bPad)}`
        );
    const defs = svg.append("defs");
    Object.keys(gryphData).forEach(char => {
        const data = gryphData[char];
        if (data) {
            defs.append("path")
                .attr("id", strSubGryphId(char, 0))
                .attr("d", data.p)
                .attr("data-font-family", data.f.n)
                .attr("data-font-src", data.f.s)
                .attr("data-font-license", data.f.l);
        }
    });
    svg.append("rect")
        .attr("x", fix(-lPad))
        .attr("y", fix(-tPad - hheight))
        .attr("width", fix(width + lPad + rPad))
        .attr("height", fix(height + tPad + bPad))
        .attr("fill", rgb(colorBackground));
    const charG = svg.append("g");
    const scaleG = svg.append("g");
    let pathEBold = "";
    let pathBld = "";
    let pathNml = "";
    let pathBorder = `M0,${-hheight}h${width}v${height}h${-width}z`;
    hsc.forEach(e => {
        const s = `M${e.v},${-hheight}v${height}`;
        switch (e.l) {
            case Line.Nml:
                pathNml += s;
                break;
            case Line.Bld:
                pathBld += s;
                break;
            case Line.EBld:
                pathEBold += s;
                break;
        }
    });
    switch (gridYAxisType) {
        case YScale.Score:
            vsc.forEach(e => {
                if (isFinite(e.v)) {
                    const v = scoreEval(e.v);
                    const y = fix(-hheight * v);
                    const s = `M0,${y}h${width}`;
                    switch (e.l) {
                        case Line.Nml:
                            pathNml += s;
                            break;
                        case Line.Bld:
                            pathBld += s;
                            break;
                        case Line.EBld:
                            pathEBold += s;
                            break;
                    }
                }
            });
            break;
        case YScale.WinRate:
            vper.forEach(e => {
                const v = scoreEval(vPerScore(e.v));
                const y = fix(-hheight * v);
                const s = `M0,${y}h${width}`;
                switch (e.l) {
                    case Line.Nml:
                        pathNml += s;
                        break;
                    case Line.Bld:
                        pathBld += s;
                        break;
                    case Line.EBld:
                        pathEBold += s;
                        break;
                }
            });
            break;
    }
    switch (lType) {
        case YScale.Score:
            vsc.forEach(e => {
                const v = scoreEval(e.v);
                const y = fix(-hheight * v);
                const str = e.c;
                if (e.s) {
                    const g = charG.append("g").attr("fill", vRgb(v));
                    [...str].forEach((c, i) => {
                        g.append("use")
                            .attr("xlink:href", "#" + strSubGryphId(str, i))
                            .attr(
                                "transform",
                                `matrix(${fSizeLw} 0 0 ${fSizeLh} ${fix(
                                    -fSizeLw *
                                        (strPxWidth(str.substring(i + 1)) +
                                            strPxWidth(c) / 2) -
                                        scalePad
                                )} ${y})`
                            );
                    });
                }
                if (e.m !== Line.None) {
                    scaleG
                        .append("path")
                        .attr("d", `M0,${y}h${-scaleLength}`)
                        .attr("stroke", vRgb(v))
                        .attr(
                            "stroke-width",
                            e.m === Line.EBld
                                ? lWidthBorder
                                : e.m === Line.Bld
                                ? lWidthBld
                                : e.m === Line.Nml
                                ? lWidthNml
                                : 0
                        );
                }
            });
            break;
        case YScale.WinRate:
            vper.forEach(e => {
                const v = scoreEval(vPerScore(e.v));
                const y = fix(-hheight * v);
                const str = e.c;
                if (e.s) {
                    const g = charG.append("g").attr("fill", vRgb(v));
                    [...str].forEach((c, i) => {
                        g.append("use")
                            .attr("xlink:href", "#" + strSubGryphId(str, i))
                            .attr(
                                "transform",
                                `matrix(${fSizeLw} 0 0 ${fSizeLh} ${fix(
                                    -fSizeLw *
                                        (strPxWidth(str.substring(i)) -
                                            strPxWidth(c) / 2) -
                                        scalePad
                                )} ${y})`
                            );
                    });
                }
                if (e.m !== Line.None) {
                    scaleG
                        .append("path")
                        .attr("d", `M0,${y}h${-scaleLength}`)
                        .attr("stroke", vRgb(v))
                        .attr(
                            "stroke-width",
                            e.m === Line.EBld
                                ? lWidthBorder
                                : e.m === Line.Bld
                                ? lWidthBld
                                : e.m === Line.Nml
                                ? lWidthNml
                                : 0
                        );
                }
            });
            break;
    }
    switch (rType) {
        case YScale.Score:
            vsc.forEach(e => {
                const v = scoreEval(e.v);
                const y = fix(-hheight * v);
                const str = e.c;
                if (e.s) {
                    const g = charG.append("g").attr("fill", vRgb(v));
                    [...str].forEach((c, i) => {
                        g.append("use")
                            .attr("xlink:href", "#" + strSubGryphId(str, i))
                            .attr(
                                "transform",
                                `matrix(${fSizeRw} 0 0 ${fSizeRh} ${fix(
                                    fSizeRw *
                                        (strPxWidth(str.substring(0, i)) +
                                            strPxWidth(c) / 2) +
                                        scalePad +
                                        width
                                )} ${y})`
                            );
                    });
                }
                if (e.m !== Line.None) {
                    scaleG
                        .append("path")
                        .attr("d", `M${width},${y}h${scaleLength}`)
                        .attr("stroke", vRgb(v))
                        .attr(
                            "stroke-width",
                            e.m === Line.EBld
                                ? lWidthBorder
                                : e.m === Line.Bld
                                ? lWidthBld
                                : e.m === Line.Nml
                                ? lWidthNml
                                : 0
                        );
                }
            });
            break;
        case YScale.WinRate:
            vper.forEach(e => {
                const v = scoreEval(vPerScore(e.v));
                const y = fix(-hheight * v);
                const str = e.c;
                if (e.s) {
                    const g = charG.append("g").attr("fill", vRgb(v));
                    [...str].forEach((c, i) => {
                        g.append("use")
                            .attr("xlink:href", "#" + strSubGryphId(str, i))
                            .attr(
                                "transform",
                                `matrix(${fSizeRw} 0 0 ${fSizeRh} ${fix(
                                    fSizeRw *
                                        (strPxWidth(str.substring(0, i)) +
                                            strPxWidth(c) / 2) +
                                        scalePad +
                                        width
                                )} ${y})`
                            );
                    });
                }
                if (e.m !== Line.None) {
                    scaleG
                        .append("path")
                        .attr("d", `M${width},${y}h${scaleLength}`)
                        .attr("stroke", vRgb(v))
                        .attr(
                            "stroke-width",
                            e.m === Line.EBld
                                ? lWidthBorder
                                : e.m === Line.Bld
                                ? lWidthBld
                                : e.m === Line.Nml
                                ? lWidthNml
                                : 0
                        );
                }
            });
            break;
    }
    switch (tType) {
        case XScale.Ply:
            {
                const g = charG.append("g").attr("fill", rgb(colorPly));
                hsc.forEach(e => {
                    if (e.s) {
                        const str = `${e.v}`;
                        [...str].forEach((c, i) => {
                            g.append("use")
                                .attr("xlink:href", "#" + strSubGryphId(str, i))
                                .attr(
                                    "transform",
                                    `matrix(${fSizeBw} 0 0 ${fSizeBh} ${e.v +
                                        fSizeBw *
                                            (strPxWidth(str.substring(0, i)) +
                                                strPxWidth(c) / 2 -
                                                strPxWidth(str) /
                                                    2)} ${-hheight -
                                        (fSizeBh * gryphHeight) / 2 -
                                        scalePad})`
                                );
                        });
                        pathBorder += `M${e.v},${-hheight -
                            scaleLength}v${scaleLength}`;
                    }
                });
            }
            break;
    }
    switch (bType) {
        case XScale.Ply:
            {
                const g = charG.append("g").attr("fill", rgb(colorPly));
                hsc.forEach(e => {
                    if (e.s) {
                        const str = `${e.v}`;
                        [...str].forEach((c, i) => {
                            g.append("use")
                                .attr("xlink:href", "#" + strSubGryphId(str, i))
                                .attr(
                                    "transform",
                                    `matrix(${fSizeBw} 0 0 ${fSizeBh} ${e.v +
                                        fSizeBw *
                                            (strPxWidth(str.substring(0, i)) +
                                                strPxWidth(c) / 2 -
                                                strPxWidth(str) /
                                                    2)} ${hheight +
                                        (fSizeBh * gryphHeight) / 2 +
                                        scalePad})`
                                );
                        });
                        pathBorder += `M${e.v},${hheight}v${scaleLength}`;
                    }
                });
            }
            break;
    }
    if (pathNml) {
        svg.append("path")
            .attr("d", pathNml)
            .attr("stroke", rgb(colorGridNml))
            .attr("stroke-width", lWidthNml);
    }
    if (pathBld) {
        svg.append("path")
            .attr("d", pathBld)
            .attr("stroke", rgb(colorGridBld))
            .attr("stroke-width", lWidthBld);
    }
    if (pathEBold) {
        svg.append("path")
            .attr("d", pathEBold)
            .attr("stroke", rgb(colorGridEBld))
            .attr("stroke-width", lWidthBorder);
    }
    if (pathBorder) {
        svg.append("path")
            .attr("d", pathBorder)
            .attr("stroke", rgb(colorGridBorder))
            .attr("stroke-width", lWidthBorder)
            .attr("fill", "none");
    }
    if (score.length) {
        let pathA = "";
        let pathB = "";
        score.forEach((v, i) => {
            if (!isNaN(v)) {
                const y = fix(-hheight * scoreEval(v));
                if (i % 2 === 1) {
                    pathA += `${pathA !== "" ? "L" : "M"}${i},${y}`;
                } else {
                    pathB += `${pathB !== "" ? "L" : "M"}${i},${y}`;
                }
            }
        });
        const scoreG = svg.append("g");
        scoreG
            .append("path")
            .attr("d", pathA)
            .attr("fill", "none")
            .attr("stroke", rgb(colorPlayer1))
            .attr("stroke-width", `${lWidthScore}`);
        scoreG
            .append("path")
            .attr("d", pathB)
            .attr("fill", "none")
            .attr("stroke", rgb(colorPlayer2))
            .attr("stroke-width", `${lWidthScore}`);
        const scoreCircleG = scoreG.append("g");
        score.forEach((v, i) => {
            if (!isNaN(v)) {
                const y = fix(-hheight * scoreEval(v));
                const g = scoreCircleG.append("g");
                g.append("title").text(comment[i]);
                g.append("circle")
                    .attr("cx", i)
                    .attr("cy", y)
                    .attr("r", cRadiusScore)
                    .attr(
                        "fill",
                        rgb(i % 2 === 1 ? colorPlayer1 : colorPlayer2)
                    )
                    .on("click", () => {
                        plyCallback(i);
                    });
            }
        });
    }
    if (caption && fSizeCap) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -hheight - tCapBase)
            .attr("text-anchor", "middle")
            .attr("font-size", `${fSizeCap}`)
            .attr("fill", rgb(colorCap))
            .append("a")
            .attr("xlink:href", capLink ?? "")
            .attr("style", `color:${rgb(colorCap)}`)
            .attr("target", "_blank")
            .text(caption);
    }
}

export function doWrite<GElement extends BaseType>(
    parlent: Selection<GElement, unknown, HTMLElement, unknown>,
    p: Partial<SvgScoreGraphProp>
): void {
    writeSvg(
        parlent,
        Object.assign<SvgScoreGraphProp, Partial<SvgScoreGraphProp>>(
            {
                maxPly: 256,
                width: 256,
                height: 48,
                pad: 1.0,
                capPad: 1.5,
                lWidthNml: 0.06,
                lWidthBld: 0.18,
                lWidthBorder: 0.24,
                lWidthScore: 0.36,
                scaleLength: 1.5,
                scalePad: 2,
                cRadiusScore: 0.8,
                colorBackground: { r: 255, g: 255, b: 255 },
                colorGridNml: { r: 170, g: 170, b: 170 },
                colorGridBld: { r: 136, g: 136, b: 136 },
                colorGridEBld: { r: 68, g: 68, b: 68 },
                colorGridBorder: { r: 0, g: 0, b: 0 },
                colorPly: { r: 0, g: 0, b: 0 },
                colorPlayer0: { r: 0, g: 0, b: 0 },
                colorPlayer1: { r: 255, g: 51, b: 0 },
                colorPlayer2: { r: 0, g: 51, b: 255 },
                colorCap: { r: 0, g: 0, b: 0 },
                fSizeLw: 4,
                fSizeLh: 5.25,
                fSizeRw: 4,
                fSizeRh: 3.5,
                fSizeBw: 4,
                fSizeBh: 5.5,
                fSizeCap: 4,
                plotYAxisType: YAxis.PseudoSigmoid,
                gridYAxisType: YScale.Score,
                lType: YScale.Score,
                rType: YScale.WinRate,
                tType: XScale.None,
                bType: XScale.Ply,
                score: [],
                comment: [],
                caption: "",
                capLink: "",
                plyCallback: () => undefined
            },
            p
        )
    );
}
