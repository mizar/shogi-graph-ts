/** @license
 * shogi-graph-ts
 * Copyright (c) Mizar <https://github.com/mizar>
 */

import { doWrite, SvgScoreGraphProp, YAxis } from "./rendergraph";
import { JKFPlayer } from "json-kifu-format";
import { ITimeFormat } from "json-kifu-format/dist/src/Formats";
import { select, BaseType, Selection } from "d3-selection";
import copySvg from "tabler-icons/icons/file-text.svg";
import saveSvg from "tabler-icons/icons/photo.svg";
import rotateSvg from "tabler-icons/icons/rotate.svg";
import refreshSvg from "tabler-icons/icons/refresh.svg";

interface GameObj {
    gameId: string;
    gameName: string;
}
interface TimeMan {
    base: number;
    increment: number;
    byoyomi: number;
}

declare const gameUrl: (gameid: string) => string;
declare const gameUrlOrg: (gameid: string) => string;
declare const gameUrlList: string;
declare const gameLogParser: (log: string) => GameObj[];
declare const sfenVisible: boolean;
declare const kifuVisible: boolean;

const colorSet: { [c: string]: Partial<SvgScoreGraphProp> | undefined } = {
    white: {
        colorBackground: { r: 255, g: 255, b: 255, a: 1 },
        colorGridNml: { r: 170, g: 170, b: 170, a: 1 },
        colorGridBld: { r: 136, g: 136, b: 136, a: 1 },
        colorGridEBld: { r: 68, g: 68, b: 68, a: 1 },
        colorGridBorder: { r: 0, g: 0, b: 0, a: 1 },
        colorPly: { r: 0, g: 0, b: 0, a: 1 },
        colorPlayer0: { r: 0, g: 0, b: 0, a: 1 },
        colorPlayer1: { r: 255, g: 51, b: 0, a: 1 },
        colorPlayer2: { r: 0, g: 51, b: 255, a: 1 },
        colorCap: { r: 0, g: 0, b: 0, a: 1 },
    },
    black: {
        colorBackground: { r: 0, g: 0, b: 0, a: 1 },
        colorGridNml: { r: 136, g: 136, b: 136, a: 1 },
        colorGridBld: { r: 153, g: 153, b: 153, a: 1 },
        colorGridEBld: { r: 170, g: 170, b: 170, a: 1 },
        colorGridBorder: { r: 255, g: 255, b: 255, a: 1 },
        colorPly: { r: 255, g: 255, b: 255, a: 1 },
        colorPlayer0: { r: 255, g: 255, b: 255, a: 1 },
        colorPlayer1: { r: 255, g: 136, b: 0, a: 1 },
        colorPlayer2: { r: 0, g: 136, b: 255, a: 1 },
        colorCap: { r: 255, g: 255, b: 255, a: 1 },
    },
    aqua: {
        colorBackground: { r: 0, g: 191, b: 255, a: 1 },
        colorGridNml: { r: 136, g: 136, b: 136, a: 1 },
        colorGridBld: { r: 102, g: 102, b: 102, a: 1 },
        colorGridEBld: { r: 68, g: 68, b: 68, a: 1 },
        colorGridBorder: { r: 0, g: 0, b: 0, a: 1 },
        colorPly: { r: 0, g: 0, b: 0, a: 1 },
        colorPlayer0: { r: 0, g: 0, b: 0, a: 1 },
        colorPlayer1: { r: 255, g: 0, b: 0, a: 1 },
        colorPlayer2: { r: 0, g: 0, b: 255, a: 1 },
        colorCap: { r: 0, g: 0, b: 0, a: 1 },
    },
};

const yaxisSet: { [c: string]: Partial<SvgScoreGraphProp> | undefined } = {
    pseudoSigmoid: {
        plotYAxisType: YAxis.PseudoSigmoid,
    },
    atan: {
        plotYAxisType: YAxis.Atan,
    },
    tanh: {
        plotYAxisType: YAxis.Tanh,
    },
    linear1000: {
        plotYAxisType: YAxis.Linear1000,
    },
    linear1200: {
        plotYAxisType: YAxis.Linear1200,
    },
    linear2000: {
        plotYAxisType: YAxis.Linear2000,
    },
    linear3000: {
        plotYAxisType: YAxis.Linear3000,
    },
};

