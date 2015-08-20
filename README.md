#toner-wkhtmltopdf


[![Build Status](https://travis-ci.org/jsreport/toner-wkhtmltopdf.png?branch=master)](https://travis-ci.org/jsreport/toner-wkhtmltopdf)

**[Toner](https://github.com/jsreport/toner) recipe for printing html into pdf using [wkhtmltopdf](http://wkhtmltopdf.org/)**

```bash
npm install toner-wkhtmltopdf
```

```js
toner.recipe("wkhtmltopdf", require("toner-wkhtmltopdf")();

toner.render({
	template: {
		content: "fooo",
		engine: "jsrender",
		wkhtmltopdf: {
			header: "{{:name}}"
		}		
	},
	data : {
		name: "Jan Blaha"
	}
});
```

##Options
Options passed to `template.wkhtmltopdf`  are passed to the wkhtmltopdf binary. See its [docs](http://wkhtmltopdf.org/usage/wkhtmltopdf.txt) for details.  Currently supported options are:

- orientation
- header
- footer
- headerHeight
- footerHeight
- marginBottom
- marginLeft
- marginRight
- marginTop
- pageSize
- pageHeight
- pageWidth
- toc
- tocHeaderText
- tocLevelIndentation
- tocTextSizeShrink
- title



##Troubleshooting installation
See https://github.com/pofider/node-wkhtmltopdf-installer