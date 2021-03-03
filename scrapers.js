const puppeteer = require("puppeteer");

async function scrapeChannel(url, techInput) {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle2'});

  let titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".BjJfJf"),
      (element) => element.textContent
    )
  );

  console.log(titles)

  const hrefs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".iFjolb"),
      (element) =>
        element.firstElementChild.firstElementChild.firstElementChild.href
    )
  );

  console.log(hrefs)

  browser.close();

  //filtering the output 
  techInput = techInput.trim();  
  techInput = techInput.split(" ");

  //cleaning strings to match for lower case

  techInput = techInput.map(it=> it.toLowerCase())
  titles = titles.map(it=> it.toLocaleLowerCase())

  const checker = (title) => {
    let doesTitleContain = techInput.some((tech) => {
      let truthy = title.includes(tech);
      return truthy; 
    }); 
    if(doesTitleContain) return true; 
  }

  titles = titles.filter((title)=> checker(title));

  return { titles, hrefs }; // arrays of strings
}

module.exports = {
  scrapeChannel,
};
