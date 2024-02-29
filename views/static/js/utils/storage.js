/**
 * Storage util
 * 
 * Control cookies * local storage
 */

const router_storage = {
    authkey: "user_authkey",
    uid: "user_uid",
    user_data_tg: "user_data_telegram"
}

function storage_get_authkey() {
    var key = localStorage.getItem(router_storage.authkey);
    if (key) {
        return key
    }
    return false;
}

function storage_set_authkey(key) {
    localStorage.setItem(router_storage.authkey, key);
}

function storage_get_uid() {
    var key = localStorage.getItem(router_storage.uid);
    if (key) {
        return key
    }
    return false;
}

function storage_set_uid(uid) {
    localStorage.setItem(router_storage.uid, uid);
}

function storage_get_user_tg_data() {
    var key = localStorage.getItem(router_storage.user_data_tg);
    if (key) {
        return key
    }
    return false;
}

function storage_set_user_tg_data(uid) {
    localStorage.setItem(router_storage.user_data_tg, uid);
}