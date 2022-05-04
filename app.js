//add express
const express = require('express')
const app = express()



const bodyParser = require('body-parser');
const mongoose = require('mongoose')
  
const fs = require('fs');
const path = require('path');
require('dotenv/config');

// Step 4 - set up EJS
  
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static file
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

//set views --ejs files
app.set('views','./views')
app.set('view engine', 'ejs')

// Step 2 - connect to the database

mongoose.connect(process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected to Mongo Dp...')
	});

// Step 5 - set up multer for storing uploaded files

const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

const upload = multer({ storage: storage });

// Step 6 - load the mongoose model for Image

const imgModel = require('./models/model');

// Step 7 - the GET request handler that provides the HTML UI

app.get('/edit', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('imagesPage', { items: items });
		}
	});
});
//show data
app.get('/', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('imagesPageShow', { items: items });
		}
	});
});
// Step 8 - the POST handler for processing the uploaded file

app.post('/', upload.single('image'), (req, res, next) => {

	const obj = {
		name: req.body.name,
		desc: req.body.desc,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			// item.save();
			res.redirect('/');
		}
	});
});


app.get('/bassem',(req,res)=>{
    res.render('index',{text:'this an EJS file'});
})



// Step 9 - configure the server's port

const port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})
