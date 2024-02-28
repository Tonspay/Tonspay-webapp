async function phantom_connect_wallet() {
    //Generate a new sign kp
    const pk = await api_preconnect_phantom();
    if (pk.data) {
        console.log("phantom connect wallet")
        location.href = `https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/api/connect/phantom/${storage_get_uid()}`;
    } else {
        console.error("phantom connect failed")
    }

}
async function ton_connect_wallet() {
    console.log("phantom connect wallet")
}
async function metamask_connect_wallet() {
    console.log("phantom connect wallet")
}