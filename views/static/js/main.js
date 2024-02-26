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
    //set the auth token into global
    await authToken()

}

async function authToken() {
    Telegram.WebApp.ready();
    const doauth = await api_auth({ initData: (await miniapp_init()).initData });
    const token = doauth.token
    storage_set_authkey(token)
    storage_set_uid(
        doauth.data.id
    )
    storage_set_user_tg_data(JSON.stringify(doauth.data))
    window.alert(doauth.data.id)
}

init()