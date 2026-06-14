const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { name: "contact_desk2",   width: 1440, height: 900  },
    { name: "contact_mobile2", width: 375,  height: 812  },
    { name: "hero_tv5",        width: 1920, height: 1080 },
  ];
  const fs = require("fs");
  const out = "C:/Users/viraj.s/AppData/Local/Temp/claude/screenshots";
  fs.mkdirSync(out, { recursive: true });
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    if (vp.name.startsWith("contact")) {
      await page.evaluate(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "instant" });
      });
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: `${out}/${vp.name}.png`, fullPage: false });
    await page.close();
    console.log("done " + vp.name);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
