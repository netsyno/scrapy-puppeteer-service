const express = require("express");
const utils = require("../helpers/utils");
const router = express.Router();

async function action(page, request) {
  await page.goto(request.body.url);
  const response = await utils.formResponse(page, true);
  await utils.closeContexts(browser, [response.contextId]);
  return response;
}

router.post("/", async function (req, res, next) {
  try {
    let response = await utils.performAction(
      {
        query: { onlyHTML: 1 },
        body: { url: "https://google.com" },
      },
      action
    );
    res.send(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;