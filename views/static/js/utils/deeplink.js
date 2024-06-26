const solana_notification_address = 'AVxLxXMA4NiKZYLH1AAZwqzTnaMi2itV3aiM7Td1pjgb'

let account;

let invoice;

let ton_manifest = `${siteBaseUrl}/api/manifest`

let sol_rpc_url = 'https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/'

let deeplink_router = {
  ton:{
    type : 0,
    token : {
      0:'ton',
      1:'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
    }
  }
}

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
        window.open(`https:///test.tonspay.top/page-wallet-connect-phantom?t=${storage_get_authkey()}`, "_blank");
    } else {
        const target = encodeURI(`${siteBaseUrl}/api/webapp_redirect/page-wallet-connect-phantom/` + storage_get_authkey())
        const ref = encodeURI(`${siteBaseUrl}`)
            window.open(`https://phantom.app/ul/browse/${target}?ref=${ref}`, "_blank");
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

async function solana_invoice_confirm(account)
{
  const connection = new solanaWeb3.Connection('https://hardworking-dimensional-shard.solana-mainnet.quiknode.pro/751ff4a4207ab5375a094a904551836b73028cee/');
  var transaction = new solanaWeb3.Transaction()


  var paymentTx = false;

  if(invoice.token != 0)
  {
    //SPL transfer
    console.log("🚧 SPL transfer")
    

    switch(invoice.token)
    {
      case 1 : 
      break;
  
      default : 
      break;
    }
    throw("Demo test")
  }else
  {
    //SOL transfer
    console.log("🚧 SOL transfer")
    paymentTx = solanaWeb3.SystemProgram.transfer({
      fromPubkey: account.publicKey,
      toPubkey: new solanaWeb3.PublicKey(invoice.address),
      lamports: invoice.amount
    })
  }

  if(!paymentTx)
  {
    window.alert("🚧 ERROR During TX constructing")
  }
  transaction.add(
    paymentTx
  )
    //Noticed transaction transfer 
  transaction.add(
      solanaWeb3.SystemProgram.transfer({
          fromPubkey: account.publicKey,
          toPubkey: new solanaWeb3.PublicKey(invoice.routerAddress),
          lamports: (invoice.amount*Number(invoice.routerFeeRate)).toFixed(0)
      }),
  );

    //Message transaction transfer 
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


async function phantom_pay_invoice_confirm() {
try{
  account = await solana.connect()
  const connection = new solanaWeb3.Connection(sol_rpc_url);
  const transaction = await solana_invoice_confirm(account)
  await window.solana.signAndSendTransaction(transaction)
}catch(e)
{
  console.error(e)
  window.alert(e)
}

  if(invoice?.redirect)
  {
    router_to_outter_any(invoice.redirect)
  }
    router_to_webapp_index()
}

async function tonspack_pay_invoices() {
  const type = new URLSearchParams(location.search).get("type")
  if(type && type == "bridge")
  {
    try{
      const invoice = new URLSearchParams(location.search).get("i");
      const data = JSON.parse(
        Buffer.from(invoice,'hex').toString()
      )
      bridge_evm_ton_preload(data)
      
    }catch(e)
    {
      console.error(e)
      window.alert(e)
      //Reload the page 
    }
    return true;
  }
  const invoice_id = new URLSearchParams(location.search).get("i")
  if (invoice_id) {
      const req = await api_info_invoice(invoice_id)
      if (req && req.data && req.data.id) {
          // console.log("req", req)
          invoice = req.data
          console.log(invoice)
          await tonspack_pay_invoices_connectwallet(invoice)
      }
  }
}

async function tonspack_pay_invoices_confirm() {
  try{
    const type = new URLSearchParams(location.search).get("type")
    if(type && type == "bridge")
    {
      await bridge_evm_ton_tonspack()
    }
   
    switch(invoice.type)
    {
      case 1 :
        const transaction = await solana_invoice_confirm(new solanaWeb3.publicKey(account))
        console.log('transaction',transaction);
        
        await window.okxwallet.solana.signAndSendTransaction(transaction)
        
        break;
      case 2: case 5: case 6 : case 7:
          //Connect the okx wallet 
          window.web3 = new Web3(window.ethereum);

            const contract = await metamask_load_contract(invoice.routerAddress);
            console.log(invoice.address , 
                invoice.amount,
                invoice.id,contract)
                try{
                  const finalValue = (invoice.amount*(1+invoice.routerFeeRate)).toFixed(0)
                  const ct = await contract.methods.transfer(
                    invoice.address , 
                    invoice.amount,
                    invoice.id)
                    data =await ct.encodeABI();

                    var txns = {
                      t:invoice.address,
                      v:invoice.amount,
                      d:data
                  }
                  var pack = new Tonspack();
                  await await pack.send(chain,txns)
                    if(invoice?.redirect)
                    {
                      router_to_outter_any(invoice.redirect)
                    }
                    router_to_webapp_index()
                    
                }catch(e)
                {
                  if(e.code==100)
                  {
                    //User cancel
                  }else{
                    console.log("🐞 ERROR :: ",e)
                    router_to_index()
                  }
                }
          
      case 4:
          await tron_invoice_cofirm(okxwallet.tronLink.tronWeb)
          break;
      default : 
        break;
    }
  }catch(e){console.error(e)}
}


async function tonspack_pay_invoices_connectwallet(invoice)
{
  switch(invoice.type)
  {
    case 1 :
      var pack = new Tonspack();
      console.log('pack.uuid',pack.uuid)
      var account = await pack.connect({t:1,i:1})
      console.log("account",account)
      break;
    case 2: case 5: case 6: case 7:
      var chain = await tonspack_pay_invoices_evm_check_chain_router(invoice.type)
      if(chain)
      {
        var pack = new Tonspack();
        console.log('pack.uuid',pack.uuid)
        console.log(chain)
        const chainId = parseInt(chain.chainId)
        console.log(chainId)
        var account = await pack.connect({t:1,i:chainId})
        console.log("account",account)
      }
      break;
    default : 
      break;
  }
}

async function tonspack_pay_invoices_evm_check_chain_router(type)
{
  switch(type)
  {
    case 2 :
      return (arb);
      break;
    case 5:
      return (bsc);
      break;
    case 6:
      return (planq);
      break;
    case 7:
      return (scroll);
      break;
    default :
      break;
  }

  var accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  return account
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
const bsc = {
  chainIdRaw:56,
  chainId: "0x38",
  rpcUrls: ["https://binance.llamarpc.com"],
  chainName: "BNB Chain ",
  nativeCurrency: {
    name: "BNB Chain ",
    symbol: "BNB",
    decimals: 18
  },
  blockExplorerUrls: ["https://bscscan.io/"],
  contract:'0xab03f37611728B23A6e9Bf89E2C5a5dfAA5b7C4c',
  wton:"0x76A797A59Ba2C17726896976B7B3747BfD1d220f"
}
const eth = {
  chainIdRaw:1,
  chainId: "0x1",
  rpcUrls: ["https://rpc.ankr.com/eth"],
  chainName: "ETH",
  nativeCurrency: {
    name: "Eth",
    symbol: "ETH",
    decimals: 18
  },
  blockExplorerUrls: ["https://etherscan.io/"],
  contract:'0x318b6ab1cbC3258a083c77a6FBC9a1215FfdDeA4',
  wton:"0x582d872a1b094fc48f5de31d3b73f2d9be47def1"
}
const op = {
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

const planq = {
  chainId: "0x1b9e",
  rpcUrls: ["https://planq-rpc.nodies.app"],
  chainName: "Planq Mainnet",
  nativeCurrency: {
    name: "Planq Mainnet",
    symbol: "PLQ",
    decimals: 18
  },
  blockExplorerUrls: ["https://evm.planq.network"],
  contract:'0x318b6ab1cbC3258a083c77a6FBC9a1215FfdDeA4'
  }

const scroll = {
  chainId: "0x82750",
  rpcUrls: ["https://rpc.ankr.com/scroll"],
  chainName: "Scroll Mainnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  blockExplorerUrls: ["https://scrollscan.com"],
  contract:'0x318b6ab1cbC3258a083c77a6FBC9a1215FfdDeA4'
  }
var targetChian = arb;
var metamask_router_rate = 0.01; //1% feerate during test .
var ton_fee_rate = 0;


async function metamask_connect_wallet() {
  if (window.ethereum) {
      location.href = `https:///test.tonspay.top/page-wallet-connect-metamask?t=${storage_get_authkey()}`
  } else {
      location.href = `https://metamask.app.link/dapp/test.tonspay.top/page-wallet-connect-metamask?t=${storage_get_authkey()}`
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
    // await authToken();
    //Connect the metamask wallet
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];

    const type = new URLSearchParams(location.search).get("type")
    if(type && type == "bridge")
    {
      const invoice = new URLSearchParams(location.search).get("i");
      // console.log(invoice)
      // console.log(Buffer.from(invoice,'hex').toString())
      const data = JSON.parse(
        Buffer.from(invoice,'hex').toString()
      )
      await bridge_evm_ton_preload(data);
    }else{

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
              await evm_check_chain_router(invoice.type)
              // await evm_check_chain()
              console.log("connected :: ", account)
          }
      }
    }
}

async function evm_check_chain_router(type)
{
  switch(type)
  {
    case 2 :
      await evm_check_chain(arb);
      break;
    case 5:
      await evm_check_chain(bsc);
      break;
    case 6:
      await evm_check_chain(planq);
      break;
    case 7:
      await evm_check_chain(scroll);
      break;
    default :
      break;
  }

  var accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  return account
}

async function metamask_pay_invoice_confirm() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    window.web3 = new Web3(window.ethereum);
    const type = new URLSearchParams(location.search).get("type")
    if(type && type == "bridge")
    {
      try{
        await bridge_evm_ton()
      }catch(e)
      {
        console.error(e)
        //Reload the page 
      }
      
    }else{
      const contract = await metamask_load_contract(invoice.routerAddress);
      console.log(invoice.address , 
          invoice.amount,
          invoice.id,contract)
          try{
            const finalValue = (invoice.amount*(1+invoice.routerFeeRate)).toFixed(0)
            const ct = await contract.methods.transfer(
              invoice.address , 
              invoice.amount,
              invoice.id)
              await ct.send({ from: accounts[0], value : finalValue }).then((txHash) =>  {console.log(txHash) ; router_to_index()});
              if(invoice?.redirect)
              {
                router_to_outter_any(invoice.redirect)
              }
              router_to_webapp_index()
              
          }catch(e)
          {
            if(e.code==100)
            {
              //User cancel
            }else{
              console.log("🐞 ERROR :: ",e)
              router_to_index()
            }
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

async function evm_check_chain(t)
{
  targetChian = t;
    if(window.ethereum.networkVersion)
    {

    }else{
      window.ethereum.networkVersion = 999999
    }
      var currentChain = "0x"+window.ethereum.networkVersion.toString(16)
      if(currentChain != t.chainId)
      {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: t.chainId }], 
            });
          } catch (error) {
            // window.alert(error)
            if (error.code === 4902) {
              try {
                const addchain = JSON.parse(JSON.stringify(t));
                delete addchain.contract;
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    addchain
                  ],
                });
              } catch (addError) {
                // window.alert(addError)
                console.error("🐞Add chain error",addError);
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

async function evm_load_erc20_contract(contract) {
  return await new window.web3.eth.Contract([{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"address[]","name":"initialSet","type":"address[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int256","name":"oracleSetHash","type":"int256"},{"indexed":false,"internalType":"address[]","name":"newOracles","type":"address[]"}],"name":"NewOracleSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"int8","name":"to_wc","type":"int8"},{"indexed":true,"internalType":"bytes32","name":"to_addr_hash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"SwapEthToTon","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int8","name":"workchain","type":"int8"},{"indexed":true,"internalType":"bytes32","name":"ton_address_hash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"ton_tx_hash","type":"bytes32"},{"indexed":false,"internalType":"uint64","name":"lt","type":"uint64"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"SwapTonToEth","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"allowBurn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"components":[{"internalType":"int8","name":"workchain","type":"int8"},{"internalType":"bytes32","name":"address_hash","type":"bytes32"}],"internalType":"struct TonUtils.TonAddress","name":"addr","type":"tuple"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"components":[{"internalType":"int8","name":"workchain","type":"int8"},{"internalType":"bytes32","name":"address_hash","type":"bytes32"}],"internalType":"struct TonUtils.TonAddress","name":"addr","type":"tuple"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"digest","type":"bytes32"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct TonUtils.Signature","name":"sig","type":"tuple"}],"name":"checkSignature","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"finishedVotings","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getFullOracleSet","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"newBurnStatus","type":"bool"},{"internalType":"int256","name":"nonce","type":"int256"}],"name":"getNewBurnStatusId","outputs":[{"internalType":"bytes32","name":"result","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int256","name":"oracleSetHash","type":"int256"},{"internalType":"address[]","name":"set","type":"address[]"}],"name":"getNewSetId","outputs":[{"internalType":"bytes32","name":"result","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint64","name":"amount","type":"uint64"},{"components":[{"components":[{"internalType":"int8","name":"workchain","type":"int8"},{"internalType":"bytes32","name":"address_hash","type":"bytes32"}],"internalType":"struct TonUtils.TonAddress","name":"address_","type":"tuple"},{"internalType":"bytes32","name":"tx_hash","type":"bytes32"},{"internalType":"uint64","name":"lt","type":"uint64"}],"internalType":"struct TonUtils.TonTxID","name":"tx","type":"tuple"}],"internalType":"struct TonUtils.SwapData","name":"data","type":"tuple"}],"name":"getSwapDataId","outputs":[{"internalType":"bytes32","name":"result","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isOracle","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"oraclesSet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint64","name":"amount","type":"uint64"},{"components":[{"components":[{"internalType":"int8","name":"workchain","type":"int8"},{"internalType":"bytes32","name":"address_hash","type":"bytes32"}],"internalType":"struct TonUtils.TonAddress","name":"address_","type":"tuple"},{"internalType":"bytes32","name":"tx_hash","type":"bytes32"},{"internalType":"uint64","name":"lt","type":"uint64"}],"internalType":"struct TonUtils.TonTxID","name":"tx","type":"tuple"}],"internalType":"struct TonUtils.SwapData","name":"data","type":"tuple"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct TonUtils.Signature[]","name":"signatures","type":"tuple[]"}],"name":"voteForMinting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"oracleSetHash","type":"int256"},{"internalType":"address[]","name":"newOracles","type":"address[]"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct TonUtils.Signature[]","name":"signatures","type":"tuple[]"}],"name":"voteForNewOracleSet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newBurnStatus","type":"bool"},{"internalType":"int256","name":"nonce","type":"int256"},{"components":[{"internalType":"address","name":"signer","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct TonUtils.Signature[]","name":"signatures","type":"tuple[]"}],"name":"voteForSwitchBurn","outputs":[],"stateMutability":"nonpayable","type":"function"}], contract);
}

