var invoice_to_pay;

async function invoice_page_init() {
    console.log("🔥 Invoices init");
    if(Telegram&&Telegram.WebApp)
    {
        Telegram.WebApp.expand();
    }
    
    const params = new URLSearchParams(window.location.search);

    const type = new URLSearchParams(location.search).get("type")
    if(type && type == "offlineInvoice")
    {
        var invoiceId = params.get('id');
        const invoiceTg = (new URLSearchParams(window.location.search)).get('tgWebAppStartParam');
        // window.alert(invoiceTg)
        if(!invoiceId)
        {
            invoiceId = invoiceTg;
        }
        if (invoiceId) {
            console.log(invoiceId)
        }

    }else
    {
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
            // window.alert(invoiceId)
            //Verfy if invoice exsit
            const invoiceData = await api_info_invoice(invoiceId);
            console.log(invoiceData)
            if (invoiceData && invoiceData.code == 200) {
                return invoice_payment_draw(invoiceId, invoiceData.data)
            }
            return await invoice_list_draw()
        } else {
            //Invoices not exsit , show all history invoies
            await authToken()
            return await invoice_list_draw()
        }
    }

}

async function invoice_list_draw() {
    const invoies = await api_info_invoices()
    console.log('no invoicesid : ', invoies)
    if (invoies) {
        const own_invoices = invoies.data.own;
        const paied_invoices = invoies.data.pay;
        const f = document.getElementById("invoice_disply_frame");

        if (own_invoices) {
            own_invoices.forEach(ele => {
                var newnode ;
                if(ele.status == 0 )
                {
                    if(Date.now() > ele.expiredTime)
                    {
                        newnode = invoice_expired_draw(
                            ele.comment,
                            ele.createTime,
                            amount_to_display(ele.type, ele.amount),
                            ele.id
                        )
                    }else{
                        newnode = invoice_pending_draw(
                            ele.comment,
                            ele.createTime,
                            amount_to_display(ele.type, ele.amount),
                            ele.id
                        )
                    }

                }else if(ele.status == 1)
                {
                    newnode = invoice_paid_draw(
                        ele.comment,
                        ele.createTime,
                        amount_to_display(ele.type, ele.amount),
                        ele.id
                    )
                }else{
                    return 0 ;
                }
                f.appendChild(
                    newnode
                )
            });
        }

        if (!own_invoices && !paied_invoices) {
            f.appendChild(
                no_invoice_pending_draw()
            )
        }

    }
}

function invoice_pending_draw(name, time, amount, id) {
    const c = document.getElementById("pending_invoice_template").cloneNode(true);
    c.id = "invoice_" + id;
    c.style.display = "inline"
    c.onclick = function(){window.location = `${siteBaseUrl}/page-invoices?id=${id}`} 
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];

    // console.log(c.childNodes[1].href = "${siteBaseUrl}/page-invoices?id=" + id)
    invoice_name.innerText = name
    invoice_time.innerText = ((new Date(time)).toUTCString())
    invoice_amount.innerText = amount

    return c
}

function no_invoice_pending_draw() {
    const c = document.getElementById("pending_invoice_template").cloneNode(true);
    c.id = "invoice_none";
    c.style.display = "inline"
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];
    const invoice_status = c.childNodes[1].childNodes[3].childNodes[3];
    invoice_name.innerText = `No invoices ...`
    invoice_time.innerText = ``
    invoice_amount.innerText = ``
    invoice_status.innerText = ``
    return c
}

function invoice_paid_draw(name, time, amount, id) {
    const c = document.getElementById("paid_invoice_template").cloneNode(true);
    c.id = "invoice_" + id;
    c.style.display = "inline"
    c.onclick = function(){window.location = `${siteBaseUrl}/page-invoices?id=${id}`} 
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];
    invoice_name.innerText = name
    invoice_time.innerText = ((new Date(time)).toUTCString())
    invoice_amount.innerText = amount

    return c
}

function invoice_expired_draw(name, time, amount, id) {
    const c = document.getElementById("expired_invoice_template").cloneNode(true);
    c.id = "invoice_" + id;
    c.style.display = "inline"
    c.onclick = function(){window.location = `${siteBaseUrl}/page-invoices?id=${id}`} 
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];
    invoice_name.innerText = name
    invoice_time.innerText = ((new Date(time)).toUTCString())
    invoice_amount.innerText = amount

    return c
}

async function invoice_payment_draw(id, invoiceData) {
    if (id) {
        //Display major & button
        const f = document.getElementById("invoice_disply_frame");
        //Display panel
        const invoice_to_pay_panel_comment = document.getElementById("invoice_to_pay_panel_comment");
        const invoice_to_pay_panel_time = document.getElementById("invoice_to_pay_panel_time");
        const invoice_to_pay_panel_id = document.getElementById("invoice_to_pay_panel_id");
        const invoice_to_pay_amount = document.getElementById("invoice_to_pay_amount");

        invoice_to_pay_panel_comment.innerText = invoiceData.comment
        invoice_to_pay_panel_time.innerText = ((new Date(invoiceData.createTime)).toUTCString())
        invoice_to_pay_panel_id.innerText = id
        invoice_to_pay_amount.innerText = amount_to_display(invoiceData.type, invoiceData.amount)

        const invoice_to_pay_confirm = document.getElementById("invoice_to_pay_confirm");
        const invoice_to_pay_cancle = document.getElementById("invoice_to_pay_cancle");
        const invoice_to_pay_share = document.getElementById("invoice_to_pay_share");

        //switch inovce status
        const invoice_status = document.getElementById("invoice_to_pay_status")
        if(invoiceData.status ==0 )
        {
            if(Date.now() > invoiceData.expiredTime)
            {
                //Time out 
                f.appendChild(invoice_expired_draw(invoiceData.comment, invoiceData.createTime, amount_to_display(invoiceData.type, invoiceData.amount), id))
                document.getElementById("panel_status_experid_template").style.display =  "inline";
                document.getElementById('invoice_pending_pay_with').style.display="none"

            }else{
                f.appendChild(invoice_pending_draw(invoiceData.comment, invoiceData.createTime, amount_to_display(invoiceData.type, invoiceData.amount), id))
                const btn = document.getElementById('invoice_to_pay_buttom');
                btn.style.display = "inline"
                
                document.getElementById("panel_status_pending_template").style.display =  "inline";

                await deeplink_invoice_paymenthod_select(invoiceData)
                invoice_to_pay_cancle.onclick = function() {
                    invoice_to_pay_cancle_button(id)
                };

                invoice_to_pay_share.onclick = function() {
                    invoice_to_pay_share_button(id)
                };
            }

        }else if(invoiceData.status == 1){
            f.appendChild(invoice_paid_draw(invoiceData.comment, invoiceData.createTime, amount_to_display(invoiceData.type, invoiceData.amount), id))

            const btn = document.getElementById('invoice_paid_buttom');
            btn.style.display = "inline"
            
            document.getElementById("panel_status_paid_template").style.display =  "inline";
            document.getElementById('invoice_pending_pay_with').style.display="none"
            
        }


    } else {

    }
}

async function invoice_to_pay_confirm_button(id) {
    console.log("invoice_to_pay_confirm_button", id)
}
async function invoice_to_pay_cancle_button(id) {
    console.log("invoice_to_pay_cancle_button", id)
    router_to_index()
}
async function invoice_to_pay_share_button(id) {
    console.log("invoice_to_pay_share_button", id)
    const redir = botWebappInvoiceBaseUrl+"?startapp="+id
    router_to_share(redir , `💐 Please help me to pay this invoice 💐 \n Thanks ! `)
}