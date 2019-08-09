const sm2 = require('sm-crypto').sm2;

const cryptoutil = require('./crypto.js');

let keypair = sm2.generateKeyPairHex();
const utf8 = require('utf8');

const http = require('http');

function encryptData(jsonData){
    //console.dir(jsonData);
    //const token = jsonData.body.key;
    //const publicKey = jsonData.body.pubKey;
    //
    const token = jsonData.token;
    const publicKey = jsonData.hexPublicKey;
    const privateKey = jsonData.hexPrivateKey;

    //console.log("token = " + token);
    //console.log("publicKey = " + publicKey);
    //console.log("privateKey = " + privateKey);

    const cipherMode = 0;

    const businessJson = {
        "body": {
            "acNo": "6214139990000000031",
            "page": 1,
            "pageSize": 10
        }
    }

    const msgString = JSON.stringify(businessJson);

    //console.log("main mode = " + cipherMode);

    var count = 0;

    for(var i=0; i<1000; i++){

        let encryptData = cryptoutil.sm2Encrypt(msgString, publicKey, cipherMode);
        //sm2.doEncrypt(msgString, publicKey, cipherMode);

        const isFix = encryptData.isFix;

        const hexString = encryptData.hexString;
        var pushStr = "04" + hexString;
        if(isFix){
            pushStr = "04" + encryptData.fixString;
        }

        //const loginPwdUrl = "/wbc/custInfo/addLoginPwd";
        const loginPwdUrl = "/v2/info";

        const postJson = {
            "data": pushStr
        };

        function callbackData(json){
            console.dir(json);
        }

        if(isFix){
         postData(postJson, loginPwdUrl, token, callbackData);
         count +=1;
        }
    }

    console.log("count " + count)

}

function postData(postJson, urlPath,token, callbackData){

    callback = function(resp){
        var data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var response = JSON.parse(data);
            callbackData(response);
        });

    }

    const post_data = JSON.stringify(postJson);
    console.log("post_data = " + post_data);

    var post_options = {
        hostname: 'www.ifdp.com',
        port    : '9800',
        path    : urlPath,
        method  : 'POST',
        body    : postJson,
        headers : {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Length': post_data.length,
            'Authorization':  token
        }
    };

    var req = http.request(post_options, callback).on("error", (err) => {
        //console.log("Error:" + err.message);
    });
    req.write(post_data);
    req.end();

}

function login(callbackData){

    const postJson = {
        "body":{
            "crdlType":"2",
            "imageCode":"34er",
            "loginPass":"23323",
            "lonCert": "18370886634"
        }
    };

    //const loginUrl = "/wbc/custInfo/login"
    const loginUrl = "/v2/login"
    const token = '';
    postData(postJson, loginUrl, token, callbackData)
}

login(encryptData)


function generatorKey(){
    let keypair = sm2.generateKeyPairHex();
    publicKey = keypair.publicKey;
    privateKey = keypair.privateKey;
}
