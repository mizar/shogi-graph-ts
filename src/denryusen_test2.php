<!DOCTYPE html>
<html lang="ja" prefix="og: http://ogp.me/ns#">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/>
<meta property="og:title" content="第1回電竜戦 <?php echo htmlspecialchars($_GET["gn"]) ?> <?php echo htmlspecialchars($_GET["te"]) ?>手目 <?php echo htmlspecialchars($_GET[mv]) ?> まで"/>
<meta property="og:description" content="第1回電竜戦 <?php echo htmlspecialchars($_GET["gn"]) ?> <?php echo htmlspecialchars($_GET["te"]) ?>手目 <?php echo htmlspecialchars($_GET[mv]) ?> まで"/>
<meta property="og:site_name" content="電竜戦"/>
<meta property="og:image" content="https://golan.sakura.ne.jp/denryusen/dr1_test2/shogiban_gd1200.php?csa=<?php echo urlencode($_GET["gi"]) ?>.csa&tesuu=<?php echo urlencode($_GET["te"]) ?>"/>
<meta property="og:url" content="https://golan.sakura.ne.jp/denryusen/dr1_test2/dist/denryusen_single#<?php echo urlencode($_GET["gi"]) ?>"/>
<meta property="og:locale" content="ja_JP"/>
<meta property="og:type" content="article"/>
<meta name="twitter:card" content="summary_large_image"/>
<title>第1回電竜戦 <?php echo htmlspecialchars($_GET["gn"]) ?></title>
<style>
.kifuforjs .players .mochi .tebanname { overflow: hidden; }
.kifuforjs textarea, .kifuforjs textarea:disabled { color: #000; background-color: #fff; -webkit-text-fill-color: #000; opacity: 1; }
.boardset, .boardset .nav, .boardset svg.boardset, .boardset p.kifu, .boardset pre.reason { width: 570px; }
.icon-tabler { font-size: inherit; width: 1em; height: 1em; vertical-align: -.125em; }
.icon-tabler-brand-twitter { color: #1da1f2; }
</style>
<script type="text/javascript">
var denryuUrlBase = "https://p.mzr.jp/denryusen/dr1_test2";
var denryuOrgUrlBase = "https://golan.sakura.ne.jp/denryusen/dr1_test2";
var gameBoardProp = {
    gameId: "<?php echo urlencode($_GET["gi"]) ?>",
    gameName: "<?php echo htmlspecialchars($_GET["gn"]) ?>",
    tesuu: "<?php echo htmlspecialchars($_GET["te"]) ?>",
    url: (gameId) => denryuUrlBase + "/kifufiles/" + gameId + ".csa",
    urlOrg: (gameId) => denryuOrgUrlBase + "/kifufiles/" + gameId + ".csa",
    urlList: denryuUrlBase + "/kifulist.txt",
    kifuVisible: true,
    logParser: log =>
        log
            .split("\n")
            .map((s) =>
                s.match(
                    /^<div><a href="\.\/kifujs\/((?:[\w.-]+\+){4}\d+)\.html"[^>]*>([^<]+)<\/a>/
                )
            )
            .filter((s) => s)
            .map((s) => ({
                gameId: s[1],
                gameName: s[2]
                    .replace(/▲/g, "☗")
                    .replace(/△/g, "☖"),
            })),
    svgPropFn: (args) => {
        var movesLength = args.movesLength || 256;
        var lastIsSpecial = !!args.lastIsSpecial;
        var maxPly = Math.max(movesLength - 1, args.tesuu, 50);
        var width = Math.max(movesLength - (lastIsSpecial ? 1 : 0), args.tesuu, 50);
        var graphScale = width / 256;
        var gameId = "" + args.gameId;
        return {
            maxPly: maxPly,
            width: width,
            height: 48 * graphScale,
            pad: 1 * graphScale,
            capPad: 1.5 * graphScale,
            lWidthNml: 0.06 * graphScale,
            lWidthBld: 0.18 * graphScale,
            lWidthBorder: 0.24 * graphScale,
            lWidthScore: 0.24 * graphScale,
            lWidthTime: 0.12 * graphScale,
            lWidthTesuu: 0.24 * graphScale,
            scaleLength: 1.5 * graphScale,
            scalePad: 2 * graphScale,
            cRadiusScore: 0.8 * Math.min(graphScale * 2, 1),
            fSizeLw: 4 * graphScale,
            fSizeLh: 5.25 * graphScale,
            fSizeRw: 4 * graphScale,
            fSizeRh: 3.5 * graphScale,
            fSizeBw: 4 * graphScale,
            fSizeBh: 5.5 * graphScale,
            fSizeTw: 8 * graphScale,
            fSizeTh: 8 * graphScale,
            fPosTime1: 0.834,
            fPosTime2: 0.04,
            fSizeCap: width / Math.max(gameId.length, 64),
            caption: gameId,
            capLink: denryuOrgUrlBase + "/kifufiles/" + gameId + ".csa",
            colorBackground: { r: 255, g: 255, b: 255, a: 1 },
            colorGridNml: { r: 170, g: 170, b: 170, a: 1 },
            colorGridBld: { r: 136, g: 136, b: 136, a: 1 },
            colorGridEBld: { r: 68, g: 68, b: 68, a: 1 },
            colorGridBorder: { r: 0, g: 0, b: 0, a: 1 },
            colorPly: { r: 0, g: 0, b: 0, a: 1 },
            colorPlayer0: { r: 0, g: 0, b: 0, a: 1 },
            colorPlayer1: { r: 255, g: 0, b: 0, a: 1 },
            colorPlayer2: { r: 0, g: 0, b: 255, a: 1 },
            colorCap: { r: 0, g: 0, b: 0, a: 1 },
            colorTimeLineB: { r: 255, g: 128, b: 128, a: 1 },
            colorTimeFillB: { r: 255, g: 128, b: 128, a: 0.25 },
            colorTimeLineW: { r: 128, g: 128, b: 255, a: 1 },
            colorTimeFillW: { r: 128, g: 128, b: 255, a: 0.25 },
        };
    },
    tweetPropFn: (args) => ({
        text: args.gameName + " " + args.tesuu + "手目 " + args.move + "\n\n\n",
        url: new URL(
            "denryusen_test2.php?gi=" +
            args.gameId +
            "&te=" +
            args.tesuu +
            "&mv=" +
            encodeURIComponent(args.move) +
            "&gn=" +
            encodeURIComponent(args.gameName),
            location.href
        ).href,
        hashtags: "電竜戦",
        via: "DenryuSen",
    }),
    mobxEnable: true,
};
</script>
<script type="text/javascript" src="./kifu-for-js-2.1.4.min.js"></script>
</head>
<body><div><a href="http://www.denryu-sen.jp/">電竜戦ホーム</a> <a href="https://golan.sakura.ne.jp/denryusen/dr1_test2/dr1_live.php">中継トップ</a> <a href="./denryusen_single_test">単一棋譜版</a> <a href="./denryusen_multi_test">複数棋譜版</a></div><script type="text/javascript" src="./main.js"></script></body>
</head>
