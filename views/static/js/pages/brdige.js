var invoice_to_pay;
var raw;
async function bridge_page_init() {
    console.log("🔥 Bridge init");
    
    const params = new URLSearchParams(window.location.search);
    var invoiceId = params.get('id');
    const invoiceTg = (new URLSearchParams(window.location.search)).get('tgWebAppStartParam');
    // window.alert(invoiceTg)
    if(!invoiceId)
    {
        invoiceId = invoiceTg;
    }
    if (invoiceId) {
        //Invoice exsit , get rady to pay
        console.log(invoiceId)
        raw = invoiceId
        try{
            const data = JSON.parse(
                Buffer.from(invoiceId,'hex').toString()
            )
            invoice_to_pay = data
            console.log(data)
            
            await bridge_evm_ton_preload(data);
            await bridge_payment_draw(1, bridge_invoice)
            
        }catch(e){console.error(e)}
        
    } else {
        //Invoices not exsit , show all history invoies
        router_to_index()
    }
}




function bridge_pending_draw(name, time, amount, id) {
    const c = document.getElementById("pending_invoice_template").cloneNode(true);
    c.id = "invoice_" + id;
    c.style.display = "inline"
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];

    // console.log(c.childNodes[1].href = "https://wallet.tonspay.top/page-invoices?id=" + id)
    invoice_name.innerText = name
    invoice_time.innerText = ((new Date(time)).toUTCString())
    invoice_amount.innerText = amount

    return c
}

async function bridge_payment_draw(id, invoiceData) {
    if (id) {
        const display_amount = await amount_to_display_token(invoiceData.f.c,invoiceData.f.t ,invoiceData.f.a)

        //Display major & button
        const f = document.getElementById("invoice_disply_frame");
        
        f.appendChild(bridge_pending_draw(`Bridge ${invoiceData.f.c} to ${invoiceData.t.c}` , Date.now() ,display_amount,id ))
        const btn = document.getElementById('invoice_to_pay_buttom');
        btn.style.display = "inline"
        const invoice_to_pay_panel_comment = document.getElementById("invoice_to_pay_panel_comment");
        const invoice_to_pay_panel_time = document.getElementById("invoice_to_pay_panel_time");
        const invoice_to_pay_panel_id = document.getElementById("invoice_to_pay_panel_id");
        const invoice_to_pay_amount = document.getElementById("invoice_to_pay_amount");

        invoice_to_pay_panel_comment.innerText = `Bridge ${invoiceData.f.c} to ${invoiceData.t.c}`
        invoice_to_pay_panel_time.innerText = ((new Date( Date.now())).toUTCString())
        invoice_to_pay_panel_id.innerText = id
        invoice_to_pay_amount.innerText = display_amount

        console.log("🐞 invoice_to_pay_amount.innerText",invoice_to_pay_amount.innerText )

        const invoice_to_pay_confirm = document.getElementById("invoice_to_pay_confirm");
        const invoice_to_pay_cancle = document.getElementById("invoice_to_pay_cancle");

        await deeplink_bridge_paymenthod_select(invoiceData.f.c ,raw )
        invoice_to_pay_cancle.onclick = function() {
            invoice_to_pay_cancle_button(id)
        };
    } else {

    }
}

async function bridge_to_pay_confirm_button(id) {
    console.log("bridge_to_pay_confirm_button", id)
}
async function bridge_to_pay_cancle_button(id) {
    console.log("bridge_to_pay_cancle_button", id)
    router_to_index()
}

/**
 * Evm bridge to TON
 * 
 * Steps : 
 * 0. Connect to target chain
 * 1. Approve target token for allowance to 1inch (If it is not mainnet-token)
 * 2. Api swap call , get call-data .
 * 3. Call 1inch swap for confirm the trade 
 * 4. Approve wton to bridge
 * 5. Burn wton token to bridge 
 * 
 */
const inchRouter = '0x1111111254fb6c44bac0bed2854e76f90643097d'
var bridge_invoice;
var Weth = ""
const miniAmount = Math.pow(10,10)
async function bridge_evm_ton_preload(info)
{
    //Check the chain
    bridge_invoice = info;
    switch(info.f.c)
    {
        case "bsc":
            Weth =  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
            await evm_check_chain(bsc);  
            bridge_invoice.f.chain = bsc;
            bridge_invoice.f.token = bridge_invoice.f.t;
            if(info.f.t=='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
            {
                // bridge_invoice.f.token = Weth
                bridge_invoice.f['tokenType'] = true;
            }
            bridge_invoice.t.token = bsc.wton;
        break;
        default : 
            
        break
    }
    
    
}

async function bridge_evm_ton()
{
    if(!bridge_invoice.f.tokenType)
    {
        //Approve
        const allowance = await evm_allowance_erc20(bridge_invoice.f.t,inchRouter)
        console.log(allowance)
        if(Number(allowance)<Number(bridge_invoice.f.a))
        {
            const approve = await evm_approve_erc20_allowance(bridge_invoice.f.t,inchRouter,bridge_invoice.f.a);
            console.log(approve)
        }
    }


    console.log(bridge_invoice)
    //Get swap bytes data;
    const swapData = await api_1inch_swap(
        bridge_invoice.f.chain.chainIdRaw,
        bridge_invoice.f.token,
        bridge_invoice.t.token,
        bridge_invoice.f.a,
        (await evm_get_account())[0],
        1
        )
    console.log(swapData);
    if(swapData.code==200 && swapData.data.tx)
    {
        if(Number(swapData.data.dstAmount)<=miniAmount)
        {
            window.alert("🐞 Must bridge more than 10 TON")
        }
        window.web3 = new Web3(window.ethereum);
        console.log("🐞SEND TX  :: ",swapData.data.tx)
        console.log(window.web3)
        await window.web3.eth.sendTransaction(swapData.data.tx)
    }else
    {
        //Reload the page
    }

    //Check TON balance and burn .
    if(bridge_invoice.t.token)
    {
        const balance = await evm_balance_erc20(bridge_invoice.t.token,(await evm_get_account())[0])
        if(balance > Number(swapData.data.dstAmount))
        {
            balance = swapData.data.dstAmount
        }
        console.log(balance)
        const targetAddress= {
            workchain:0,
            address_hash:Buffer.from(
                (new TonWeb.utils.Address(bridge_invoice.t.w)).hashPart
            )
        };
        console.log(targetAddress)
        const burn = await evm_burn_erc20(bridge_invoice.t.token,targetAddress,balance);
        console.log(burn)
        if(burn&&burn.transactionHash)
        {
            window.alert("🐞 Bridge success : "+burn.transactionHash);
            window.open(bridge_invoice.f.chain.blockExplorerUrls+"tx/"+burn.transactionHash)
        }
    }
    
}