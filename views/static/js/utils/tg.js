async function miniapp_init() {
    await Telegram.WebApp.ready();
    return window.Telegram.WebApp
}


function miniapp_init_data() {
    return window.Telegram.WebApp
}