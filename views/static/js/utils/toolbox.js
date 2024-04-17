 // Type of payment : 0:TON | 1:LN | 2:TRON | 3:ETH | 4:POLYGON | 5:ARB | 6:BSC | 7:SOLANA
 /**
  * Decimals : 
  * 
  * TON : 8
  * LN  : 6
  * TRON : 6
  * ETH  : 18
  * POLYGON : 18
  * ARB : 18
  * BSC : 18
  * SOLANA : 9
  * Binance : 4
  */

/**
 * Contract data 
 */

const erc20ABI = [
    {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
    {
    "name": "",
    "type": "string"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
    {
    "name": "_spender",
    "type": "address"
    },
    {
    "name": "_value",
    "type": "uint256"
    }
    ],
    "name": "approve",
    "outputs": [
    {
    "name": "",
    "type": "bool"
    }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
    {
    "name": "",
    "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
    {
    "name": "_from",
    "type": "address"
    },
    {
    "name": "_to",
    "type": "address"
    },
    {
    "name": "_value",
    "type": "uint256"
    }
    ],
    "name": "transferFrom",
    "outputs": [
    {
    "name": "",
    "type": "bool"
    }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
    {
    "name": "",
    "type": "uint8"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [
    {
    "name": "_owner",
    "type": "address"
    }
    ],
    "name": "balanceOf",
    "outputs": [
    {
    "name": "balance",
    "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
    {
    "name": "",
    "type": "string"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "constant": false,
    "inputs": [
    {
    "name": "_to",
    "type": "address"
    },
    {
    "name": "_value",
    "type": "uint256"
    }
    ],
    "name": "transfer",
    "outputs": [
    {
    "name": "",
    "type": "bool"
    }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "constant": true,
    "inputs": [
    {
    "name": "_owner",
    "type": "address"
    },
    {
    "name": "_spender",
    "type": "address"
    }
    ],
    "name": "allowance",
    "outputs": [
    {
    "name": "",
    "type": "uint256"
    }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
    },
    {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "name": "owner",
    "type": "address"
    },
    {
    "indexed": true,
    "name": "spender",
    "type": "address"
    },
    {
    "indexed": false,
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "Approval",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "name": "from",
    "type": "address"
    },
    {
    "indexed": true,
    "name": "to",
    "type": "address"
    },
    {
    "indexed": false,
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "Transfer",
    "type": "event"
    }
    ]

 const payment_base_url = "https://wallet.tonspay.top/";
 const payment_wallet_router_inner = {
    phantom : `page-payment-phantom-confirm`,
    okex : `page-payment-okex-confirm`,
    metamask : `page-payment-metamask-confirm`,
    binance : `page-payment-binance-confirm`,
    ton : `page-payment-ton-confirm`
 }
 const payment_wallet_router_outter = {
    phantom : payment_base_url+payment_wallet_router_inner.phantom,
    okex : payment_base_url+payment_wallet_router_inner.okex,
    metamask : payment_base_url+payment_wallet_router_inner.metamask,
    binance : payment_base_url+payment_wallet_router_inner.binance,
    ton : payment_base_url+payment_wallet_router_inner.ton,
 }
 const payment_router_redirect = `https://wallet.tonspay.top/api/webapp_redirect_phantom/`


 function amount_to_display(type, amount) {
     switch (type) {
         case 0 : case "ton":
             return Number((amount / Math.pow(10, 9)).toFixed(4)) + " TON"
             break;
         case 1 : case "phantom":
             return Number((amount / Math.pow(10, 9)).toFixed(5)) + " SOL"
         case 2 : case "metamask":
             return Number((Number(amount) / Math.pow(10, 18)).toFixed(6)) + " ETH"
             break;
         case 3:
             return Number((amount / Math.pow(10, 4)).toFixed(4)) + " $"
             break;
         case 4 : 
            return Number((amount / Math.pow(10, 9)).toFixed(6)) + " TRX"
            break;
        case 5 : 
            return Number((amount / Math.pow(10, 18)).toFixed(6)) + " BNB"
            break;
         default:
             return false;
             break;
     }
 }

 async function amount_to_display_token(chain,token,amount)
 {
    switch (chain) {
        case 2 : case "bsc":
            var d = 0;
            var s = 0;
            if(token=='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            {
                d = Number(bsc.nativeCurrency.decimals)
                s = bsc.nativeCurrency.symbol
            }else{
                d = Number(await tokenDecimals(chain,token))
                s = await tokenSymbol(chain,token)
            }
            return Number((amount / Math.pow(10, d)).toFixed(4)) + " "+s
            break;
        case 9 : case "eth":
            var d = 0;
            var s = 0;
            if(token=='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            {
                d = Number(eth.nativeCurrency.decimals)
                s = eth.nativeCurrency.symbol
            }else{
                d = Number(await tokenDecimals(chain,token))
                s = await tokenSymbol(chain,token)
            }
            return Number((amount / Math.pow(10, d)).toFixed(4)) + " "+s
            break;
        default:
            return false;
            break;
    }
 }

 function amount_to_display_usd(type, amount) {

 }

 async function deeplink_invoice_paymenthod_select(invoice)
 {
    Telegram.WebApp.ready();
    var pm = [];
    switch (invoice.type) {
        case 0:
            //Ton , ton-connect
            if(isMobile())
            {
                pm.push(
                    {
                        name:"TON",
                        action:()=>{location.href = `${payment_wallet_router_outter.ton}?i=${invoice.id}&t=${storage_get_authkey()}` ;}
                    }
                )
                
            }else{
                pm.push(
                    {
                        name:"TON",
                        action:()=>{location.href = `${payment_wallet_router_outter.ton}?i=${invoice.id}&t=${storage_get_authkey()}` ;}
                        // action:()=>{window.open(`${payment_wallet_router_outter.ton}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no"); Telegram.WebApp.close();}
                    }
                )
                
            }
            break;
        case 1:
            //SOLANA :: PHANTOM / OKEX
            if (window.solana) {
                if(top.location == self.location)
                {
                    pm.push(
                        {
                            name:"Phantom",
                            action:()=>{window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                        }
                    )
                    pm.push(
                        {
                            name:"OKEX",
                            action:()=>{window.open(`${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                        }
                    )
                }else{

                    pm.push(
                        {
                            name:"Phantom",
                            action:()=>{window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                        }
                    )
                    pm.push(
                        {
                            name:"OKEX",
                            action:()=>{window.open(`${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                        }
                    )
                    
                }
                
             } else {
                if(isMobile())
                {
                    pm.push(
                        {
                            name:"Phantom",
                            action:()=>{
                                const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.phantom}/${storage_get_authkey()}/${invoice.id}`)
                                const ref = encodeURI(payment_base_url)
                                window.open(`https://phantom.app/ul/browse/${target}?ref=${ref}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                            }
                        }
                    )
                    pm.push(
                        {
                            name:"OKEX",
                            action:()=>{
                                const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.okex}/${storage_get_authkey()}/${invoice.id}`)
                                window.open(`https://www.okx.com/download?deeplink=okx://wallet/dapp/url?dappUrl=${target}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                            }
                        }
                    )
                }else{
                    pm.push(
                        {
                            name:"Phantom",
                            action:()=>{window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                        }
                    )
                    pm.push(
                        {
                            name:"OKEX",
                            action:()=>{window.open(`${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                        }
                    )
                }
             }
            break;
        case 2:
            if (window.ethereum) {
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{location.href = `${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`}
                    }
                )
                
            } else {
               if(isMobile())
               {
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`https://metamask.app.link/dapp/wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{ 
                            const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.okex}/${storage_get_authkey()}/${invoice.id}`);
                            window.open(`https://www.okx.com/download?deeplink=okx://wallet/dapp/url?dappUrl=${target}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                    }
                )
                   
               }else{
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{location.href = `${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`}
                    }
                )
               }
            }
            break;
        case 3:
            if(isMobile())
            {
                pm.push(
                    {
                        name:"Binance",
                        action:()=>{location.href = `${payment_wallet_router_outter.binance}?i=${invoice.id}&t=${storage_get_authkey()}`}
                    }
                )
            }else{
                pm.push(
                    {
                        name:"Binance",
                        action:()=>{window.open(`${payment_wallet_router_outter.binance}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                    }
                )
            }
            break;
        case 4:
            if(isMobile())
            {
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{location.href = `{payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`}
                    }
                )
            }else{
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{
                            const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.okex}/${storage_get_authkey()}/${invoice.id}`);
                            window.open(`https://www.okx.com/download?deeplink=okx://wallet/dapp/url?dappUrl=${target}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                    }
                )
            }
        default:
            break;
    }
    console.log("🐞 pm : ",pm)
    const f = document.getElementById("payment_method_box")
    pm.forEach(ele => {
        const seed =  (document.getElementById("payment_method_way_confirm")).cloneNode(true);
        seed.innerText = ele.name;
        seed.id = ele.name+`_way_confirm`
        const seedF = (document.getElementById("payment_method_way")).cloneNode(true);
        seedF.appendChild(seed)
        seedF.onclick = function() {
            ele.action();
        };
        seedF.id = ele.name+`_way`
        f.appendChild(seedF)
        console.log(seedF)
    });
    (document.getElementById("payment_method_way_confirm")).style.display ='none';
    (document.getElementById("payment_method_way")).style.display ='none'
 }

 async function deeplink_bridge_paymenthod_select(type,url)
 {
    Telegram.WebApp.ready();
    var pm = [];
    switch (type) {
        case 'bsc':  case 'eth':
            if (window.ethereum) {
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?type=bridge&i=${url}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{location.href = `${payment_wallet_router_outter.okex}?type=bridge&i=${url}&t=${storage_get_authkey()}`}
                    }
                )
                
            } else {
               if(isMobile())
               {
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`https://metamask.app.link/dapp/wallet.tonspay.top/page-payment-metamask-confirm?type=bridge&i=${url}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{ 
                            const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.okex}/${storage_get_authkey()}&type=bridge/${url}`);
                            window.open(`https://www.okx.com/download?deeplink=okx://wallet/dapp/url?dappUrl=${target}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                    }
                )
                   
               }else{
                pm.push(
                    {
                        name:"Metamask",
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?type=bridge&i=${url}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");Telegram.WebApp.close();}
                    }
                )
                pm.push(
                    {
                        name:"OKEX",
                        action:()=>{location.href = `${payment_wallet_router_outter.okex}?type=bridge&i=${url}&t=${storage_get_authkey()}`}
                    }
                )
               }
            }
            break;
        default:
            break;
    }
    console.log("🐞 pm : ",pm)
    const f = document.getElementById("payment_method_box")
    pm.forEach(ele => {
        const seed =  (document.getElementById("payment_method_way_confirm")).cloneNode(true);
        seed.innerText = ele.name;
        seed.id = ele.name+`_way_confirm`
        const seedF = (document.getElementById("payment_method_way")).cloneNode(true);
        seedF.appendChild(seed)
        seedF.onclick = function() {
            ele.action();
        };
        seedF.id = ele.name+`_way`
        f.appendChild(seedF)
        console.log(seedF)
    });
    (document.getElementById("payment_method_way_confirm")).style.display ='none';
    (document.getElementById("payment_method_way")).style.display ='none'
 }
 function isMobile() {
    let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
}

/**
 * Web3 evm contract part 
 */


async function getWeb3(chain)
{
    const eth_chain = {
        chainId: ethers.utils.hexlify(1),
        chainName: "ETH",
        rpcUrls: ["https://rpc.ankr.com/eth"],
      }
    const bsc_chain = {
        chainId: ethers.utils.hexlify(56),
        chainName: "BNB",
        rpcUrls: ["https://1rpc.io/bnb"],
      }
      
  switch(chain)
  {
    case "bsc":
      return new Web3(bsc_chain.rpcUrls[0])
      break;
    case "eth":
      return new Web3(eth_chain.rpcUrls[0])
      break;
    default:
      break;
  }
}

async function tokenSymbol(chain,address)
{
  const web3 = await getWeb3(chain)
  var contract  = new web3.eth.Contract(erc20ABI,address);
  return await contract.methods['symbol']().call()
  .then(function(result){ 
      return result
  });
}

async function tokenDecimals(chain,address)
{
    const web3 = await getWeb3(chain)
  var contract  = new web3.eth.Contract(erc20ABI,address);
  return await contract.methods['decimals']().call()
  .then(function(result){ 
      return result
  });
}