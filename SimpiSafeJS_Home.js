// JavaScript source code
var username = "EnterEmailHere";
var password = "EnterPasswordHere";
var grant_type = "password"; //This is default value. Donot change this one
var device_id = "WebApp";//This is default value. Donot change this one
var token;
var rootUrl = "https://api.simplisafe.com/v1/";
var stateStatus;
var user;
var rootObj;
var state = "";

SetAlarmAway();

function SetAlarmOff() {
    state = "off";
    CreateToken();
}

function SetAlarmAway() {
    state = "away";
    CreateToken();
}

function SetAlarmHome() {
    state = "home";
    CreateToken();
}

function CreateToken() {
    var url = rootUrl + "api/token";
    var data = {
        "grant_type": grant_type,
        "device_id": device_id,
        "username": username,
        "password": password
    }

    Post(url, data, true);

}

function GetUser() {
    var url = rootUrl + "api/authCheck";
    Get(url, true);
}

function GetRootObject() {
    var url = rootUrl + "users/" + user.userId + "/subscriptions?activeOnly=false";

    Get(url, false);
}

function SetState() {
    var url = rootUrl + "subscriptions/" + rootObj.subscriptions[0].sid + "/state?state=" + state;

    Post(url, "", false);
}

function Post(url, data, isToken) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    if (isToken)
        xhttp.setRequestHeader("Authorization", "Basic NGRmNTU2MjctNDZiMi00ZTJjLTg2NmItMTUyMWIzOTVkZWQyLjEtMC0wLldlYkFwcC5zaW1wbGlzYWZlLmNvbTo=");
    else
        xhttp.setRequestHeader("Authorization", token.token_type + " " + token.access_token);

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            if (isToken) {
                token = JSON.parse(xhttp.responseText);
                GetUser();
            }
            else
                stateStatus = JSON.parse(xhttp.responseText);
        }
    }
    if (data == "")
        xhttp.send();
    else
        xhttp.send(JSON.stringify(data));
}

function Get(url, isuser) {
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Authorization", token.token_type + " " + token.access_token);
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            if (isuser) {
                user = JSON.parse(xhttp.responseText);
                GetRootObject();
            }
            else {
                rootObj = JSON.parse(xhttp.responseText);
                if (rootObj.subscriptions[0].location.system.alarmState != "home")
                    SetState();
            }
        }
    }
    xhttp.send();
    
}