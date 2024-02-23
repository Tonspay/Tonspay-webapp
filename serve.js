/**
 * This controller is to build a webview by express .
 * 
 * Http webview allows any outter call to do actions & manangement :
 * 
 * Functions :
 * 
 * - Get
 *  - invoice
 */
const root = process.cwd();
require('dotenv').config();
var querystring = require('querystring');
var express = require('express');
const fs = require("fs");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(6552, async function() {
  console.log('web-server start')
})

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/ping', async function(req, res) {
    res.status(200).send({
        "code":200,
        "data":"alive"
    })
})

/**
 * Web view render 
 * send file
 */


app.get('/',function(req,res){
  res.render('index', { title: 'ejs' });
});

app.get('/invoice',function(req,res){
  res.sendFile((root+'/page-payment-bill.html'));
});

//INIT
async function init()
{

}

module.exports = {
    init
}