const translate = require('google-translate-api');
const fs = require('fs');
var dict = require('./lang.json');

var filename = {
	"en" : "en-US.json",
	"fr" : "fr-FR.json",
	"ar" : "ar-AR.json"
}

var translatedDict = {};
var arr =  Object.keys(dict);
// index for recursion call
var  i = 0;

function translateNow(i, lang) {
	if (i == 0) {
		translatedDict[lang] = {};
	}
	if (i >= arr.length) {
		console.log(translatedDict[lang])
		writeFile(lang, translatedDict[lang]);
		return;
	}
	var item  = arr[i];
	translate(item, {from: 'en', to: lang}).then(res => {
		translatedDict[lang][item] = res.text;
		console.log(res.text)
		translateNow(i+1, lang);
	 }).catch(err => {
		 console.error(err);
	});
}

function writeFile(lang, obj) {
	// beautify stringif
	let str = JSON.stringify(obj).replace(/,/gi, ",\n"); // add new line after comma
	str = str.replace(/{/gi, "{\n"); // add new line after bracket
	str = str.replace(/}/gi, "\n}"); // add new line after bracket
	fs.writeFile("./" + filename[lang], str, 'utf-8');	
}


if(arr.length > 0) {
	for (let lang in filename) {
		translateNow(0, lang);
	}
}
