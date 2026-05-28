// Capture screenshots of all 3 preview pages
const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const pages = [
    { url: "http://localhost:8090/index.html",   out: "shot-index.png" },
    { url: "http://localhost:8090/result.html",  out: "shot-result.png" },
    { url: "http://localhost:8090/history.html", out: "shot-history.png" },
  ];

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(p.url, { waitUntil: "networkidle0" });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
    const outPath = path.join(__dirname, p.out);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log("captured:", outPath);
    await page.close();
  }

  await browser.close();
})();