function getGameIdHash(): string {
    const found = window.location.hash.match(
        /^#(?:.*\/)?((?:[\w.-]+\+){4}\d+)/
    );
    return found ? found[1] : "";
}

window.addEventListener("load", () => {
    const body = select("body");
    const selectGame = body.append("select").attr("id", "selectgame");
    const selectColor = body.append("select").attr("id", "selectcolor");
    selectColor.append("option").attr("value", "white").text("white");
    selectColor.append("option").attr("value", "black").text("black");
    selectColor.append("option").attr("value", "aqua").text("aqua");
    const selectYAxis = body.append("select").attr("id", "selectyaxis");
    selectYAxis
        .attr(
            "title",
            "{\n  'pSigmoid': (score) => Math.asin(Math.atan(score * ((Math.PI * Math.PI) / 4800)) * (2 / Math.PI)) * (2 / Math.PI),\n  'atan': (score) => Math.atan(score * (Math.PI / 2400)) * (2 / Math.PI),\n  'tanh': (score) => Math.tanh(score / 1200),\n  'linear1000': (score) => Math.min(Math.max(score / 1000, -1), +1),\n  'linear1200': (score) => Math.min(Math.max(score / 1200, -1), +1),\n  'linear2000': (score) => Math.min(Math.max(score / 2000, -1), +1),\n  'linear3000': (score) => Math.min(Math.max(score / 3000, -1), +1),\n}"
        )
        .append("option")
        .attr("value", "pseudoSigmoid")
        .text("pSigmoid");
    selectYAxis.append("option").attr("value", "atan").text("atan");
    selectYAxis.append("option").attr("value", "tanh").text("tanh");
    selectYAxis.append("option").attr("value", "linear1000").text("linear1000");
    selectYAxis.append("option").attr("value", "linear1200").text("linear1200");
    selectYAxis.append("option").attr("value", "linear2000").text("linear2000");
    selectYAxis.append("option").attr("value", "linear3000").text("linear3000");
    const iconSet = <G extends BaseType>(
        button: Selection<G, unknown, HTMLElement, unknown>,
        src: string
    ): void => {
        button
            .append("img")
            .attr("src", src)
            .attr(
                "style",
                "font-size:inherit;width:1em;height:1em;vertical-align:-.125em"
            )
            .attr("data-icon-origin", "https://github.com/tabler/tabler-icons")
            .attr("data-icon-license", "MIT");
    };
    const copyButton = body
        .append("button")
        .attr("title", "現在表示中の棋譜をクリップボードにコピー");
    iconSet(copyButton, copySvg);
    const saveButton = body
        .append("button")
        .attr("title", "形勢グラフをクリップボードにコピー(Chromeのみ対応)");
    iconSet(saveButton, saveSvg);
    const redoButton = body
        .append("button")
        .attr("title", "現在表示中の棋譜を再読み込み");
    iconSet(redoButton, rotateSvg);
    const reloadButton = body
        .append("button")
        .attr("title", "棋譜リストの再読み込み");
    iconSet(reloadButton, refreshSvg);

    const graphdiv = body.append("div").attr("id", "scoregraph");
    let lastFetch = NaN;
    let lastGame = "";
    let lastCsa = "";
    let lastColor = "";
    let lastYAxis = "";
    let gameList: GameObj[] = [];
    const fetchGame = async (gameid: string, auto = false): Promise<void> => {
        if (lastFetch + 8500 > Date.now() && lastGame === gameid && auto) {
            return;
        }
        if (lastGame !== gameid) {
            lastCsa = "";
        }
        const url = gameUrl(gameid);
        const urlOrg = gameUrlOrg(gameid);
        const csaPromise = await fetch(url);
        const csa = await csaPromise.text();
        const player = JKFPlayer.parseCSA(csa);
        const color = body.select("#selectcolor").property("value");
        const yaxis = body.select("#selectyaxis").property("value");
        player.goto(Infinity);
        if (
            lastGame === gameid &&
            lastCsa === csa &&
            lastColor === color &&
            lastYAxis === yaxis
        ) {
            lastFetch = Date.now();
            if (
                !player.kifu.moves.some((v) =>
                    v.comments?.some((str) => str.startsWith("$END_TIME:"))
                )
            ) {
                setTimeout(() => {
                    fetchGame(selectGame.property("value"), true);
                }, 10000);
            }
            return;
        }
        copyButton.on("click", () => {
            navigator.clipboard.writeText(csa);
        });
        const lastPly = graphdiv
            .select<HTMLSelectElement>("select.kifulist")
            .node()?.value;
        const lastMaxPly = graphdiv
            .select<HTMLOptionElement>("select.kifulist option:last-child")
            .node()?.value;
        graphdiv.selectAll("*").remove();
        // 時間フォーマット
        const timeFmt = (v: ITimeFormat): string =>
            (v.h ? `${v.h}:` + `0${v.m}:`.slice(-3) : `${v.m}:`) +
            `0${v.s}`.slice(-2);
        // gameid から持ち時間読み取り
        const timeManMatch = gameid.match(
            /^[\w.-]+\+[\w.-]+-(\d+)-(\d+)(F)?\+/
        );
        const timeMan: TimeMan = timeManMatch
            ? {
                  base: Number.parseInt(timeManMatch[1]),
                  increment:
                      timeManMatch[3] === "F"
                          ? Number.parseInt(timeManMatch[2])
                          : 0,
                  byoyomi:
                      timeManMatch[3] === "F"
                          ? 0
                          : Number.parseInt(timeManMatch[2]),
              }
            : {
                  base: 0,
                  increment: 0,
                  byoyomi: 0,
              };
        const remainTimeSec = (
            i: number,
            v: { now: ITimeFormat; total: ITimeFormat }
        ): number => {
            const limit =
                timeMan.base + timeMan.increment * (Math.max(i - 1, 0) >> 1);
            const now = 3600 * (v.now.h ?? 0) + 60 * v.now.m + v.now.s;
            const total = 3600 * (v.total.h ?? 0) + 60 * v.total.m + v.total.s;
            return Math.max(limit - total, -now) + timeMan.byoyomi;
        };
        const remainTimeStr = (
            i: number,
            v: { now: ITimeFormat; total: ITimeFormat }
        ): string => {
            const remain = Math.max(remainTimeSec(i, v), 0);
            const h = Math.floor(remain / 3600);
            const m = Math.floor((remain - 3600 * h) / 60);
            const s = remain - 3600 * h - 60 * m;
            return timeFmt({ h, m, s });
        };

        const maxPly = Math.max(
            player.kifu.moves.length -
                (player.kifu.moves[player.kifu.moves.length - 1].special
                    ? 2
                    : 1),
            50
        );
        const graphWidth = Math.max(
            player.kifu.moves.length -
                (player.kifu.moves[player.kifu.moves.length - 1].special
                    ? 1
                    : 0),
            50
        );

        doWrite(
            graphdiv.append("div"),
            Object.assign<
                Partial<SvgScoreGraphProp>,
                Partial<SvgScoreGraphProp>,
                Partial<SvgScoreGraphProp> | undefined,
                Partial<SvgScoreGraphProp> | undefined
            >(
                {
                    maxPly,
                    width: graphWidth,
                    height: 48 * (graphWidth / 256),
                    pad: graphWidth / 256,
                    capPad: 1.5 * (graphWidth / 256),
                    lWidthNml: 0.06 * (graphWidth / 256),
                    lWidthBld: 0.18 * (graphWidth / 256),
                    lWidthBorder: 0.24 * (graphWidth / 256),
                    lWidthScore: 0.24 * (graphWidth / 256),
                    lWidthTime: 0.12 * (graphWidth / 256),
                    scaleLength: 1.5 * (graphWidth / 256),
                    scalePad: 2 * (graphWidth / 256),
                    cRadiusScore: 0.8 * Math.min(graphWidth / 128, 1),
                    fSizeLw: 4 * (graphWidth / 256),
                    fSizeLh: 5.25 * (graphWidth / 256),
                    fSizeRw: 4 * (graphWidth / 256),
                    fSizeRh: 3.5 * (graphWidth / 256),
                    fSizeBw: 4 * (graphWidth / 256),
                    fSizeBh: 5.5 * (graphWidth / 256),
                    fSizeCap: graphWidth / Math.max(gameid.length, 64),
                },
                {
                    score: player.kifu.moves.map((v) =>
                        v.comments
                            ? v.comments.reduce((p, c) => {
                                  const matches = c.match(/^\*\* (-?\d+)/);
                                  return matches ? parseFloat(matches[1]) : p;
                              }, NaN)
                            : NaN
                    ),
                    comment: player.kifu.moves.map((v, i) =>
                        [
                            [
                                i !== 0
                                    ? `${i}${JKFPlayer.moveToReadableKifu(v)}`
                                    : "",
                                v.time
                                    ? `${timeFmt(v.time.now)} / 累計 ${timeFmt(
                                          v.time.total
                                      )} / 残り ${remainTimeStr(i, v.time)}`
                                    : "",
                            ]
                                .filter((s) => s)
                                .join(" "),
                        ]
                            .filter((s) => s)
                            .concat(v.comments ?? [])
                            .join("\n")
                    ),
                    timePar: player.kifu.moves.map((v, i) =>
                        v.time
                            ? remainTimeSec(i, v.time) / timeMan.base
                            : Number.NaN
                    ),
                    caption: gameid,
                    capLink: urlOrg,
                    plyCallback: (ply: number): void => {
                        select("div#boarddiv select.kifulist")
                            .property("value", `${ply}`)
                            ?.dispatch("change", {
                                bubbles: true,
                                cancelable: false,
                                detail: {},
                            });
                    },
                },
                colorSet[color],
                yaxisSet[yaxis]
            )
        );
        if (sfenVisible) {
            const sfeninput = graphdiv
                .append("div")
                .append("input")
                .attr("type", "text")
                .attr("size", "90")
                .attr("maxlength", "160")
                .attr("readonly", "")
                .attr("class", "sfen")
                .property(
                    "value",
                    "sfen " +
                        player.shogi.toSFENString(
                            player.kifu.moves.length -
                                (player.kifu.moves.some((e) => e.special)
                                    ? 1
                                    : 0)
                        )
                )
                .on("focus", () => {
                    sfeninput.node()?.select();
                });
        }
        const boarddiv = graphdiv.append("div").attr("id", "boarddiv");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).KifuForJS.loadString(csa, "boarddiv");
        boarddiv
            .select<HTMLButtonElement>("button[class=dl]")
            .attr("disabled", false)
            .property("disabled", false)
            .on("click", () => {
                window.open(url, "_blank");
            });
        if (lastGame !== gameid || lastPly === lastMaxPly) {
            boarddiv
                .select<HTMLButtonElement>("button[data-go=Infinity]")
                .node()
                ?.click();
        } else {
            boarddiv
                .select<HTMLSelectElement>("select.kifulist")
                .property("value", lastPly)
                .dispatch("change", {
                    bubbles: true,
                    cancelable: false,
                    detail: {},
                });
        }
        if (kifuVisible) {
            const par = graphdiv.append("p").attr("class", "kifu");
            if (player.kifu.header["棋戦"]) {
                par.append("span").text(
                    `$EVENT: ${player.kifu.header["棋戦"]}`
                );
                par.append("br");
            }
            if (player.kifu.header["開始日時"]) {
                par.append("span").text(
                    `$START_TIME: ${player.kifu.header["開始日時"]}`
                );
                par.append("br");
            }
            if (player.kifu.header["先手"]) {
                par.append("span").text(`☗${player.kifu.header["先手"]}`);
                par.append("br");
            }
            if (player.kifu.header["後手"]) {
                par.append("span").text(`☖${player.kifu.header["後手"]}`);
                par.append("br");
            }
            player.kifu.moves.forEach((v, i) => {
                if (i !== 0) {
                    par.append("span")
                        .attr("style", "white-space:nowrap")
                        .attr(
                            "title",
                            (v.time
                                ? [
                                      `${timeFmt(v.time.now)} / 累計 ${timeFmt(
                                          v.time.total
                                      )} / 残り ${remainTimeStr(i, v.time)}`,
                                  ]
                                : []
                            )
                                .concat(v.comments ?? [])
                                .join("\n")
                        )
                        .text(`${i}${JKFPlayer.moveToReadableKifu(v)}`);
                    par.append("span").text(" ");
                    if (
                        v.comments?.some((str) => str.startsWith("$END_TIME:"))
                    ) {
                        graphdiv
                            .append("pre")
                            .attr("class", "reason")
                            .text(v.comments?.join("\n"));
                    }
                }
            });
        }
        if (
            !player.kifu.moves.some((v) =>
                v.comments?.some((str) => str.startsWith("$END_TIME:"))
            )
        ) {
            boarddiv.select("select.autoload").property("value", "30");
            setTimeout(() => {
                fetchGame(selectGame.property("value"), true);
            }, 10000);
        }
        if (!gameList.map((o) => o.gameId).includes(gameid)) {
            gameList = gameList
                .concat({ gameId: gameid, gameName: gameid })
                .sort(
                    (a, b) =>
                        parseFloat(a.gameId.substring(a.gameId.length - 14)) -
                        parseFloat(b.gameId.substring(b.gameId.length - 14))
                );
            selectGame.selectAll("*").remove();
            gameList.forEach((o) => {
                selectGame
                    .append("option")
                    .attr("value", o.gameId)
                    .text(o.gameName);
            });
            selectGame.property("value", gameid);
        }
        lastFetch = Date.now();
        lastGame = gameid;
        lastCsa = csa;
        lastColor = color;
        lastYAxis = yaxis;
    };
    const listLoad = async (): Promise<void> => {
        const logPromise = await fetch(gameUrlList);
        const log = await logPromise.text();
        gameList = gameList
            .concat(gameLogParser(log))
            .filter(
                (x, i, self) =>
                    self.map((s) => s.gameId).lastIndexOf(x.gameId) === i
            )
            .sort(
                (a, b) =>
                    parseFloat(a.gameId.substring(a.gameId.length - 14)) -
                    parseFloat(b.gameId.substring(b.gameId.length - 14))
            );
        selectGame.selectAll("*").remove();
        gameList.forEach((o) => {
            selectGame
                .append("option")
                .attr("value", o.gameId)
                .text(o.gameName);
        });
        const gameIdHash = getGameIdHash();
        if (gameIdHash) {
            selectGame.property("value", gameIdHash);
            fetchGame(gameIdHash);
        } else if (gameList.length) {
            const lastGameId = gameList[gameList.length - 1].gameId;
            window.location.hash = `#${lastGameId}`;
            selectGame.property("value", lastGameId);
            fetchGame(lastGameId);
        }
    };
    selectGame.on("change", () => {
        const gameid = selectGame.property("value");
        redoButton.on("click", () => fetchGame(gameid));
        const newHash = `#${gameid}`;
        if (window.location.hash !== newHash) {
            window.location.hash = newHash;
        }
        fetchGame(gameid);
    });
    saveButton.on("click", () => {
        const svgArray = graphdiv.select<SVGElement>("svg").nodes();
        if (svgArray.length) {
            const svg = svgArray[0];
            const svgUrl = `data:image/svg+xml;charset=utf-8;base64,${btoa(
                unescape(
                    encodeURIComponent(
                        new XMLSerializer().serializeToString(svg)
                    )
                )
            )}`;
            const canvas = document.createElement("canvas");
            canvas.height = Math.max(svg.clientHeight, 480);
            canvas.width = Math.round(
                (canvas.height / svg.clientHeight) * svg.clientWidth
            );
            const ctx = canvas.getContext("2d");
            const image = new Image(canvas.width, canvas.height);
            image.onload = (): void => {
                ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
                if (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (global as any).ClipboardItem &&
                    navigator.clipboard.write
                ) {
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            await navigator.clipboard.write([
                                new ClipboardItem({
                                    [blob.type]: blob,
                                }),
                            ]);
                        }
                    });
                } else {
                    navigator.clipboard.writeText(canvas.toDataURL());
                }
            };
            image.src = svgUrl;
        }
    });
    reloadButton.on("click", () => {
        window.location.hash = "";
        listLoad();
    });
    selectColor.on("change", () => {
        fetchGame(selectGame.property("value"));
    });
    selectYAxis.on("change", () => {
        fetchGame(selectGame.property("value"));
    });
    listLoad();
    doWrite(body.append("div").attr("style", "display:none"), {
        maxPly: 320,
        width: 321,
    });
    window.addEventListener("hashchange", (ev) => {
        if (ev.isTrusted) {
            const gameId = getGameIdHash();
            if (gameId) {
                selectGame.property("value", gameId);
                fetchGame(gameId);
            }
        }
    });
});
