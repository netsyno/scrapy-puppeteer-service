const express = require("express");
const utils = require("../helpers/utils");
const router = express.Router();

async function action(page, request) {
  await page.goto(request.body.url, request.body.navigationOptions);
  const response = await utils.formResponse(
    page,
    request.query.closePage,
    request.body.waitOptions
  );
  const browser = request.app.get("browser");
  await utils.closeContexts(browser, [response.contextId]);
  return response;
}
// query = {
//   closePage: 1,
//   contextId: <string>,
//   pageId: <string>,
//   onlyHTML: 1,
// }
// body = {
// "url": <string> URL to navigate page to. The url should include scheme, e.g. https://.
// "navigationOptions": { Navigation parameters which might have the following properties:
//     "timeout": <number> Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the page.setDefaultNavigationTimeout(timeout) or page.setDefaultTimeout(timeout) methods.
//     "waitUntil": <string|Array<string>> When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired. Events can be either:
//          load - consider navigation to be finished when the load event is fired.
//          domcontentloaded - consider navigation to be finished when the DOMContentLoaded event is fired.
//          networkidle0 - consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
//          networkidle2 - consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
//     "referer" <string> Referer header value. If provided it will take preference over the referer header value set by page.setExtraHTTPHeaders().
// },
// "waitOptions": {...} same as in click action
// "headers": {
//   "Accept-Language": "en-US",
//   "cookie": "name=value;name2=value2"
// },
// "proxy": "proxy_url"
//
router.post("/", async function (req, res, next) {
  if (!req.body.url) {
    res.status(400);
    res.send("No URL provided in goto request");
    next();
    return;
  }

  try {
    let response = await utils.performAction(req, action);
    res.send(response);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
