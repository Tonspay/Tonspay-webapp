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
  * SOLANA : 8
  */

 function amount_to_display(type, amount) {
     switch (type) {
         case 0:
             return Number((amount / Math.pow(10, 8)).toFixed(4)) + " TON"
             break;
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