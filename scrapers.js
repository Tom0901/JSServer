const puppeteer = require("puppeteer");
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'tom090',
  api_key: '192638642153467',
  api_secret: 'LBfa0lJUOnQttwyJz0RB9a8dAi0'
});

function cloudinaryPromise(shotResult, cloudinary_options){
  return new Promise(function(res, rej){
    console.log("inside promise ")
    cloudinary.v2.uploader.upload_stream(cloudinary_options,
      function (error, cloudinary_result) {
        if (error){
          console.error('Upload to cloudinary failed: ', error);
          rej(error);
        }
        res(cloudinary_result);
      }
    ).end(shotResult);
  });
}

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
  //page.setDefaultTimeout(0); 

  //taking a screenshgot to diagnose error 
  let shotResult = await page.screenshot({
    fullPage: true
  }).then((result) => {
    console.log(` got some results.`, result);
    return result;
  }).catch(e => {
    console.error(` Error in snapshotting news`, e);
    return false;
  });
  
  const cloudinary_options = { 
    public_id: "newsshot"
  };
  
  if (shotResult){
    console.log("cloudinaryPromise called")
    //return cloudinaryPromise(shotResult, cloudinary_options);
  }else{
    return null;
  }
  
  //clicking the cookie btn 
  let cookiesTest = await page.evaluate(()=>{
    if(document.querySelector(".snByac")){
      console.log("inside btn logic")
      let button = await document.querySelector(".snByac"); 
      await button.click()
    }
    else{
       console.log("there is no cookies check")
    }
  })
  await page.waitForSelector('.PUpOsf')
  let titles = await page.evaluate(() =>
    Array.from(
      document.getElementsByClassName("PUpOsf"),
      (element) => element.textContent
    )
  );

  console.log(titles)

  const hrefs = await page.evaluate(() =>
    Array.from(
      document.getElementsByClassName("EDblX"),
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
