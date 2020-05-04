#!/usr/bin/env node

var chokidar = require("chokidar");
var minimist = require("minimist");
var http = require("http");
var fs = require("fs");
var path = require("path");
const { spawn } = require("child_process");

const { port = 8125, dir = "dist" } = minimist(process.argv.slice(2), {
  alias: { p: "port", d: "dir" },
});

chokidar.watch(".").on("change", TriggerHotReload);

function TriggerHotReload(filename) {
  //PREVENT DIST OR GIT CHANGES FROM TRIGGERING RELOAD

  if (
    filename.includes("dist") ||
    filename.includes(".git") ||
    filename.includes("node_modules") ||
    filename.includes(".cache")
  ) {
    return;
  }
  console.log("RELOADING");
  server.close();
  console.log(filename);

  const buildcmd = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", [
    "run",
    "build",
  ]);

  buildcmd.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  buildcmd.stderr.on("data", (data) => {
    console.log(`${data}`);
  });

  buildcmd.on("error", (error) => {
    console.log(`${error.message}`);
  });

  buildcmd.on("close", (code) => {
    console.log(`child process exited with code ${code}`);

    server.listen(port);
    console.log("Reloaded!");
  });
}

var server = http.createServer(function (request, response) {
  console.log("Request: ", request.url);

  var filePath = `./${dir}/${request.url}`;
  if (request.url == "/") {
    filePath = `./${dir}/index.html`;
  }

  var extname = String(path.extname(filePath)).toLowerCase();
  var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  var contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (error, content) {
          response.writeHead(404, { "Content-Type": "text/html" });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
});

server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
console.log(`Server running at http://localhost:${port}/`);
