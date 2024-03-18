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
  */

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
         default:
             return false;
             break;
     }
 }

 function amount_to_display_usd(type, amount) {

 }

 async function deeplink_invoice_call_up(invoice) {
     switch (invoice.type) {
         case 1:
             //SOLANA
             if (window.solana) {
                if(top.location == self.location)
                {
                    location.href = `https://wallet.tonspay.top/page-payment-phantom-confirm?i=${invoice.id}&t=${storage_get_authkey()}`
                }else{
                    window.open(`https://wallet.tonspay.top/page-payment-phantom-confirm?i=${invoice.id}&t=${storage_get_authkey()}`, "_blank");
                }
                
             } else {
                 const target = encodeURI("https://wallet.tonspay.top/api/webapp_redirect_phantom/page-payment-phantom-confirm/" + storage_get_authkey() + "/" + invoice.id)
                 const ref = encodeURI("https://wallet.tonspay.top")
                 window.open(`https://phantom.app/ul/browse/${target}?ref=${ref}`, "_blank");
             }
             break;
         case 2:
             //EVM
             if (window.ethereum) {
                 location.href = `https://wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`
             } else {
                 location.href =  `https://metamask.app.link/dapp/wallet.tonspay.top/page-payment-metamask-confirm?i=${invoice.id}&t=${storage_get_authkey()}`
             }

         default:
             break;
     }
 }