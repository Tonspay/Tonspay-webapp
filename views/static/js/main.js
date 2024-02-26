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
    Telegram.WebApp.ready();
    // var ret = await api_ping();
    // var ret = storage_get_authkey()
    // console.log("🔥 await :: ", ret)

    // console.log(window.Telegram.WebApp.initDataUnsafe)
    // window.alert(window.Telegram.WebApp.initDataUnsafe)
    await api_debug({ initData: (await miniapp_init()).initData });
}

init()