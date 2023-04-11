import { get } from "./config";

// 请求轮播图
export const getBannerRequest = () => {
    return get('/banner');
}

// 请求推荐列表
export const getRecommendListRequest = () => {
    return get('/personalized');
}

// 请求热门歌手
export const getHotSingerListRequest = (count) => {
    return get(`/top/artists?offset=${count}`);
}

// 分类请求歌手
export const getSingerListRequest = (category, alpha, count) => {
    return get(`/artist/list?cat=${category ? `${category}` : ''}&initial=${alpha.toLowerCase()}&offset=${count}`
    );
}

// 请求排行榜
export const getRankListRequest = () => {
    return get(`/toplist/detail`);
};

// 请求歌单
export const getAlbumDetailRequest = id => {
    return get(`/playlist/detail?id=${id}`);
};

//   请求歌手详情
export const getSingerInfoRequest = id => {
    return get(`/artists?id=${id}`);
};

// 获取歌词
export const getLyricRequest = id => {
    return get(`/lyric?id=${id}`);
};

// 获取热门关键词
export const getHotKeyWordsRequest = () => {
    return get(`/search/hot`);
};

// 获取推荐
export const getSuggestListRequest = query => {
    return get(`/search/suggest?keywords=${query}`);
};
// 获取关键词搜索 
export const getResultSongsListRequest = query => {
    return get(`/search?keywords=${query}`);
};

// 获取具体的单曲数据
export const getSongDetailRequest = id => {
    return get(`/song/detail?ids=${id}`);
};