import React, { lazy, Suspense } from "react";
import { Redirect } from "react-router-dom";



const Home = lazy(() => import("../application/Home"));
const Recommend = lazy(() => import("../application/Recommend/"));
const Singers = lazy(() => import("../application/Singers"));
const Rank = lazy(() => import("../application/Rank"));
const Album = lazy(() => import("../application/Album"));
const Singer = lazy(() => import("./../application/Singer"));
const Search = lazy(() => import("./../application/Search"));

const SuspenseComponent = Component => props => {
    return (
        <Suspense fallback={null}>
            <Component {...props}></Component>
        </Suspense>
    )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: '/',
        component: Home,
        routes: [
            {
                path: '/',
                exact: true,
                render: () => <Redirect to={'/recommend'}></Redirect>,
            },
            {
                path: '/recommend',
                component: SuspenseComponent(Recommend),
                routes: [
                    {
                        path: '/recommend/:id',
                        component: SuspenseComponent(Album),
                    }
                ]
            },
            {
                path: '/singers',
                component: SuspenseComponent(Singers),
                routes: [
                    {
                        path: '/singers/:id',
                        component: SuspenseComponent(Singer),
                    }
                ]
            },
            {
                path: '/rank',
                component: SuspenseComponent(Rank),
                key: "rank",
                routes: [
                    {
                        path: '/rank/:id',
                        component: SuspenseComponent(Album),
                    }
                ]
            },
            {
                path: '/album/:id',
                exact: true,
                key: "album",
                component: SuspenseComponent(Album),
            },
            {
                path: '/search',
                exact: true,
                component: SuspenseComponent(Search),
            }
        ]
    }
]