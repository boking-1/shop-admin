import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies()
const TokenKey = "admin-token"

//获取token
export function getToken() {
    return cookie.get(TokenKey)
}
//设置token
export function setToken(token) {
    return cookie.set(TokenKey, token)
}
//移除token
export function removeToken() {
    return cookie.remove(TokenKey)
}

//sku排列算法
export function cartesianProductOf() {
    return Array.prototype.reduce.call(arguments, function (a, b) {
        var ret = [];
        a.forEach(function (a) {
            b.forEach(function (b) {
                ret.push(a.concat([b]));
            });
        });
        return ret;
    }, [[]]);
}