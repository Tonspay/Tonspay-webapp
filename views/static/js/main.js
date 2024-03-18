/**
 * TODO : 
 * 
 * - Local storage system : 
 *  - Auth token
 *  - Uid
 * 
 * - Request system :
 *  - Main server 
 *      - ping
 *      - Register
 *      - Auth
 *      - Connect
 *      - Disconnect
 *      - Txn
 *  - Coingecko / Coinmarketcap
 *      - Coin list
 *      - Token price
 *  - Etherscan / Tonviwer / Solscan 
 *      - Txn trace
 * 
 * - Telegram decode & miniapp interface :
 *  - Get user raw data
 *  - Telegram auth login 
 *  - Miniapp
 *      - Inner button
 *      - Message call 
 * 
 * - Deeplink connect wallet interface :
 *  - Phantom
 *  - Tonwallet
 *  - Metamask
 *  - Wallet connect
 */


async function init(r) {
    // console.log("🔥 Check cache")
    //set the auth token into global
    await authToken()
    await router(r)
    // console.log("🔥 Iframe check :: ")
    // console.log(top);
    // console.log(top.location);
    // console.log(self.location);
    // console.log(top.location == self.location)
}

async function router(r) {
    switch (r) {
        case 0: // /index
            await index_page_init();
            break;
        case 1: // /wallet
            await wallet_page_init();
            break;
        case 2: // /invoice
            await invoice_page_init();
            break;
        default:
            break;
    }
}

async function authToken() {
    const initData = (await miniapp_init())
    if (initData) {
        //Open in telegram , new auth
        console.log("🚀 Login from telegram")
        const doauth = await api_auth({ initData: initData.initData });
        const token = doauth.token
        storage_set_authkey(token)
        storage_set_uid(
            doauth.data.id
        )
        storage_set_user_tg_data(JSON.stringify(doauth.data))
            // window.alert("qwq")
    } else {
        const token = storage_get_authkey();
        if (token) {
            //Verfiy if token works 
            const ping = await api_ping()
                // console.log("ping", ping)
            if (ping.code == 200) {
                //Local exsit auth key
                console.log("Auth token exsit :: ", token)
                storage_set_uid(ping.data)
                return token;
            }
        }
        //Check the link
        const token_url = new URLSearchParams(location.search).get("t");
        if (token_url) {
            //Verfiy if token works 
            storage_set_authkey(token_url)
            const ping = await api_ping()
                // console.log("ping", ping)
            if (ping.code == 200) {
                //Local exsit auth key
                console.log("Auth token exsit :: ", token_url)
                storage_set_uid(ping.data)
                return token_url;
            }
        }

        //Redirect to telegram login
        console.log("Require to login")
            // location.href = `https://wallet.tonspay.top/page-require-login.html`
    }

}

// init()