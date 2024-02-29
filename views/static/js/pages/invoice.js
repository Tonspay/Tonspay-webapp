var invoice_to_pay;

async function invoice_page_init() {
    console.log("🔥 Invoices init");
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get('id');
    if (invoiceId) {
        //Invoice exsit , get rady to pay
        console.log(invoiceId)

        //Verfy if invoice exsit
        const invoiceData = await api_info_invoice(invoiceId);
        if (invoiceData && invoiceData.code == 200) {
            invoice_payment_draw(invoiceId)
        }
        return await invoice_list_draw()
    } else {
        //Invoices not exsit , show all history invoies
        return await invoice_list_draw()
    }
}

async function invoice_list_draw() {
    const invoies = await api_info_invoice()
    console.log('no invoicesid : ', invoies)
    if (invoies) {
        const own_invoices = invoies.data.own;
        const paied_invoices = invoies.data.pay;
        const f = document.getElementById("invoice_disply_frame");

        if (own_invoices) {
            own_invoices.forEach(ele => {
                const newnode = invoice_pending_draw(
                    ele.comment,
                    ele.createTime,
                    ele.amount,
                    ele.id
                )
                f.appendChild(
                    newnode
                )
            });
        }


    }
}

function invoice_pending_draw(name, time, amount, id) {
    const c = document.getElementById("pending_invoice_template").cloneNode(true);
    c.id = "invoice_" + id;
    c.style.display = "inline"
    const invoice_name = c.childNodes[1].childNodes[1].childNodes[1];
    const invoice_time = c.childNodes[1].childNodes[1].childNodes[3];
    const invoice_amount = c.childNodes[1].childNodes[3].childNodes[1];

    invoice_name.innerText = name
    invoice_time.innerText = ((new Date(time)).toUTCString())
    invoice_amount.innerText = amount

    return c
}

async function invoice_payment_draw(id) {
    if (id) {
        const btn = document.getElementById('invoice_to_pay_buttom');
        btn.style.display = "inline"
    } else {

    }
}