const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const pages_to_check = [
    { name: "hero_desktop",   width: 1440, height: 900,  scroll: 0    },
    { name: "hero_tv",        width: 1920, height: 1080, scroll: 0    },
    { name: "contact_desk",   width: 1440, height: 900,  scroll: 9999 },
    { name: "contact_mobile", width: 375,  height: 812,  scroll: 9999 },
  ];
  const fs = require("fs");
  const out = "C:/Users/viraj.s/AppData/Local/Temp/claude/screenshots";
  fs.mkdirSync(out, { recursive: true });
  for (const vp of pages_to_check) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    if (vp.scroll) await page.evaluate((s) => window.scrollTo(0, s), vp.scroll);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${vp.name}.png`, fullPage: false });
    await page.close();
    console.log("done " + vp.name);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
