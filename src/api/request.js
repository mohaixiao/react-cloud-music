import { axiosInstance } from "./config";

// 请求轮播图
export const getBannerRequest = () => {
    return axiosInstance.get('/banner');
}

// 请求推荐列表
export const getRecommendListRequest = () => {
    return axiosInstance.get('/personalized');
}

// 请求热门歌手
export const getHotSingerListRequest = (count) => {
    return axiosInstance.get(`/top/artists?offset=${count}`);
}

// 分类请求歌手
export const getSingerListRequest = (category, alpha, count) => {
    return axiosInstance
        .get(`/artist/list?cat=${category ? `${category}` : ''}&initial=${alpha.toLowerCase()}&offset=${count}`
        );
}

// 请求排行榜
export const getRankListRequest = () => {
    return axiosInstance.get(`/toplist/detail`);
};

// 请求歌单
export const getAlbumDetailRequest = id => {
    return axiosInstance.get(`/playlist/detail?id=${id}`);
};

//   请求歌手详情
export const getSingerInfoRequest = id => {
    return axiosInstance.get(`/artists?id=${id}`);
};

// 获取歌词
export const getLyricRequest = id => {
    return axiosInstance.get(`/lyric?id=${id}`);
};

// 获取热门关键词
export const getHotKeyWordsRequest = () => {
    return axiosInstance.get(`/search/hot`);
};

// 获取推荐
export const getSuggestListRequest = query => {
    return axiosInstance.get(`/search/suggest?keywords=${query}`);
};
// 获取关键词搜索 
export const getResultSongsListRequest = query => {
    return axiosInstance.get(`/search?keywords=${query}`);
};

// 获取具体的单曲数据
export const getSongDetailRequest = id => {
    return axiosInstance.get(`/song/detail?ids=${id}`);
};