async function evm_balance_erc20(address,target)
{
  window.web3 = new Web3(window.ethereum);
  const contract = await evm_load_erc20_contract(address);
      try{
        const ct = await contract.methods.balanceOf(
          target)
          console.log(ret)
          var ret = await ct.call();
          return ret;
      }catch(e)
      {
        console.error(e)
        if(e.code==100)
        {
          //User cancel
        }
      }
}

async function evm_allowance_erc20(address,target)
{
  window.web3 = new Web3(window.ethereum);
  const contract = await evm_load_erc20_contract(address);
      try{
        var accounts = await ethereum.request({ method: "eth_requestAccounts" });
        const ct = await contract.methods.allowance(
          accounts[0],target)
          console.log(ret)
          var ret = await ct.call();
          return ret;
      }catch(e)
      {
        console.error(e)
        if(e.code==100)
        {
          //User cancel
        }
      }
}
async function evm_approve_erc20_allowance(address,target,amount)
{
  window.web3 = new Web3(window.ethereum);
  const contract = await evm_load_erc20_contract(address);
      try{
        const ct = await contract.methods.approve(
          target,amount)
          console.log(ct)
          var accounts = await ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts)
          var ret = await ct.send({ from: accounts[0] })
          return ret;
      }catch(e)
      {
        console.error(e)
        if(e.code==100)
        {
          //User cancel
        }
      }
}

