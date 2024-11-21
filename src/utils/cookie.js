import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, options = {}) => {
    return cookies.set(name, value, {
        path: '/',
        ...options
    });
};

export const getCookies = (name) => {
    return cookies.get(name);
};


export const removeCookie = (name) => {
    return cookies.remove(name, {path:'/'});
};