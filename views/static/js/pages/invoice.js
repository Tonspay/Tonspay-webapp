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
    }
}

async function invoice_payment_draw(id) {
    if (id) {
        const btn = document.getElementById('invoice_to_pay_buttom');
        btn.style.display = "inline"
    } else {

    }
}