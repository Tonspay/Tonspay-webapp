function router_to_index() {
    location.href = "./index"
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

function router_to_inner_any(url) {
    location.href = "./" + url
}

function router_to_outter_any(url) {
    location.href = url
}