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


async function init() {
    // console.log("🔥 Check cache")
    //set the auth token into global
    await authToken()

}

async function authToken() {
    const initData = (await miniapp_init())
    if (initData) {
        //Open in telegram , new auth
        const doauth = await api_auth({ initData: initData.initData });
        const token = doauth.token
        storage_set_authkey(token)
        storage_set_uid(
            doauth.data.id
        )
        storage_set_user_tg_data(JSON.stringify(doauth.data))

        window.alert(doauth.data.id)
    } else {
        const token = storage_get_authkey();
        if (token) {
            //Local exsit auth key
        } else {
            //Redirect to telegram login
        }
    }

}

init()