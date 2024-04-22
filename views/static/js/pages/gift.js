var gift;
var tonwebInstance;
const tonscan_url = `https://tonscan.org/`
const gift_web_base_url = `${siteBaseUrl}/gift/`
const gift_webapp_base_url = `https://t.me/Tonsgift_bot/`;
const gift_webapp_router = {
    ton : gift_webapp_base_url+"ton"
}
async function gift_page_init() {
    console.log("🔥 Cash gift init");
    
    const params = new URLSearchParams(window.location.search);

    var id = params.get('id');
    const idTg = (new URLSearchParams(window.location.search)).get('tgWebAppStartParam');
    // window.alert(giftTg)
    if(!id)
    {
        id = idTg;
    }

    const type = new URLSearchParams(location.search).get("type")
    if(type && type == "short")
    {


    }else
    {
        if (id) {
            try{
                gift = JSON.parse(
                    Buffer.from(base58.decode(id)).toString()
                )
                gift.raw = id;
                gift.s = new Uint8Array(base58.decode(gift.s))
                gift.kp = window.nacl.sign.keyPair.fromSecretKey(gift.s)
                tonwebInstance = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '81c61ba24076e77e32fd7a39fdaaf849653184ee0614ab74bc14249318e09045'}));
                // const pk = Buffer.from(gift.kp.publicKey).toString('hex');
                // console.log(pk)
                const wallet = tonwebInstance.wallet.create({publicKey:gift.kp.publicKey});
                
                
                const walletAddress = (await wallet.getAddress()).toString(true, true, false);
                gift.address = walletAddress;
                if(gift.c && gift.c.length > 2)
                {
                    var raw = gift.c.split("_");
                    if(raw.length>1)
                    {
                        gift.short = raw[0]
                        gift.c = Buffer.from(raw[1],'base64').toString('utf-8')
                    }
                    // gift.c = Buffer.from(gift.c,'base64').toString('utf-8')
                }
                const balance = await tonwebInstance.getBalance(gift.address)
                gift.bal = balance
                gift.createTime =Date.now()

                gift.type = 0 //TON
                console.log(gift)
                await gitf_payment_draw(1,gift)

            }catch(e){console.error(e) ; window.alert(e)}
        }else{
            const raw = gift_generate_ton(0,'TON gift !')
            location.href = gift_web_base_url+'ton'+"?id="+raw;
        }
    }

}

function gift_generate_ton(type,msg)
{
    const kp = window.nacl.sign.keyPair()
    var skArr = Array.from(kp.secretKey);
    const sk = base58.encode(skArr);
    const body = {
        "t": type,
        "s": sk,
        "c": "0_"+Buffer.from(msg).toString("base64"),
    }
    console.log(body)
    return base58.encode(
        Array.from(Buffer.from(JSON.stringify(body)))
    )
}


function gift_pending_draw(name, time, amount, id) {
    const c = document.getElementById("pending_gift_template").cloneNode(true);
    c.id = "gift_" + id;
    c.style.display = "inline"
    const gift_name = c.childNodes[1].childNodes[1].childNodes[1];
    const gift_time = c.childNodes[1].childNodes[1].childNodes[3];
    const gift_amount = c.childNodes[1].childNodes[3].childNodes[1];

    // console.log(c.childNodes[1].href = "${siteBaseUrl}/page-gifts?id=" + id)
    gift_name.innerText = name
    gift_time.innerText = ((new Date(time)).toUTCString())
    gift_amount.innerText = amount

    return c
}

async function gitf_payment_draw(id, giftData) {
    if (id) {
        //Display major & button
        const f = document.getElementById("gift_disply_frame");
        f.appendChild(gift_pending_draw(giftData.c, giftData.createTime, amount_to_display(giftData.type, giftData.bal), id))
        const btn = document.getElementById('gift_to_pay_buttom');
        // const share = document.getElementById('gift_to_share_button');
        btn.style.display = "inline"
        // share.style.display = "inline"
            //Display panel
        const gift_to_pay_panel_comment = document.getElementById("gift_to_pay_panel_comment");
        const gift_to_pay_panel_time = document.getElementById("gift_to_pay_panel_time");
        const gift_to_pay_panel_id = document.getElementById("gift_to_pay_panel_id");
        const gift_to_pay_amount = document.getElementById("gift_to_pay_amount");

        gift_to_pay_panel_comment.innerText = giftData.c
        gift_to_pay_panel_time.innerText = ((new Date(giftData.createTime)).toUTCString())
        gift_to_pay_panel_id.innerText = id
        gift_to_pay_amount.innerText = amount_to_display(giftData.type, giftData.bal)

        const gift_to_pay_confirm = document.getElementById("gift_to_pay_confirm");


    } else {

    }
}


async function gift_take()
{
    try{


    const minitGas = (0.005 * Math.pow(10,9))
    var state = ton_connect_status_check();
    console.log(state)
    if(state)
    {
        console.log('continue',account)
        if(gift.bal >minitGas)
        {
            //Transfer to account ; 
            const wallet = tonwebInstance.wallet.create({publicKey:gift.kp.publicKey});
            var seqno = await wallet.methods.seqno().call(); 
            if(!seqno){
                seqno= 0;
            }
            console.log(
                gift.kp.secretKey,
                (new TonWeb.utils.Address(account.account.address)).toString(true,true,false),
                gift.bal-minitGas,
                seqno,
                3,
            )
            const transfer = wallet.methods.transfer({
                secretKey: gift.kp.secretKey,
                toAddress:  (new TonWeb.utils.Address(account.account.address)).toString(true,true,false),
                amount: gift.bal-minitGas,
                seqno: seqno,
                sendMode: 3,
            });
            const send = await transfer.send();  // send transfer query to blockchain
            console.log(send)
            const transferQuery = await transfer.getQuery(); // get transfer query Cell
            console.log(transferQuery)
            window.alert("🍬 Take success, wait for 3~5 min ! 💐")
            Telegram.WebApp.close()
        }else
        {
            window.alert("💐 Noting to take .")
        }
    }else{
        await ton_connect_ui_connect()
    }
}catch(e)
{
    window.alert("🚧 ERROR :: ",e)
}
}

async function gift_deposit()
{
    var state = ton_connect_status_check();
    console.log(state)
    if(state)
    {
        const amount = (Number(document.getElementById('deposit_amount').value)*Math.pow(10,9)).toFixed(0)
        // window.alert(amount)
        if(amount>0)
        {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
                messages: [
                    {
                        address: gift.address,
                        amount: amount,
                    }
                ]
            }
            try {
                const result = await tonConnectUI.sendTransaction(transaction);
                console.log("result : ",result)
                await gift_share()
                // you can use signed boc to find the transaction 
            } catch (e) {
                console.error(e);
            }
        }
    }else{
        await ton_connect_ui_connect()
    }
}

async function gift_share()
{
    const redir = gift_webapp_router.ton+"?startapp="+gift.raw
    location.href = encodeURI(`https://t.me/share/url?url=${redir}&text= \n 🍬 Gift comment : 🍬 \n ${gift.c}`)
}

async function gift_view()
{
    const url = `${tonscan_url}address/${gift.address}`
    window.open(url,"newwindow");
}