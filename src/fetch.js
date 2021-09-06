const fs = require("fs");
const path = require("path");
const md5 = require("md5")
const findCacheDir = require("find-cache-dir");
const nodeFetch = require("node-fetch");
const AbortController = require("abort-controller");

const CACHE_DIR = findCacheDir({ name: "@beyonk/google-fonts-webpack-plugin" });
const TIMEOUT = 10 * 1000;

const responseCache = new Map();

async function fetch(url, format = "json", timeout = TIMEOUT) {
  if (responseCache.has(url)) {
    return responseCache.get(url);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await nodeFetch(url,  {
      signal: controller.signal,
    });

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    let content;
    if (format === "json") {
      content = await response.json();
    } else if (format === "buffer") {
      content = await response.buffer();
    } else {
      throw new Error("Unsupported response format");
    }

    responseCache.set(url, content);

    return content;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getCacheFilePath(url, format) {
  if (!fs.existsSync(CACHE_DIR)) {
    await new Promise((resolve, reject) => fs.mkdir(CACHE_DIR, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve()
      }
    }));
  }

  return path.join(CACHE_DIR, md5(url) + "." + format);
}

async function downloadAndCacheFile(url, format, timeout) {
  const content = await fetch(url, format, timeout);
  const cacheFilePath = await getCacheFilePath(url, format);
  await new Promise((resolve, reject) => fs.writeFile(
    cacheFilePath,
    format === "json" ? JSON.stringify(content) : content,
    format === "json" ? "utf-8" : null,
    (err) => {
      if (err) {
        console.error("Couldn't cache file.");
      }
      resolve();
    }
  ));

  return content;
}

async function readCachedFile(url, format) {
  const cacheFilePath = await getCacheFilePath(url, format);
  if (fs.existsSync(cacheFilePath)) {
    return new Promise((resolve, reject) => fs.readFile(cacheFilePath, format === "json" ? "utf-8" : null, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(format === "json" ? JSON.parse(content) : content);
      }
    }));
  }

  throw new Error("No cached file found");
}

async function readCachedOrFetch(url, format, timeout = TIMEOUT) {
  try {
    return await readCachedFile(url, format);
  } catch {}

  return await downloadAndCacheFile(url, format, timeout);
}

async function fetchAndFallbackToCached(url, format, timeout = TIMEOUT) {
  try {
    return await downloadAndCacheFile(url, format, timeout);
  } catch {}

  return await readCachedFile(url, format);
}

module.exports.readCachedOrFetch = readCachedOrFetch;
module.exports.fetchAndFallbackToCached = fetchAndFallbackToCached;