import axios from 'axios';

export const baseUrl = 'http://localhost:4000';

// 创建 Axios 实例
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在请求头中添加 token 等信息
        return config;
    },
    error => {
        console.log(error, 'error');
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        const res = response.data;
        // 在这里可以统一处理一些后端返回的错误码和错误信息
        if (res.code !== 200) {
            console.log('请求失败：', res.msg);
            return Promise.reject(new Error(res.msg));
        } else {
            return res;
        }
    },
    error => {
        console.log('请求错误：', error);
        if (!window.navigator.onLine) {
            // 断网情况下的处理
            console.log('网络异常，请检查网络连接！');
        } else if (error.response) {
            console.log('响应状态码：', error.response.status);
            return Promise.reject(new Error(`请求错误：${error.message}`));
        } else if (error.code === 'ECONNABORTED') {
            console.log('请求超时：', error.message);
            return Promise.reject(new Error('请求超时，请稍候再试！'));
        } else {
            return Promise.reject(error);
        }
    }
);


// 封装 get 请求
export function get(url, params = {}) {
    return instance.get(url, {
        params: params,
    });
}

// 封装 post 请求
export function post(url, data = {}) {
    return instance.post(url, data);
}

// 封装 put 请求
export function put(url, data = {}) {
    return instance.put(url, data);
}

// 封装 delete 请求
export function del(url, params = {}) {
    return instance.delete(url, { params: params });
}


//歌手种类
export const categoryTypes = [{
    name: "华语男",
    key: "1001"
},
{
    name: "华语女",
    key: "1002"
},
{
    name: "华语组合",
    key: "1003"
},
{
    name: "欧美男",
    key: "2001"
},
{
    name: "欧美女",
    key: "2002"
},
{
    name: "欧美组合",
    key: "2003"
},
{
    name: "日本男",
    key: "6001"
},
{
    name: "日本女",
    key: "6002"
},
{
    name: "日本组合",
    key: "6003"
},
{
    name: "韩国男",
    key: "7001"
},
{
    name: "韩国女",
    key: "7002"
},
{
    name: "韩国组合",
    key: "7003"
},
{
    name: "其他男歌手",
    key: "4001"
},
{
    name: "其他女歌手",
    key: "4002"
},
{
    name: "其他组合",
    key: "4003"
},
];

//歌手首字母
export const alphaTypes = [{
    key: "A",
    name: "A"
},
{
    key: "B",
    name: "B"
},
{
    key: "C",
    name: "C"
},
{
    key: "D",
    name: "D"
},
{
    key: "E",
    name: "E"
},
{
    key: "F",
    name: "F"
},
{
    key: "G",
    name: "G"
},
{
    key: "H",
    name: "H"
},
{
    key: "I",
    name: "I"
},
{
    key: "J",
    name: "J"
},
{
    key: "K",
    name: "K"
},
{
    key: "L",
    name: "L"
},
{
    key: "M",
    name: "M"
},
{
    key: "N",
    name: "N"
},
{
    key: "O",
    name: "O"
},
{
    key: "P",
    name: "P"
},
{
    key: "Q",
    name: "Q"
},
{
    key: "R",
    name: "R"
},
{
    key: "S",
    name: "S"
},
{
    key: "T",
    name: "T"
},
{
    key: "U",
    name: "U"
},
{
    key: "V",
    name: "V"
},
{
    key: "W",
    name: "W"
},
{
    key: "X",
    name: "X"
},
{
    key: "Y",
    name: "Y"
},
{
    key: "Z",
    name: "Z"
}
];

//顶部的高度
export const HEADER_HEIGHT = 45;

//播放模式
export const playMode = {
    sequence: 0,
    loop: 1,
    random: 2
};