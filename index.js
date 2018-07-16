var pdfParser = require('pdf-parser');
var PDF_PATH = './247426-247428.pdf';
var fs = require('fs');

pdfParser.pdf2json(PDF_PATH, function (error, pdf) {
    var arr = [];
    if (error != null) {
        console.log(error);
    } else {
        for (var p = 0, length = pdf.pages.length; p < length; p++) {
            for (var i = 48, len = pdf.pages[p].texts.length; i < len; i++) {
                if (pdf.pages[p].texts[i].fontName == 'g_d0_f1' && pdf.pages[p].texts[i].fontSize == 8 && pdf.pages[p].texts[i].text != "FREE") {
                    var ordered = pdf.pages[p].texts[i - 1].text;
                    var shipped = pdf.pages[p].texts[i - 2].text;
                    var backordered = pdf.pages[p].texts[i - 3].text;
                    var ag = "AG-";
                    var sku = pdf.pages[p].texts[i].text.split(' ')[1].replace(/\./g, '-');
                    var res = ag.concat(sku);
                    var final = { res, ordered, shipped, backordered }
                    arr.push(final)
                }                
            }
        }
        function arrayToCSV(arr) {
            const array = typeof arr !== 'object' ? JSON.parse(arr) : arr;
            let str = `${Object.keys(array[0]).map(value => `"${value}"`).join(",")}` + '\r\n';
            return array.reduce((str, next) => {
                str += `${Object.values(next).map(value => `"${value}"`).join(",")}` + '\r\n';
                return str;
            }, str);
        }
        fs.writeFile("./invoice.csv", arrayToCSV(arr), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("success");
        })
    }
});
