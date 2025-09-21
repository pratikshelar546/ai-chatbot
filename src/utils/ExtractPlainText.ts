import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

async function extractTextFromUrl(url: string) {
    console.log(url, "url");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const html = await page.content();
    await browser.close();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    let clean = article && article.textContent ? article.textContent : "";
    clean = clean.replace(/\s+/g, " ").trim();
console.log(clean.length,"clean");

    // Limit to only get 5000 characters (chunks)
    if (clean.length > 5000) {
        clean = clean.slice(0, 5000);
    }

    return clean;
}

// extractTextFromUrl("https://www.uber.com/en-IN/blog/how-uber-serves-over-150-million-reads/?uclick_id=7b7d7d61-ea44-438a-bb42-c38ca6aa5248")

export default extractTextFromUrl;