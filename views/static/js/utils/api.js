const request_baseurl = "https://wallet.tonspay.top/api/"
const request_router = {
    ping: request_baseurl + "ping",
    debug: request_baseurl + "debug",
    auth: request_baseurl + "auth",
}

async function requester(url, requestOptions) {
    return (await fetch(url, requestOptions)).json()
}

function request_method_get(headers) {
    var requestOptions = {
        method: "GET",
        headers: headers,
        redirect: 'follow'
    };
    return requestOptions
}

function request_method_post(bodys, headers) {
    var requestOptions = {
        method: "POST",
        headers: headers,
        body: bodys,
        redirect: 'follow'
    };
    return requestOptions
}

function auth_header() {
    var myHeaders = new Headers();
    myHeaders.append("token", "");
}

function request_get_unauth() {
    return request_method_get({});
}

function request_get_auth() {
    return request_method_get(auth_header());
}

function request_post_unauth(data) {
    var h = new Headers();
    h.append("Content-Type", "application/json");

    return request_method_post(
        JSON.stringify(data), h
    );
}

async function api_ping() {
    return await requester(request_router.ping, request_get_unauth())
}

async function api_debug(data) {
    console.log(request_post_unauth(data))
    return await requester(
        request_router.debug,
        request_post_unauth(data)
    )
}

async function api_auth(data) {
    console.log(request_post_unauth(data))
    return await requester(
        request_router.auth,
        request_post_unauth(data)
    )
}