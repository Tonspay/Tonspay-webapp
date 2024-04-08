/**
 * This file is about the main page of /index.html
 * 
 * Including : 
 *  - Iinit information fetch logic 
 *  - DOM control & Page information disply 
 *  - Action functions
 */

/**
 * Global datas
 */
var balances = {
    ton : 0,
    phantom  :0,
    metamask : 0,
}

//Init the page with data fetch
async function index_page_init() {
    await wallets_display()
}

async function wallets_display() {
    const wallets = await api_info_connection()
    console.log("🔥 Fetch wallet information :: ")
    console.log(wallets)

    if (wallets.data && wallets.data.length > 0) {
        for(var i = 0 ; i < wallets.data.length ; i ++)
        {
            var ele = wallets.data[i]
            switch (ele.type) {
                case 0: //TON
                    balances['ton'] = (await api_balance_ton(ele.address)).balance;
                    ele.address = (new TonWeb.utils.Address(ele.address)).toString({isUserFriendly:true,isUrlSafe:true,isBounceable:false})
                    wallet_card_connected("ton", ele.address)
                    break;
                case 1:
                    balances['phantom'] = (await api_balance_phantom(ele.address));
                    wallet_card_connected("phantom", ele.address)
                    break;
                case 2:
                    balances['metamask'] = (await api_balance_metamask(ele.address));
                    wallet_card_connected("metamask", ele.address)
                    break;
                default:
                    break;
            }
        }
        console.log("🐞",balances)
    }

    await invoice_list_draw()
}

//Change the card status & type
function wallet_card_connect_button(id) {

    const mount_connected = document.getElementById(id + '_card_connect_status_connected')
    const mount_connected_address = document.getElementById(id + '_card_connect_status_connected_address')
    const mount_connected_disconnect = document.getElementById(id + '_card_connect_status_connected_disconnect')
    const mount_unconnected = document.getElementById(id + '_card_connect_status_unconnected')

    // console.log("🐞 wallet_card_connected", mount_unconnected)
    if (mount_unconnected.style.display == "none") {
        //Connected
        mount_unconnected.style.display = "inline"
        mount_connected.style.display = "none"
        mount_connected_address.style.display = "none"
        mount_connected_disconnect.style.display = "none"
    } else {
        //Unconnected

        mount_unconnected.style.display = "none"
        mount_connected.style.display = "inline"
        mount_connected_address.style.display = "inline"
        mount_connected_disconnect.style.display = "inline"
        console.log("unconnect", mount_connected_address)
    }

    return 0;
}
//New connected card draws
function wallet_card_connected(id, address) {
    // console.log("🐞 wallet_card_connected", id)
    const mount_connected_address = document.getElementById(id + '_card_address')
    mount_connected_address.innerHTML = `${address}`
    wallet_card_connect_button(id)
    wallet_card_connect_balance(id)
    return 0;
}
//Get the connected card balance
function wallet_card_connect_balance(id) {
    const mount_connected = document.getElementById(id + '_card_balance')
    const balance = amount_to_display(id,balances[id]);
    mount_connected.innerHTML = `${balance}`
    return 0;
}
//Disconnect the card
async function phantom_disconnect_wallet(id) {
    await api_disconnect_phantom()
    wallet_card_connect_button('phantom')
    return 0;
}
async function ton_disconnect_wallet(id) {
    console.log("🐞Disconnect ton")
    await api_disconnect_ton()
    wallet_card_connect_button('ton')
    return 0;
}
async function metamask_disconnect_wallet(id) {
    await api_disconnect_metamask()
    wallet_card_connect_button('metamask')
    return 0;
}


function debug() {
    console.log("🔥 Debug")
    wallet_card_connect_button("ton")
}