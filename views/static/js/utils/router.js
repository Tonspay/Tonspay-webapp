const siteBaseUrl = 'https://test.tonspay.top'
const botBaseUrl = 'https://t.me/tonspaydev_bot'
const botWebappBaseUrl = `${botBaseUrl}/wallet`
const botWebappInvoiceBaseUrl = `${botBaseUrl}/wallet`
const botShareBaseUrl = `https://t.me/share/url?url=`

function router_to_index() {
    location.href = "./"
}

function router_to_invoice() {
    location.href = "./page-invoices"
}

function router_to_payment() {
    location.href = "./page-payments"
}


function router_to_wallet() {
    location.href = "./page-wallet"
}

function router_to_404() {
    location.href = "./404"
}

function router_to_dev() {
    location.href = "./deving"
}

function router_to_webapp_index() {
    location.href = botWebappBaseUrl
}

function router_to_inner_any(url) {
    location.href = "./" + url
}

function router_to_outter_any(url) {
    location.href = url
}

function router_to_bot() {
    location.href = botBaseUrl
}

function router_to_share(path,message)
{
    location.href = encodeURI(`${botShareBaseUrl}${path}&text=${message}`)
}