const sm2 = require('sm-crypto').sm2;
let keypair = sm2.generateKeyPairHex();

const http = require('http');

function encryptData(jsonData){
    console.dir(jsonData);
    const token = jsonData.body.key;
    const publicKey = jsonData.body.pubKey;
    console.log("token = " + token);
    console.log("publicKey = " + publicKey);

    const cipherMode = 0;

    const businessJson = {
        "body":{
            "loginPass": "aaa222"
        }
    }

    const msgString = "foo";//JSON.stringify(businessJson);

    console.log("post string = " + msgString);

    const foo = Buffer.from('foo', 'utf8').toString('hex');
    let encryptData = sm2.doEncrypt(foo, publicKey, cipherMode);

    console.log("encrypData = " + encryptData);

    const loginPwdUrl = "/wbc/custInfo/addLoginPwd";

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

    const loginUrl = "/wbc/custInfo/login"
    const token = '';
    postData(postJson, loginUrl, token, callbackData)
}

login(encryptData)


function generatorKey(){
    let keypair = sm2.generateKeyPairHex();
    publicKey = keypair.publicKey;
    privateKey = keypair.privateKey;
}
