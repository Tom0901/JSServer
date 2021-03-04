const puppeteer = require("puppeteer");

async function scrapeChannel(url, techInput) {

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
  await page.goto(url, {  waitUntil: 'networkidle2'}); 

  //clicking the cookie btn 
  await page.evaluate(async ()=>{
    if(document.querySelector(".snByac")){
      let button = await document.querySelector(".snByac"); 
      await button.click()
    }
    else{
       console.log("there is no cookies check")
    }
  })

  //waiting for jobs to load
  await page.waitForSelector('.PUpOsf')

  let titles = await page.evaluate(() =>
    Array.from(
      document.getElementsByClassName("PUpOsf"),
      (element) => element.textContent
    )
  );

  const hrefs = await page.evaluate(() =>
    Array.from(
      document.getElementsByClassName("EDblX"),
      (element) =>
        element.firstElementChild.firstElementChild.firstElementChild.href
    )
  );

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
