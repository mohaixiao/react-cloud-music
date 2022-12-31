import React, { useRef, useState, useEffect, useMemo } from 'react';

import { debounce } from './../../api/utils';

import { SearchBoxWrapper } from './style';

const SearchBox = (props) => {
    const queryRef = useRef();
    const [query, setQuery] = useState('');
    // 从父组件热门搜索中拿到的新关键词
    const { newQuery } = props;
    // 父组件针对搜索关键字发请求相关的处理
    const { handleQuery } = props;


    let handleQueryDebounce = useMemo(() => {
        return debounce(handleQuery, 500);
    }, [handleQuery]);


    // query 改变时执行回调:
    useEffect(() => {
        handleQueryDebounce(query);
        // eslint-disable-next-line 
    }, [query]);

    // 进场时 input 框应该出现光标
    useEffect(() => {
        queryRef.current.focus();
    }, []);

    // 父组件点击了热门搜索的关键字，newQuery 更新
    useEffect(() => {
        if (newQuery !== query) {
            setQuery(newQuery);
        }
        // eslint-disable-next-line
    }, [newQuery]);

    // 搜索框内容改变时的逻辑
    const handleChange = (e) => {
        setQuery(e.currentTarget.value);
    };

    // 清空框内容的逻辑
    const clearQuery = () => {
        setQuery('');
        queryRef.current.focus();
    }
    // 根据关键字是否存在决定清空按钮的显示 / 隐藏 
    const displayStyle = query ? { display: 'block' } : { display: 'none' };

    return (
        <SearchBoxWrapper>
            <i className="iconfont icon-back" onClick={() => props.back()}>&#xe655;</i>
            <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange} />
            <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
        </SearchBoxWrapper>
    )
};

export default React.memo(SearchBox);