/** @license
 * shogi-graph-ts
 * Copyright (c) Mizar <https://github.com/mizar>
 */

import { doWrite, SvgScoreGraphProp, YAxis } from "./rendergraph";
import { JKFPlayer } from "json-kifu-format";
import { ITimeFormat } from "json-kifu-format/dist/src/Formats";
import { select, BaseType, Selection } from "d3-selection";
import copy from "copy-to-clipboard";
import copySvg from "tabler-icons/icons/copy.svg";
import rotateSvg from "tabler-icons/icons/rotate.svg";
import refreshSvg from "tabler-icons/icons/refresh.svg";

const colorSet: { [c: string]: Partial<SvgScoreGraphProp> | undefined } = {
    white: {
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
    },
    black: {
        colorBackground: { r: 0, g: 0, b: 0 },
        colorGridNml: { r: 136, g: 136, b: 136 },
        colorGridBld: { r: 153, g: 153, b: 153 },
        colorGridEBld: { r: 170, g: 170, b: 170 },
        colorGridBorder: { r: 255, g: 255, b: 255 },
        colorPly: { r: 255, g: 255, b: 255 },
        colorPlayer0: { r: 255, g: 255, b: 255 },
        colorPlayer1: { r: 255, g: 136, b: 0 },
        colorPlayer2: { r: 0, g: 136, b: 255 },
        colorCap: { r: 255, g: 255, b: 255 },
    },
    aqua: {
        colorBackground: { r: 0, g: 191, b: 255 },
        colorGridNml: { r: 136, g: 136, b: 136 },
        colorGridBld: { r: 102, g: 102, b: 102 },
        colorGridEBld: { r: 68, g: 68, b: 68 },
        colorGridBorder: { r: 0, g: 0, b: 0 },
        colorPly: { r: 0, g: 0, b: 0 },
        colorPlayer0: { r: 0, g: 0, b: 0 },
        colorPlayer1: { r: 255, g: 0, b: 0 },
        colorPlayer2: { r: 0, g: 0, b: 255 },
        colorCap: { r: 0, g: 0, b: 0 },
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
    const found = window.location.hash.match(/^#((?:[\w.-]+\+){4}\d+)$/);
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
    const fetchGame = async (gameid: string, auto = false): Promise<void> => {
        if (lastFetch + 8500 > Date.now() && lastGame === gameid && auto) {
            return;
        }
        if (lastGame !== gameid) {
            lastCsa = "";
        }
        const numid = gameid.substring(gameid.length - 14);
        const url = `https://mzr.jp/wdoor-latest/${numid.substring(
            0,
            4
        )}/${numid.substring(4, 6)}/${numid.substring(6, 8)}/${gameid}.csa`;
        const urlOrg = `http://wdoor.c.u-tokyo.ac.jp/shogi/view/${numid.substring(
            0,
            4
        )}/${numid.substring(4, 6)}/${numid.substring(6, 8)}/${gameid}.csa`;
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
            copy(csa);
        });
        const lastPly = graphdiv
            .select<HTMLSelectElement>("select.kifulist")
            .node()?.value;
        const lastMaxPly = graphdiv
            .select<HTMLOptionElement>("select.kifulist option:last-child")
            .node()?.value;
        graphdiv.selectAll("*").remove();
        const timeFmt = (v: ITimeFormat): string =>
            (v.h ? `${v.h}:` + `0${v.m}:`.slice(-3) : `${v.m}:`) +
            `0${v.s}`.slice(-2);
        doWrite(
            graphdiv.append("div"),
            Object.assign<
                Partial<SvgScoreGraphProp>,
                Partial<SvgScoreGraphProp> | undefined,
                Partial<SvgScoreGraphProp> | undefined
            >(
                {
                    score: player.kifu.moves.map((v) =>
                        v.comments
                            ? v.comments.reduce((p, c) => {
                                  const matches = c.match(/^\*\* (-?\d+)/);
                                  return matches ? parseFloat(matches[1]) : p;
                              }, NaN)
                            : NaN
                    ),
                    comment: player.kifu.moves.map((v) =>
                        (v.time
                            ? [
                                  timeFmt(v.time.now) +
                                      " / " +
                                      timeFmt(v.time.total),
                              ]
                            : []
                        )
                            .concat(v.comments ?? [])
                            .join("\n")
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
        const sfeninput = graphdiv
            .append("div")
            .append("input")
            .attr("type", "text")
            .attr("size", "90")
            .attr("maxlength", "160")
            .attr("readonly", "")
            .property(
                "value",
                "sfen " +
                    player.shogi.toSFENString(
                        player.kifu.moves.length -
                            (player.kifu.moves.some((e) => e.special) ? 1 : 0)
                    )
            )
            .on("focus", () => {
                sfeninput.node()?.select();
            });
        const boarddiv = graphdiv.append("div").attr("id", "boarddiv");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).KifuForJS.loadString(csa, "boarddiv");
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
        const par = graphdiv.append("p");
        player.kifu.moves.forEach((v, i) => {
            if (i !== 0) {
                par.append("span")
                    .attr("style", "white-space:nowrap")
                    .attr(
                        "title",
                        (v.time
                            ? [
                                  timeFmt(v.time.now) +
                                      " / " +
                                      timeFmt(v.time.total),
                              ]
                            : []
                        )
                            .concat(v.comments ?? [])
                            .join("\n")
                    )
                    .text(`${i}${JKFPlayer.moveToReadableKifu(v)}`);
                par.append("span").text(" ");
                if (v.comments?.some((str) => str.startsWith("$END_TIME:"))) {
                    graphdiv.append("pre").text(v.comments?.join("\n"));
                }
            }
        });
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
        lastFetch = Date.now();
        lastGame = gameid;
        lastCsa = csa;
        lastColor = color;
        lastYAxis = yaxis;
    };
    let gameList: string[] = [];
    const listLoad = async (): Promise<void> => {
        const logPromise = await fetch(
            "https://mzr.jp/wdoor-latest/shogi-server.log"
        );
        const log = await logPromise.text();
        gameList = gameList
            .concat(
                log
                    .match(/(?<=\[INFO\] game (?:started|finished) ).*/g)
                    ?.map((v) => v) ?? []
            )
            .filter((x, i, self) => self.indexOf(x) === i)
            .sort(
                (a, b) =>
                    parseFloat(a.substring(a.length - 14)) -
                    parseFloat(b.substring(b.length - 14))
            );
        selectGame.selectAll("*").remove();
        gameList.forEach((gameid) => {
            const shortGameId = gameid.startsWith("wdoor+floodgate-300-10F+")
                ? gameid.substring(24)
                : gameid;
            selectGame.append("option").attr("value", gameid).text(shortGameId);
        });
        const gameIdHash = getGameIdHash();
        if (gameIdHash) {
            selectGame.property("value", gameIdHash);
            fetchGame(gameIdHash);
        } else if (gameList.length) {
            const lastGameIdList = gameList[gameList.length - 1];
            window.location.hash = `#${lastGameIdList}`;
            selectGame.property("value", lastGameIdList);
            fetchGame(lastGameIdList);
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
