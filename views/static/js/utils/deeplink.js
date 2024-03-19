const solana_notification_address = 'AVxLxXMA4NiKZYLH1AAZwqzTnaMi2itV3aiM7Td1pjgb'

let account;

let invoice;

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
    await authToken();
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
    account = await solana.connect()
    const connection = new solanaWeb3.Connection('https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/');
    console.log(connection)
    console.log(account)
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
            lamports: 1000000
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

    console.log(transaction)
    await window.solana.signAndSendTransaction(transaction)

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
    const contract = await metamask_load_contract();
    console.log(        invoice.address , 
        invoice.amount,
        invoice.id,
        10)
        try{
          const ct = await contract.methods.transfer(
            invoice.address , 
            invoice.amount,
            invoice.id,
            10)
        await ct.send({ from: accounts[0], value : invoice.amount }).then((txHash) =>  {console.log(txHash) ; router_to_index()});
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
    const targetChian = {
        chainId: "0x61",
        rpcUrls: ["https://endpoints.omniatech.io/v1/bsc/testnet/public"],
        chainName: "BNB Smart Chain Testnet",
        nativeCurrency: {
          name: "tBNB",
          symbol: "tBNB",
          decimals: 18
        },
        blockExplorerUrls: ["https://testnet.bscscan.com"]
      }
      var currentChain = "0x"+window.ethereum.networkVersion.toString(16)
      if(currentChain != targetChian.chainId)
      {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }], 
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

async function metamask_load_contract() {
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
        "inputs": [],
        "name": "routerRateDecimail",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
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
          },
          {
            "internalType": "uint256",
            "name": "routerRate",
            "type": "uint256"
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
            "internalType": "address",
            "name": "token",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "routerRate",
            "type": "uint256"
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
    ], '0x4d978743b36b7f8a72b8c2cd77dd24b33d9e2d9b');
}