let account;

let invoice;

async function phantom_connect_wallet() {

    //Check if phantom exsit
    if (window.solana) {
        location.href = `https:///wallet.tonspay.top/page-wallet-connect-phantom?t=${storage_get_authkey()}`
    } else {
        const target = encodeURI("https://wallet.tonspay.top/api/webapp_redirect/page-wallet-connect-phantom/" + storage_get_authkey())
        const ref = encodeURI("https://wallet.tonspay.top")
        console.log(`https://phantom.app/ul/browse/${target}?ref=${ref}`)
        location.href = `https://phantom.app/ul/browse/${target}?ref=${ref}`
            // location.href = `https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/page-wallet-connect-phantom.html`;
            //Ignore the old way

        //Generate a new sign kp
        // const pk = await api_preconnect_phantom();
        // if (pk.data) {
        //     console.log("phantom connect wallet")
        //         // console.log(`https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/api/connect/phantom/${(storage_get_uid())}`)
        //     location.href = `https://phantom.app/ul/v1/connect?app_url=https://phantom.app&dapp_encryption_public_key=${pk.data}&redirect_link=wallet.tonspay.top/page-wallet-connect-confirm.html`;
        // } else {
        //     console.error("phantom connect failed")
        // }
    }
}
async function phantom_connect_wallet_sign() {
    if (window.solana) {
        await authToken();
        const signData = (await api_preconnect_phantom(true)).data;
        await solana.connect().then(async(x) => {
            // console.log("🔥 Phanton connect :: ")
            // console.log(x)
            // console.log(x.publicKey.toString())
        })
        const signedMessage = await window.solana.request({
            method: "signMessage",
            params: {
                message: new TextEncoder().encode(signData),
                display: "utf8", //hex,utf8
            },
        });
        // console.log(signData, signedMessage)
        // console.log(signedMessage.signature.toString("hex"))
        // console.log(signedMessage.publicKey.toString("hex"))
        // console.log(signedMessage.publicKey.toBase58())
        await api_connection_phantom({
            type: true,
            signature: signedMessage.signature.toString("hex"),
            publicKey: signedMessage.publicKey.toBase58()
        })
    } else {
        window.alert(location.href);
    }

    router_to_webapp_index()
}
async function ton_connect_wallet() {
    console.log("ton connect wallet")
}
async function metamask_connect_wallet() {
    if (window.ethereum) {
        location.href = `https:///wallet.tonspay.top/page-wallet-connect-metamask?t=${storage_get_authkey()}`
    } else {
        location.href = `https://metamask.app.link/dapp/wallet.tonspay.top/page-wallet-connect-metamask?t=${storage_get_authkey()}`
    }
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
        .then((txHash) => router_to_index())
        .catch((error) => console.error(error));
}

async function deeplink_invoice_call_up(invoice) {
    switch (invoice.type) {
        case 2:
            if (window.ethereum) {
                return `https://wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`
            } else {
                return `https://metamask.app.link/dapp/wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`
            }

        default:
            break;
    }
}