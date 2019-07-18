const sm2 = require('sm-crypto').sm2;

const cryptoutil = require('./crypto.js');

let keypair = sm2.generateKeyPairHex();
const utf8 = require('utf8');

const http = require('http');

function encryptData(jsonData){
    console.dir(jsonData);
    //const token = jsonData.body.key;
    //const publicKey = jsonData.body.pubKey;
    //
    const token = jsonData.token;
    const publicKey = jsonData.hexPublicKey;
    const privateKey = jsonData.hexPrivateKey;

    console.log("token = " + token);
    console.log("publicKey = " + publicKey);
    console.log("privateKey = " + privateKey);

    const cipherMode = 0;

    const businessJson = {
        "body":{
            "loginPass": "aaaaaaaaaaaaaaaaaaawwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwa aaaaaaaaaaaaaaaaaaawwwwwwwwwwwwwwwwww1 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 pkkk pkkk 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111 1111111111111111111111111111111111111111111111111111111"
        }
    }

    const msgString = JSON.stringify(businessJson);

    console.log("main mode = " + cipherMode);

    let encryptData = cryptoutil.sm2Encrypt(msgString, publicKey, cipherMode);sm2.doEncrypt(msgString, publicKey, cipherMode);

    console.log("encrypData = " + encryptData);
    console.log("encrypData length = " + encryptData.length);

    //const loginPwdUrl = "/wbc/custInfo/addLoginPwd";
    const loginPwdUrl = "/v2/info";

    const postJson = {
        "data": encryptData
    };

    function callbackData(json){
        console.dir(json);
    }

    postData(postJson, loginPwdUrl, token, callbackData);

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
        hostname: '127.0.0.1',
        port    : '8001',
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
        console.log("Error:" + err.message);
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
