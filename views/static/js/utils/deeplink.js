async function phantom_connect_wallet() {
    //Generate a new sign kp
    const pk = await api_preconnect_phantom();
    if (pk.data) {
        console.log("phantom connect wallet")
            // console.log(`https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/api/connect/phantom/${(storage_get_uid())}`)
        location.href = `https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/page-wallet-connect-confirm.html`;
    } else {
        console.error("phantom connect failed")
    }
}

async function ton_connect_wallet() {
    console.log("ton connect wallet")
}
async function metamask_connect_wallet() {
    location.href = `https://metamask.app.link/dapp/cash.tonspay.top/metamask.html?t=${storage_get_authkey()}`
}
async function metamask_connect_wallet_sign() {
    await authToken();
    //Connect the metamask wallet
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    console.log("connected :: ", account)
        //Check the auth token
    const auth = storage_get_authkey();
    console.log("auth : ", auth);

    const pre = await api_preconnect_metamask();
    console.log("ping :: ", pre)
    const sign = await ethereum.request({
        method: "personal_sign",
        params: [pre.data, account],
    });
    console.log(pre.data, sign)
    const req = await api_connection_metamask({ data: sign })
    console.log("req", req)
}