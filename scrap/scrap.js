const puppeteer = require("puppeteer");

let data = {
  list: [],
};

async function main(skill) {
  // launch chromium
  const browser = await puppeteer.launch({ headless: false });
  //   open a new tab
  const page = await browser.newPage();
  //   url - to incorporate scripting - https://in.indeed.com/jobs?q=developer+fresher&l=NCR%2C+Delhi

  await page.goto(`https://in.indeed.com/jobs?q={skill}&l=NCR%2C+Delhi`),
    {
      timeout: 0,
      waitUntil: "networkidle0",
    };

  // insert a script into url
  const jobData = await page.evaluate(async (data) => {
    // console.log(
    //   "printing the whole html page of indeed search results: ",
    //   data
    // );

    // fetch and return 'data' object with job title, link, salary and companyName as properties
    const items = document.querySelectorAll("td.resultContent");
    items.map((item, index) => {
      let title =
        item.querySelector("h2.jobTitle>a") &&
        item.querySelector("h2.jobTitle>a").innerText;
      let salary =
        item.querySelector("div.salary-snippet-container>div") &&
        item.querySelector("div.salary-snippet-container>div").innerText;
      let companyName =
        item.querySelector("span.companyName") &&
        item.querySelector("span.companyName").innerText;
      let link =
        item.querySelector("h2.jobTitle>a") &&
        item.querySelector("h2.jobTitle>a").href;

      if (salary === null) {
        salary = "not defined";
      }

      data.list.push({
        title: title,
        salary: salary,
        link: link,
        companyName: companyName,
      });
    });

    return data;
  }, data);
  // close browser after seacrch
  browser.close();
}

module.exports = main;
