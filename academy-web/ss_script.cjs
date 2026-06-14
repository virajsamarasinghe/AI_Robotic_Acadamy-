const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { name: "mobile",  width: 375,  height: 812  },
    { name: "tablet",  width: 768,  height: 1024 },
    { name: "desktop", width: 1440, height: 900  },
    { name: "tv",      width: 1920, height: 1080 },
    { name: "4k",      width: 2560, height: 1440 },
  ];
  const fs = require("fs");
  const out = "C:/Users/viraj.s/AppData/Local/Temp/claude/screenshots";
  fs.mkdirSync(out, { recursive: true });
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${out}/${vp.name}.png`, fullPage: false });
    await page.close();
    console.log("done " + vp.name);
  }
  await browser.close();
  console.log("all done");
})().catch(e => { console.error(e); process.exit(1); });
