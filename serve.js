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
const modules = require("../../modules/index")
const redis = require("../../utils/redis")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(6552, async function() {
  console.log('web-server start')
})
app.get('/ping', async function(req, res) {
    console.log(res.locals.auth)
    res.status(200).send({
        "code":200,
        "data":"alive"
    })
})

/**
 * Web view render 
 * send file
 */


app.get('/wallet',function(req,res){
  res.sendFile((root+'/index.html'));
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