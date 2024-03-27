const solana_notification_address = 'AVxLxXMA4NiKZYLH1AAZwqzTnaMi2itV3aiM7Td1pjgb'

let account;

let invoice;

/**
 * 🍺 Binance payment redirect 
 */
async function binance_pay_invoice()
{
  const invoice_id = new URLSearchParams(location.search).get("i")
  if (invoice_id) {
      const req = await api_info_invoice(invoice_id)
      if (req && req.data && req.data.id) {
          console.log("req", req)
          invoice = req.data
          // console.log(invoice)
          if(isMobile())
          {

          }else{
            const ele = document.getElementById("binance_pay_invoice_qr");
            ele.innerHTML = `<img src="${invoice.binance.qrcodeLink}" style="width: 50% ;display: inline-block;">`
          }
      }
  }
}

async function binance_pay_invoice_confirm()
{
  if(isMobile())
  {
    window.open(invoice.binance.deeplink, "_blank");
  }else{
    window.open(invoice.binance.universalUrl, "_blank");
  }
  
}


/**
 * 🍺 Solana & phantom netwrok connection
 */

async function phantom_connect_wallet() {

    //Check if phantom exsit
    if (window.solana) {
        // location.href = `https:///wallet.tonspay.top/page-wallet-connect-phantom?t=${storage_get_authkey()}`
        window.open(`https:///wallet.tonspay.top/page-wallet-connect-phantom?t=${storage_get_authkey()}`, "_blank");
    } else {
        const target = encodeURI("https://wallet.tonspay.top/api/webapp_redirect/page-wallet-connect-phantom/" + storage_get_authkey())
        const ref = encodeURI("https://wallet.tonspay.top")
            // console.log(`https://phantom.app/ul/browse/${target}?ref=${ref}`)
            window.open(`https://phantom.app/ul/browse/${target}?ref=${ref}`, "_blank");
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
        await solana.connect();
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

async function phantom_pay_invoices() {
    // await authToken();
    if (window.solana) {
          //Connect the metamask wallet
    account = await solana.connect()

    console.log("connected :: ", account.publicKey.toBase58())
        //Check the auth token
    const auth = storage_get_authkey();
    console.log("auth : ", auth);

    const invoice_id = new URLSearchParams(location.search).get("i")
    if (invoice_id) {
        const req = await api_info_invoice(invoice_id)
        if (req && req.data && req.data.id) {
            console.log("req", req)
            invoice = req.data
        }
    }
    }else {
      window.alert(location.href);
    }
}

async function phantom_pay_invoice_confirm() {
try{
  account = await solana.connect()
  const connection = new solanaWeb3.Connection('https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/');
  // var transaction = new solanaWeb3.Transaction()
  // transaction.add(
  //     solanaWeb3.SystemProgram.transfer({
  //         fromPubkey: account.publicKey,
  //         toPubkey: new solanaWeb3.PublicKey(invoice.address),
  //         lamports: invoice.amount
  //     }),
  // );
  // transaction.add(
  //     solanaWeb3.SystemProgram.transfer({
  //         fromPubkey: account.publicKey,
  //         toPubkey: new solanaWeb3.PublicKey(solana_notification_address),
  //         lamports: (invoice.amount*0.01).toFixed(0)
  //     }),
  // );
  // transaction.add(
  //     new solanaWeb3.TransactionInstruction({
  //         keys: [{ pubkey: account.publicKey, isSigner: true, isWritable: true }],
  //         data: Buffer.from(invoice.id, "utf-8"),
  //         programId: new solanaWeb3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  //       })
  // );
  // transaction.feePayer = account.publicKey;
  // let blockhashObj = await connection.getRecentBlockhash();
  
  // transaction.recentBlockhash = await blockhashObj.blockhash;

  // console.log(transaction)

  const transaction = await solana_invoice_confirm(account)
  await window.solana.signAndSendTransaction(transaction)
}catch(e)
{
  console.error(e)
  window.alert(e)
}

    router_to_webapp_index()
}

/**
 * 🍺 TON network connection
 */

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

/**
 * 🍺 EVM & Metamask network connection
 */

const tbsc = {
  chainId: "0x61",
  rpcUrls: ["https://endpoints.omniatech.io/v1/bsc/testnet/public"],
  chainName: "BNB Smart Chain Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18
  },
  blockExplorerUrls: ["https://testnet.bscscan.com"],
  contract:"0x263aD853F020075De3FC1D3e24e9d8E88BcD9182"
}
const arb = {
chainId: "0xa4b1",
rpcUrls: ["https://1rpc.io/arb"],
chainName: "Arbitrum One",
nativeCurrency: {
  name: "Arbitrum One",
  symbol: "Arb",
  decimals: 18
},
blockExplorerUrls: ["https://arbiscan.io/"],
contract:'0x318b6ab1cbC3258a083c77a6FBC9a1215FfdDeA4'
}
const targetChian = arb;
const metamask_router_rate = 0.01; //1% feerate during test .


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
    await metamask_check_chain()
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
    window.web3 = new Web3(window.ethereum);
    const contract = await metamask_load_contract(targetChian.contract);
    console.log(invoice.address , 
        invoice.amount,
        invoice.id)
        try{
          const finalValue = (invoice.amount*(1+metamask_router_rate)).toFixed(0)
          const ct = await contract.methods.transfer(
            invoice.address , 
            invoice.amount,
            invoice.id)
        await ct.send({ from: accounts[0], value : finalValue }).then((txHash) =>  {console.log(txHash) ; router_to_index()});
        }catch(e)
        {
          if(e.code==100)
          {
            //User cancel
          }else{
            router_to_index()
          }
        }

}

