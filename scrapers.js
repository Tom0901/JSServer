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
  await page.goto(url, {waitUntil: 'networkidle2'});

  let test = await page.evaluate(()=>{
    document.querySelector(".cS4btb")
  })

  console.log("testing", test)


  let titles = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".PUpOsf"),
      (element) => element.textContent
    )
  );

  console.log(titles)

  const hrefs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".EDblX"),
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
