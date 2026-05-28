const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const pages = [
    { url: "http://localhost:5000/",            out: "vt-home.png" },
    { url: "http://localhost:5000/report",      out: "vt-report.png" },
    { url: "http://localhost:5000/kube-bench",  out: "vt-kubebench.png" },
    { url: "http://localhost:5000/kubescape",   out: "vt-kubescape.png" },
    { url: "http://localhost:5000/grype",       out: "vt-grype.png" },
  ];

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto(p.url, { waitUntil: "networkidle0" });
    await page.evaluate(() => new Promise((r) => setTimeout(r, 700)));
    const outPath = path.join(__dirname, p.out);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log("captured:", outPath);
    await page.close();
  }
  await browser.close();
})();
