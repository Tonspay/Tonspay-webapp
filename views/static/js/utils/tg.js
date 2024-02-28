/**
 * This util are working for the actions open inside telegram . 
 * And telegram login auth .
 */

async function miniapp_init() {
    await Telegram.WebApp.ready();
    if (window.Telegram.WebApp.initData) {
        return window.Telegram.WebApp
    }
    return false
}


function miniapp_init_data() {
    return window.Telegram.WebApp
}