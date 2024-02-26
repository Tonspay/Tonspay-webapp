const router_storage = {
    authkey: "user_authkey",
    uid: "user_uid",
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