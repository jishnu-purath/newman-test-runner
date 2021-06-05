const http = require("http");
const newman = require("newman");
const { PATH_TO_COLLECTION, PORT } = process.env;

const requestListener = function (req, res) {
  newman.run(
    {
      // If the file doesn't exist in the path the server will crash and will have to restarted
      collection: require(PATH_TO_COLLECTION || "./sample_collection.json"),
      reporters: "cli",
    },
    function (err, summary) {
      if (err) {
        fail(res, err);
      }
      if (summary.run.failures.length === 0) {
        success(res);
      } else {
        fail(res);
      }
    }
  );
};

const fail = (res, err) => {
  console.error("Failed", err);
  write(res, 400, "Failed");
};

const success = (res) => {
  console.log("Success");
  write(res, 200, "Success");
};

const write = (res, statusCode, message) => {
  res.writeHead(statusCode);
  res.end(message);
};

const server = http.createServer(requestListener);
const port = +PORT || 8080;
server.listen(port);
console.log(`Listening on ${port}`);
