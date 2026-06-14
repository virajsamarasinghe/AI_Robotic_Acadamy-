const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const fs = require("fs");
  const out = "C:/Users/viraj.s/AppData/Local/Temp/claude/screenshots";
  fs.mkdirSync(out, { recursive: true });
  const vps = [
    { name: "team_375",  w: 375,  h: 812  },
    { name: "team_1440", w: 1440, h: 900  },
    { name: "team_1920", w: 1920, h: 1080 },
  ];
  for (const vp of vps) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.evaluate(() => document.getElementById("team")?.scrollIntoView({ behavior: "instant" }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${vp.name}.png`, fullPage: false });
    console.log("done", vp.name);
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
