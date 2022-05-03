//add express
const express = require('express')
const app = express()
const port =3000
//static file
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

//set views --ejs files
app.set('views','./views')
app.set('view engine', 'ejs')



app.get('',(req,res)=>{
    res.render('index',{text:'this an EJS file'});
})

//create server at port
app.listen(port,console.log(`express server work now at:${port}`))