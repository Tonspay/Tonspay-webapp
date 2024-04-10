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
            
            await bridge_payment_draw(1, invoice_to_pay)
            
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