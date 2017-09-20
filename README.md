# Google Fonts Webpack Plugin

Download Google fonts to webpack build folder using [google-webfonts-helper](https://github.com/majodev/google-webfonts-helper) or use CDN to integrate with [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin).

---

## Install

```bash
npm install google-fonts-webpack-plugin
```

## Usage

`/webpack.config.js`
```js
const GoogleFontsPlugin = require("google-fonts-webpack-plugin")

module.exports = {
	"entry": "index.js",
	/* ... */
	plugins: [
		new GoogleFontsPlugin({
			fonts: [
				{ family: "Source Sans Pro" },
				{ family: "Roboto", variants: [ "400", "700italic" ] }
			]
			/* ...options */
		})
	]
}
```

## Options

```js
new GoogleFontsPlugin(options: Object)
```

|Name|Type|Default|Description|
|----|----|-------|-----------|
|fonts|`FontObject[]`|-|Configuration generated by [http://fontello.com](Fontello.com).
|name|`String`|`"fonts"`|Module name.
|filename|`String`|`"fonts.css"`|Css file name.
|path|`String`|`"font/"`|Relative path to fonts directory. If path is `undefined` fonts are not downloaded, the css file is generated with Google hosted font files.
|local|`Boolean`|`true`|Wether to use google-webfonts-helper API or just link to Google Fonts hosted css. If this option is set to false this plugin just adds the css url to html-webpack-plugin (if present).
|formats|`Array`|`[ "eot", "woff", "woff2", "ttf", "svg" ]`|Font formats to download.
|apiUrl|`String`|`"https://google-webfonts-helper.herokuapp.com/api/fonts"`|google-webfonts-helper API url.


### FontObject

|Name|Type|Default|Description|
|----|----|-------|-----------|
|family|`String`|-|Font family.
|variants|`Array`|-|Font variants according	to google-webfonts-helper (e.g.: `[ "italic", "500", "700italic" ]`).
|subsets|`Array`|-|Font subsets according	to google-webfonts-helper (e.g.: `[ "latin", "greek" ]`).
|formats|`Array`|-|Font formats to download. Defaults to `options.formats`.
