const puppeteer = require("puppeteer");
const fs = require("fs");
const { Console } = require("console");

let data = {
  list: [],
};

async function main(skill) {
  // launch chromium
  const browser = await puppeteer.launch({ headless: false });
  //   open a new tab
  const page = await browser.newPage();
  //   url - to incorporate scripting - https://in.indeed.com/jobs?q=developer+fresher&l=NCR%2C+Delhi

  await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=NCR%2C+Delhi`),
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
    items.forEach((item, index) => {
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

  let response = await jobData;
  let jsondata = await JSON.stringify(jobData, null, 2);

  // write it inside a file
  fs.writeFile("job.json", jsondata, "uTF-8", () => {
    console.log("written data in job.json");
  });

  // close browser after seacrch
  browser.close();
  return response;
}

module.exports = main;
