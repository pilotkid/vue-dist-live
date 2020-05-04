![Node.js Package](https://github.com/pilotkid/vue-dist-live/workflows/Node.js%20Package/badge.svg)
# vue-dist-live

This is my first NPM package, this builds vue production applications live as you save your files so you can debug dist files.

## Install

`npm install vue-dist-live --save-dev`



## Run

Open the root directory of the projects.
In terminal run `node ./node_modules/.bin/vue-dist-live`

or create a script entry in your `package.json` with this:

```json
{
    "scripts":{
        "dist": "vue-dist-live"
    }
}
```

then run `npm run dist`

## Params

-d --dir <EXPOSED_DIRECTORY>

-p, --port <PORT_NUMBER>
