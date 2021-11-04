var express = require("express")
var path = require("path")
var app = express()
var formidable = require('formidable');
var PORT = process.env.PORT || 3000;
var hbs = require('express-handlebars');

var id = 1;
var pliki = []
var fl;

var idsel;

function plappend(item, index) {
    let ico;
    switch (item['type']) {
        case "image/png":
            ico = "./gfx/png.png"
            break;
        case "image/jpeg":
            ico = "./gfx/jpeg.png"
            break;
        case "image/gif":
            ico = "./gfx/gif.png"
            break;
        case "text/plain":
            ico = "./gfx/txt.png"
            break;
        case "video/mp4":
            ico = "./gfx/mp4.png"
            break;
        case "audio/mpeg":
            ico = "./gfx/mp3.png"
            break;
        default:
            ico = "./gfx/any.png"
            break;
    }
    let tymp = {
        id: id,
        size: item['size'],
        type: item['type'],
        icon: ico,
        name: item['name'],
        path: item['path'],
        date: item['lastModifiedDate'],
    }
    id++;
    pliki.push(tymp);
}
// function myFunction(item, index) {
//     text += index + ": " + item + "<br>"; 
//   }
app.use(express.urlencoded({
    extended: true
}));
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/log.html"))
    // res.render('./fmanager/log.html');   // nie podajemy ścieżki tylko nazwę pliku
    // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
})

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'filemenumain.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.get("/", function (req, res) {
    res.render('./fmanager/upload.hbs');   // nie podajemy ścieżki tylko nazwę pliku
    // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
})
app.post("/info", function (req, res) {
    console.log("_______________INFO_______________");
    idsel = pliki.filter(x => {
        return x.id == req.body.id;
    })

    res.render('./fmanager/info.hbs', idsel[0]);   // nie podajemy ścieżki tylko nazwę pliku
    // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
})
app.post("/del", function (req, res) {
    console.log("_______________DEL_______________");
    pliki = pliki.filter(x => {
        return x.id != req.body.id;
    })
    let context = {
        pliki: pliki,
    }
    console.log("------------Context---------------")
    console.log(context)
    console.log("------------Context---------------")
    res.render('./fmanager/fm.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku

})
app.post("/down", function (req, res) {
    console.log("_______________DOWN_______________");

    idsel = pliki.filter(x => {
        return x.id == req.body.id;
    })
    console.log(idsel[0]['path']);
    res.download(idsel[0]['path']);
})
app.post("/upload", function (req, res) {
    if (req.body.pas == "manager053") {
        fl = 1;
        res.render('./fmanager/upload.hbs');   // nie podajemy ścieżki tylko nazwę pliku
        // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
    }
    else {
        fl = 0;
        res.sendFile(path.join(__dirname + "/static/log.html"))

    }
})
app.get("/upload", function (req, res) {
    if (fl == 1) {
        res.render('./fmanager/upload.hbs');   // nie podajemy ścieżki tylko nazwę pliku
    }
    else {
        fl = 0;
        res.sendFile(path.join(__dirname + "/static/log.html"))
    }
})
app.get("/filemanager", function (req, res) {
    if (fl == 1) {
        let context = {
            pliki: pliki,
        }
        console.log("------------Context---------------")
        console.log(context)
        console.log("------------Context---------------")
        res.render('./fmanager/fm.hbs', context);   // nie podajemy ścieżki tylko nazwę pliku
        // res.render('index.hbs', { layout: "main.hbs" }); // opcjonalnie podajemy konkretny layout dla tego widoku
    }
    else {
        fl = 0;
        res.sendFile(path.join(__dirname + "/static/log.html"))
    }
})

app.post('/handleUpload', function (req, res) {

    console.log(req.body);
    console.log("---------------------");

    let form = formidable({});
    form.keepExtensions = true   // zapis z rozszerzeniem pliku
    form.multiples = true

    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia

    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);
        console.log("--------------------------")
        console.log(files.imagetoupload)

        console.log("--------------------------")
        // console.log(files.imagetoupload[0]['size']);
        if (Array.isArray(files.imagetoupload)) {
            files.imagetoupload.forEach(plappend);
        }
        else {
            console.log("---FILE---")
            // console.log(files);
            plappend(files.imagetoupload);
        }

        console.log("-----PLIKI------")
        console.log("-----PLIKI------")
        console.log("-----PLIKI------")
        console.log(pliki);
        console.log("-----PLIKI------")
        console.log("-----PLIKI------")
        console.log("-----PLIKI------")


        // files.foreach(plappend);
        // console.log("---PLIKI-----")
        // console.log(pliki);
        // res.setHeader("content-type", "application/json")
        res.redirect("/filemanager")
    });
});


app.use(express.static('static'))



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
