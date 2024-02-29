var invoice_to_pay;

async function invoice_page_init() {
    console.log("🔥 Invoices init");
    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get('id');
    if (invoiceId) {
        //Invoice exsit , get rady to pay
        console.log(invoiceId)
        invoice_payment_draw(invoiceId)
            //Verfy if invoice exsit
    } else {
        //Invoices not exsit , show all history invoies
        const invoies = await api_info_invoice()
        console.log('no invoicesid : ', invoies)

        const f = document.getElementById("invoice_disply_frame");
        var pending = document.getElementById("pending_invoice_template");

        console.log(f, pending)
        for (var i = 0; i < 5; i++) {

            const c = pending.cloneNode(true)
            c.style.display = "inline"
            f.appendChild(c)
        }

    }
}

async function invoice_payment_draw(id) {
    if (id) {
        const btn = document.getElementById('invoice_to_pay_buttom');
        btn.style.display = "inline"
    } else {

    }
}