async function evm_burn_erc20(address,target,amount)
{
  window.web3 = new Web3(window.ethereum);
  const contract = await evm_load_erc20_contract(address);
      try{
        const ct = await contract.methods.burn(
          amount,target)
          console.log(ct)
          var accounts = await ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts)
          var ret = await ct.send({ from: accounts[0] })
          return ret;
      }catch(e)
      {
        console.error(e)
        if(e.code==100)
        {
          //User cancel
        }
      }
}

async function evm_get_account()
{
  return await ethereum.request({ method: "eth_requestAccounts" });
}

//OKX wallet

async function okx_pay_invoices() {
  console.log("connected :: ", account)
  const type = new URLSearchParams(location.search).get("type")
  if(type && type == "bridge")
  {
    try{
      const invoice = new URLSearchParams(location.search).get("i");
      const data = JSON.parse(
        Buffer.from(invoice,'hex').toString()
      )
      await bridge_evm_ton_preload(data);
    }catch(e)
    {
      window.alert(e)
    }

  }else{
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
              case 4:
                  console.log("TRON")
                  var accounts = await window.okxwallet.tronLink.request({ method: 'tron_requestAccounts'})
                  console.log(accounts)
              case 2: case 5: case 6: case 7:
                await evm_check_chain_router(invoice.type)
                break;
              default : 
                break;
            }
        }
    }
  }

}

