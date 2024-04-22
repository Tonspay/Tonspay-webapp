/**
 * Network request util
 * 
 * Using fetch async/await . 
 * 
 * Making fetch request router . 
 */

const request_baseurl = `${siteBaseUrl}/api/`
const tonapi_baseurl = "https://tonapi.io/"
const tonsbrige_baseurl = `${siteBaseUrl}/bridge/`
const request_router = {
    ping: request_baseurl + "ping",
    debug: request_baseurl + "debug",
    auth: request_baseurl + "auth",
    preconnect: {
        phantom: request_baseurl + "preconnect/phantom",
        metamask: request_baseurl + "preconnect/metamask",
    },
    connect: {
        phantom: request_baseurl + "connect/phantom",
        metamask: request_baseurl + "connect/metamask",
        ton: request_baseurl + "connect/ton",
    },
    disconnect: {
        phantom: request_baseurl + "disconnect/phantom",
        metamask: request_baseurl + "disconnect/metamask",
        ton: request_baseurl + "disconnect/ton"
    },
    info: {
        connection: request_baseurl + "info/connection",
        invoices: request_baseurl + "info/invoices",
        invoice: request_baseurl + "info/invoice",
    },
    scan  :{
        tonapi :{
            balance  : tonapi_baseurl+"v2/blockchain/accounts/",
        },
        solscan : {
            balance  : "",
        },
        arbscan : {
            balance  : ""
        }
    },
    bridge : {
        quote: tonsbrige_baseurl+"quote",
        swap: tonsbrige_baseurl+"swap"
    }
}

async function requester(url, requestOptions) {
    try {
        return (await fetch(url, requestOptions)).json()
    } catch (e) {
        console.log("🐞 req error", e)
    }
    return false;
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
    myHeaders.append("token", storage_get_authkey());
    return myHeaders;
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

function request_post_auth(data) {
    var h = auth_header();
    h.append("Content-Type", "application/json");

    return request_method_post(
        JSON.stringify(data), h
    );
}


async function api_ping() {
    return await requester(request_router.ping, request_get_auth())
}

async function api_debug(data) {
    return await requester(
        request_router.debug,
        request_post_unauth(data)
    )
}

//Get auth token
async function api_auth(data) {
    return await requester(
        request_router.auth,
        request_post_unauth(data)
    )
}

/**
 * Information fetch interface
 *  - connection informations
 *  - actives informations
 */

async function api_info_connection() {
    return await requester(
        request_router.info.connection,
        request_get_auth()
    )
}

async function api_info_invoices() {
    return await requester(
        request_router.info.invoices,
        request_get_auth()
    )
}

async function api_info_invoice(id) {
    return await requester(
        request_router.info.invoice + `/${id}`,
        request_get_auth()
    )
}
/**
 * Connect wallet interface 
 *  - Phantom
 *      - connect
 *      - preconnect
 */

async function api_preconnect_phantom(type) {
    if (type) {
        return await requester(
            request_router.preconnect.phantom + "?type=" + type,
            request_get_auth({ type: true })
        )
    } else {
        return await requester(
            request_router.preconnect.phantom,
            request_get_auth()
        )
    }
}

async function api_preconnect_metamask() {
    return await requester(
        request_router.preconnect.metamask,
        request_get_auth()
    )
}

/**
 * Disconnect wallet interface
 *  - Phantom
 *      - disconnect
 */

async function api_disconnect_phantom() {
    return await requester(
        request_router.disconnect.phantom,
        request_get_auth()
    )
}

async function api_disconnect_metamask() {
    return await requester(
        request_router.disconnect.metamask,
        request_get_auth()
    )
}

async function api_disconnect_ton() {
    return await requester(
        request_router.disconnect.ton,
        request_get_auth()
    )
}

/**
 * New connect wallet interface 
 *  - Phantom
 *      -connect
 *  - Metamask
 *      -connect
 */

async function api_connection_phantom(data) {
    return await requester(
        request_router.connect.phantom,
        request_post_auth(data)
    )
}

async function api_connection_metamask(data) {
    return await requester(
        request_router.connect.metamask,
        request_post_auth(data)
    )
}

async function api_connection_ton(data) {
    return await requester(
        request_router.connect.ton,
        request_post_auth(data)
    )
}


/**
 * Get account balance 
 */

async function api_balance_ton(data) {
    return await requester(
        request_router.scan.tonapi.balance+data,
        request_get_unauth()
    )
}

async function api_balance_phantom(data) {
    const connection = new solanaWeb3.Connection('https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/');
    // console.log(data)
    return await connection.getBalance(new solanaWeb3.PublicKey(data));
}

async function api_balance_metamask(data) {
    const web3 = new Web3(new Web3.providers.HttpProvider('https://arbitrum.drpc.org'));
    return web3.eth.getBalance(data);
}


/**
 * 1inch 
 */

async function api_1inch_quote(chain,src,dst,amount) {
    console.log(`${request_router.bridge.quote}?chain=${chain}&src=${src}&dst=${dst}&amount=${amount}&fee=3`)
    return await requester(
        `${request_router.bridge.quote}?chain=${chain}&src=${src}&dst=${dst}&amount=${amount}&fee=3`,
        request_get_unauth()
    )
}

async function api_1inch_swap(chain,src,dst,amount,from,slippage) {
    console.log(`${request_router.bridge.swap}?chain=${chain}&src=${src}&dst=${dst}&amount=${amount}&from=${from}&slippage=${slippage}&fee=3`)
    return await requester(
        `${request_router.bridge.swap}?chain=${chain}&src=${src}&dst=${dst}&amount=${amount}&from=${from}&slippage=${slippage}&fee=3`,
        request_get_unauth()
    )
}