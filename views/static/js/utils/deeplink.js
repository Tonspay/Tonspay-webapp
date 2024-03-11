let account;

let invoice;

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
    const req = await api_connection_metamask({ sign: sign })
    console.log("req", req)
}
async function metamask_pay_invoices() {
    await authToken();
    //Connect the metamask wallet
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    console.log("connected :: ", account)
        //Check the auth token
    const auth = storage_get_authkey();
    console.log("auth : ", auth);

    const invoice_id = new URLSearchParams(location.search).get("i")

    console.log("invoices : ", invoice_id)
    if (invoice_id) {
        const req = await api_info_invoice(invoice_id)
        if (req && req.data && req.data.id) {
            console.log("req", req)
            invoice = req.data
        }
    }
}

async function metamask_pay_invoice_confirm() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await ethereum
        .request({
            method: "eth_sendTransaction",
            // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
            params: [{
                // The user's active address.
                from: accounts[0],
                // Required except during contract publications.
                to: account,
                // Only required to send ether to the recipient from the initiating external account.
                value: 0,
            }, ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error(error));
}