/**
 * OKEX wallet onboard
 */

async function okx_pay_invoice_confirm() {
  const type = new URLSearchParams(location.search).get("type")
  if(type && type == "bridge")
  {
    try{
      await bridge_evm_ton()
    }catch(e)
    {
      console.error(e)
      window.alert(e)
      //Reload the page 
    }
    
  }else{
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
        case 2: case 5: case 6 : case 7:
            //Connect the okx wallet 
            await metamask_pay_invoice_confirm()
            break;
        case 4:
            await tron_invoice_cofirm(okxwallet.tronLink.tronWeb)
            break;
        default : 
          break;
      }
    }catch(e){console.error(e)}
  }

}


async function tron_invoice_cofirm(tronWeb)
{
  try{
    await tronWeb.transactionBuilder.sendTrx(invoice.address,invoice.amount);
  }catch(e)
  {
    console.log(e)
    // window.alert(e)
  }
  
}

/**
 * Tonconnect wallet 
 * 
 * Ton router :
 * 
 */
var tonConnectUI;

async function ton_connect_wallet() {
  console.log("🐞 Tonconnect")
  location.href=`${window.location.origin}/page-wallet-connect-ton`
  // window.open(`${window.location.origin}/page-wallet-connect-ton`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}
function ton_connect_status_check()
{
  if(!tonConnectUI)
  {
    return false;
  }

  var state = tonConnectUI.modalState

  if(state && (state.status != 'closed' || state.closeReason == 'wallet-selected' || !state.closeReason))
  {
    return true;
  }else
  {
    return false;
  }
}
async function ton_connect_ui_connect(url) {
    try{
      if(!tonConnectUI)
      {
        console.log("🚧 INIT the tonconnect ",tonConnectUI)
        var manifest = ton_manifest ;
        if(url)
        {
          manifest+=`?url=${url}`
        }
        console.log(ton_manifest)
        tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
          manifestUrl: manifest,
          uiPreferences: {
            theme: TON_CONNECT_UI.THEME.DARK,
        },
        });
      }
    }catch(e){console.error(e) ;}      
          console.log("tonConnectUI.connected :: @2.0.0",tonConnectUI.connected)
          // if(state && (state.status != 'closed' || state.closeReason == 'wallet-selected' || !state.closeReason))
          try{
              if(tonConnectUI.connected)
              {
                  console.log("Disconnect for connection reload")
                  await tonConnectUI.disconnect();
              }
            // console.log("Disconnect for connection reload")
            // await tonConnectUI.disconnect();
          }catch(e){console.error(e) ;}      

          try{
          await tonConnectUI.openModal();
  
          tonConnectUI.onStatusChange(
              walletAndwalletInfo => {
                  console.log("change : ", walletAndwalletInfo)
                  account = walletAndwalletInfo;
              }
          );
      }catch(e){console.error(e) ;}      
}
async function ton_connect_init(type) {

  if(!tonConnectUI)
  {
    tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: ton_manifest,
      uiPreferences: {
        theme: TON_CONNECT_UI.THEME.DARK,
    },
    });
  }else{
    var state = tonConnectUI.modalState
    if(state && (state.status != 'closed' || state.closeReason == 'wallet-selected'))
    {
        await tonConnectUI.disconnect();
    }
    
    await tonConnectUI.openModal();
  }
    tonConnectUI.onStatusChange(
        walletAndwalletInfo => {
            console.log("change : ",walletAndwalletInfo)
            account = walletAndwalletInfo
            switch(type)
            {
              case 0 :
                ton_connect_wallet_sign() 
                break;
              default:
                break;
            }
        } 
    );

    
}