async function metamask_check_chain()
{
      var currentChain = "0x"+window.ethereum.networkVersion.toString(16)
      if(currentChain != targetChian.chainId)
      {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetChian.chainId }], 
            });
          } catch (error) {
            if (error.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    targetChian
                  ],
                });
              } catch (addError) {
                console.error(addError);
              }
            }
            console.error(error);
          }
      }
}

async function metamask_load_contract(contract) {
    return await new window.web3.eth.Contract([
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "originFrom",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountFinal",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountRouter",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isPrepaid",
            "type": "bool"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          }
        ],
        "name": "pay",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "originFrom",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountFinal",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amountRouter",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "isPrepaid",
            "type": "bool"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          }
        ],
        "name": "payToken",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          }
        ],
        "name": "withdrawToken",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "routerAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "name": "transferToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdrawTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraws",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ], contract);
}

//OKX wallet

async function okx_pay_invoices() {
  // await authToken();
  console.log("connected :: ", account)
  //Check the auth token
  // const auth = storage_get_authkey();
  // console.log("auth : ", auth);
  const invoice_id = new URLSearchParams(location.search).get("i")
  console.log("invoices : ", invoice_id)
  if (invoice_id) {
      const req = await api_info_invoice(invoice_id)
      if (req && req.data && req.data.id) {
          console.log("req", req)
          invoice = req.data
          switch(invoice.type)
          {
            case 1 :
              account = await window.okxwallet.solana.connect();
              console.log("account",account)
              break;
            case 2:
                //Connect the okx wallet 
                const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                account = accounts[0];
                await metamask_check_chain()
                break;
            default : 
              break;
          }
      }
  }
}

/**
 * OKEX wallet onboard
 */

async function okx_pay_invoice_confirm() {
  try{
    switch(invoice.type)
    {
      case 1 :
        account = await window.okxwallet.solana.connect();
        console.log("account",account)
        const transaction = await solana_invoice_confirm(account)
        console.log('transaction',transaction);
        
        await window.okxwallet.solana.signAndSendTransaction(transaction)
        
        break;
      case 2:
          //Connect the okx wallet 
          await metamask_pay_invoice_confirm()
          break;
      default : 
        break;
    }
  }catch(e){console.error(e)}
}

async function solana_invoice_confirm(account)
{
  const connection = new solanaWeb3.Connection('https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/');
  var transaction = new solanaWeb3.Transaction()
  transaction.add(
      solanaWeb3.SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: new solanaWeb3.PublicKey(invoice.address),
          lamports: invoice.amount
      }),
  );
  transaction.add(
      solanaWeb3.SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: new solanaWeb3.PublicKey(solana_notification_address),
          lamports: (invoice.amount*0.01).toFixed(0)
      }),
  );
  transaction.add(
      new solanaWeb3.TransactionInstruction({
          keys: [{ pubkey: account.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(invoice.id, "utf-8"),
          programId: new solanaWeb3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
  );
  transaction.feePayer = account.publicKey;
  let blockhashObj = await connection.getRecentBlockhash();
  
  transaction.recentBlockhash = await blockhashObj.blockhash;

  return transaction;
}

/**
 * Tonconnect wallet 
 */
var tonConnectUI;
async function ton_pay_invoice() {
  await get_invoice_details();
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://tonspay.github.io/Tonspay-manifest/tonsmarket.json',
      uiPreferences: {
        theme: TON_CONNECT_UI.THEME.DARK,
    },
    });
    await tonConnectUI.openModal();
    console.log(tonConnectUI)
  
    tonConnectUI.onStatusChange(
        walletAndwalletInfo => {
            // update state/reactive variables to show updates in the ui
            console.log("change : ",walletAndwalletInfo)
            account = walletAndwalletInfo
        } 
    );

}

async function ton_pay_invoice_confirm() {
  const state = tonConnectUI.modalState
  if(state && state.closeReason && state.closeReason == 'wallet-selected' && invoice)
  {
    console.log(state,account)
    console.log(invoice)


    let a = new TonWeb.boc.Cell();
    a.bits.writeUint(0, 32);
    a.bits.writeString(invoice.id);
    let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

    console.log(payload)

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
          {
              address: invoice.address,
              amount: invoice.amount,
          },
          {
              address: "UQAaOTy02IgPjn6Pt7LIFyyBqjWe6y4exnx1MIOEjD1OG2xA",
              amount: (invoice.amount*metamask_router_rate).toFixed(0),
              payload: payload
          }
      ]
  }
  
  try {
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log("result : ",result)
      // you can use signed boc to find the transaction 
      const someTxData = await myAppExplorerService.getTransaction(result.boc);
      alert('Transaction was sent successfully', someTxData);
  } catch (e) {
      console.error(e);
  }
  
  }else{
    console.log('try open again')
    // await tonConnectUI.closeModal();
    await tonConnectUI.openModal();
  }
}


/**
 * Common functions : 
 */

async function get_invoice_details()
{
  const invoice_id = new URLSearchParams(location.search).get("i")
  console.log("invoices : ", invoice_id)
  if (invoice_id) {
      const req = await api_info_invoice(invoice_id)
      if (req && req.data && req.data.id) {
          console.log("req", req)
          invoice = req.data
          return invoice;
      }
  }
  return false
}