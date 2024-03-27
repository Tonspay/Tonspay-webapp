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
         case 0:
             return Number((amount / Math.pow(10, 8)).toFixed(4)) + " TON"
             break;
         case 1:
             return Number((amount / Math.pow(10, 9)).toFixed(5)) + " SOL"
         case 2:
             return Number((amount / Math.pow(10, 18)).toFixed(6)) + " ETH"
             break;
         case 3:
             return Number((amount / Math.pow(10, 4)).toFixed(4)) + " $"
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
    var pm = [];
    switch (invoice.type) {
        case 0:
            //Ton , ton-connect
            if(isMobile())
            {
                location.href = `${payment_wallet_router_outter.ton}?i=${invoice.id}&t=${storage_get_authkey()}`
            }else{
                window.open(`${payment_wallet_router_outter.ton}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
            }
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
                            action:()=>{window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
                        }
                    )
                    pm.push(
                        {
                            name:"OKEX",
                            action:()=>{window.open(`${payment_wallet_router_outter.okex}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
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
                            
                            action:()=>{
                                const target = encodeURI(`${payment_router_redirect}${payment_wallet_router_inner.okex}/${storage_get_authkey()}/${invoice.id}`);
                                window.open(`https://www.okx.com/download?deeplink=okx://wallet/dapp/url?dappUrl=${target}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
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
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
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
                        action:()=>{window.open(`${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");}
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
            pm.push(
                {
                    name:"Binance",
                    action:()=>{location.href = `${payment_wallet_router_outter.binance}?i=${invoice.id}&t=${storage_get_authkey()}`}
                }
            )
            
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

 async function deeplink_invoice_call_up(invoice) {
     switch (invoice.type) {
         case 1:
             //SOLANA
             if (window.solana) {
                if(top.location == self.location)
                {
                    location.href = `${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`
                }else{
                    window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                }
                
             } else {
                if(isMobile())
                {
                    const target = encodeURI("https://wallet.tonspay.top/api/webapp_redirect_phantom/page-payment-phantom-confirm/" + storage_get_authkey() + "/" + invoice.id)
                    const ref = encodeURI("https://wallet.tonspay.top")
                    window.open(`https://phantom.app/ul/browse/${target}?ref=${ref}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                }else{
                    window.open(`${payment_wallet_router_outter.phantom}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                }
             }
             break;
         case 2:
             //EVM
             if (window.ethereum) {
                 location.href = `${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`
             } else {
                if(isMobile())
                {
                    window.open(`https://metamask.app.link/dapp/wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                }else{
                    window.open(`${payment_wallet_router_outter.metamask}?i=${invoice.id}&t=${storage_get_authkey()}`,"newwindow","height=800, width=400, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
                }
             }
         case 3:
            location.href = `${payment_wallet_router_outter.binance}?i=${invoice.id}&t=${storage_get_authkey()}`
         default:
             break;
     }
 }

 function isMobile() {
    let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag;
}