async function ton_connect_wallet_sign()
{
  const state = tonConnectUI.modalState
  if(state && state.closeReason && state.closeReason == 'wallet-selected' )
  {
    await authToken();
    console.log("account ",account.account.address)
    console.log(
      (new TonWeb.utils.Address(account.account.address)).toString(true,true,false)
    )
    //TODO , sign the data to proof ownership 
    await api_connection_ton({
      type: true,
      publicKey: account.account.address
  })
  }else{
    console.log('try open again')
    await tonConnectUI.openModal();
  }
}

async function ton_pay_invoice() {
  try{
    var i = await get_invoice_details();
    if(i)
    {
      await ton_connect_ui_connect(`${siteBaseUrl}/page-payment-ton-confirm?i=${i.id}`)
    }
    
  }catch(e)
  {
    // window.alert(e)
  }


}

async function ton_pay_invoice_confirm() {
  const state = tonConnectUI.modalState
  if(state && state.closeReason && state.closeReason == 'wallet-selected' && invoice )
  {
    console.log(state,account)
    console.log(invoice)
    var transaction = false;

    //Make payment support for different tokens :
    //0 : TON 
    //1 : USDT
    if(invoice.type == 0 && invoice.token ==0 )
    {
          //Check the account balance . require balance >= (1+routerFeeRate)*amount
    if(account && account.address)
    {
      const bal = (await api_balance_ton(account.address)).balance
      if(bal <= (1+Number(invoice.routerFeeRate))*invoice.amount)
      {
        //Balance failed . 
        window.alert("🚧 Please confirm you have enough balance to pay this invoice 🚧");
        close_window_webapp();
      }
    }
    let a = new TonWeb.boc.Cell();
    a.bits.writeUint(0, 32);
    a.bits.writeString(invoice.id);
    let payload = TonWeb.utils.bytesToBase64(await a.toBoc());

    console.log(payload)

    transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 6000, // 6000 sec
      messages: [
          {
              address: invoice.address,
              amount: invoice.amount,
          },
          {
              address: invoice.routerAddress,
              amount: (invoice.amount*Number(invoice.routerFeeRate)).toFixed(0),
              payload: payload
          }
      ]
    }

    }else if(invoice.type == 0 && invoice.token !=0 && account && account.account.address)
    {
      //USDT payment
      console.log("🚧 Jetton payment")
      // if(account && account.address)
      // {
      //   const bal = (await api_balance_ton(account.address)).balance
      //   if(bal <= (1+Number(invoice.routerFeeRate))*invoice.amount)
      //   {
      //     //Balance failed . 
      //     window.alert("🚧 Please confirm you have enough balance to pay this invoice 🚧");
      //     close_window_webapp();
      //   }
      // }
      const tonweb = new TonWeb();
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {address: invoice.tokenAddress});
      console.log(jettonMinter);
      const jettonMinterAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(account.account.address));
      console.log(jettonMinterAddress.toString(true))
      const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
        address: jettonMinterAddress
      });
      const tonFee = '50000000'

      const seqno = Date.now()
      const jettonBody = {
        queryId: seqno,
        jettonAmount: invoice.amount,
        toAddress: new TonWeb.utils.Address(invoice.address),
        responseAddress: new TonWeb.utils.Address(account.account.address)
      }
      
      console.log('🚧 jettonWallet.createTransferBody',jettonBody)
      let payload = await jettonWallet.createTransferBody(jettonBody)
  
      console.log('🚧 payload :',payload)

      //Invoice payment
      let invoicePayload = new TonWeb.boc.Cell();
      invoicePayload.bits.writeUint(0, 32);
      invoicePayload.bits.writeString(invoice.id);


      transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 6000, // 6000 sec
        messages: [
            {
                address: jettonMinterAddress.toString(true),
                amount: tonFee,
                payload: TonWeb.utils.bytesToBase64(await payload.toBoc())
            },
            {
                address: invoice.routerAddress,
                amount: (Number(invoice.routerFee)).toFixed(0),
                payload:  TonWeb.utils.bytesToBase64(await invoicePayload.toBoc())
            }
        ]
      }
      console.log(transaction)
  
    }

  
  try {
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log("result : ",result)
      // you can use signed boc to find the transaction 

      if(invoice?.redirect)
      {
        router_to_outter_any(invoice.redirect)
      }
      close_window_webapp()
  } catch (e) {
      console.error(e);
      window.alert(e)
  }
  
  }else{
    console.log('try open again')
    // await tonConnectUI.closeModal();
    await tonConnectUI.openModal();
    // tonConnectUI = false
    // await ton_connect_ui_connect()
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