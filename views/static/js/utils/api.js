const request_baseurl = "https://wallet.tonspay.top/api/"
const request_router = {
    ping: request_baseurl + "ping"
}

async function requester(url, requestOptions) {
    return (await fetch(url, requestOptions)).json()
}

async function request_method(method, headers) {
    var requestOptions = {
        method: method,
        headers: headers,
        redirect: 'follow'
    };
    return requestOptions
}

async function auth_header() {
    var myHeaders = new Headers();
    myHeaders.append("token", "");
}

async function request_get_unauth() {
    return request_method("GET", {});
}

async function request_get_auth() {
    return request_method("GET", auth_header());
}

async function api_ping() {
    return await requester(request_router.ping, request_get_unauth())
}