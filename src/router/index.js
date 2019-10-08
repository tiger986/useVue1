import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index')
        }]
    },

    // {
    //     path: '/form',
    //     component: Layout,
    //     children: [{
    //         path: 'index',
    //         name: 'Form',
    //         component: () =>
    //             import ('@/views/form/index'),
    //         meta: {
    //             title: 'Form',
    //             icon: 'form'
    //         }
    //     }]
    // },
    {
        path: '/userList',
        component: Layout,
        children: [{
            path: 'index',
            name: 'userList',
            component: () =>
                import ('@/views/userList/index'),
            meta: {
                title: '后台用户列表',
                icon: 'peoples'
            }
        }]
    },

    {
        path: '/mine',
        component: Layout,
        children: [{
            path: 'index',
            name: 'mine',
            component: () =>
                import ('@/views/mine/index'),
            meta: {
                title: '矿区管理',
                icon: 'nested'
            }
        }]
    },
    {
        path: '/work',
        component: Layout,
        children: [{
            path: 'index',
            name: 'work',
            component: () =>
                import ('@/views/work/index'),
            meta: {
                title: '工作面管理',
                icon: 'example'
            }
        }]
    },
    {
        path: '/notice',
        component: Layout,
        redirect: '/notice/list',
        name: 'Notice',
        meta: {
            title: '通知管理',
            icon: 'guide'
        },
        children: [{
                path: 'create',
                component: () =>
                    import ('@/views/notice/create'),
                name: 'CreateNotice',
                meta: {
                    title: '发送通知',
                    icon: 'edit'
                }
            },
            {
                path: 'list',
                component: () =>
                    import ('@/views/notice/list'),
                name: 'NoticeList',
                meta: {
                    title: '通知列表',
                    icon: 'list'
                }
            }
        ]
    },
    {
        path: '/identity',
        component: Layout,
        children: [{
            path: 'index',
            name: 'identity',
            component: () =>
                import ('@/views/identity/index'),
            meta: {
                title: '身份管理',
                icon: 'tree'
            }
        }]
    },
    {
        path: '/user',
        component: Layout,
        children: [{
            path: 'index',
            name: 'user',
            component: () =>
                import ('@/views/user/index'),
            meta: {
                title: '用户管理',
                icon: 'user'
            }
        }]
    },

    // {
    //     path: '/nested',
    //     component: Layout,
    //     redirect: '/nested/menu1',
    //     name: 'Nested',
    //     meta: {
    //         title: 'Nested',
    //         icon: 'nested'
    //     },
    //     children: [{
    //             path: 'menu1',
    //             component: () =>
    //                 import ('@/views/nested/menu1/index'), // Parent router-view
    //             name: 'Menu1',
    //             meta: {
    //                 title: 'Menu1'
    //             },
    //             children: [{
    //                     path: 'menu1-1',
    //                     component: () =>
    //                         import ('@/views/nested/menu1/menu1-1'),
    //                     name: 'Menu1-1',
    //                     meta: {
    //                         title: 'Menu1-1'
    //                     }
    //                 },
    //                 {
    //                     path: 'menu1-2',
    //                     component: () =>
    //                         import ('@/views/nested/menu1/menu1-2'),
    //                     name: 'Menu1-2',
    //                     meta: {
    //                         title: 'Menu1-2'
    //                     },
    //                     children: [{
    //                             path: 'menu1-2-1',
    //                             component: () =>
    //                                 import ('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //                             name: 'Menu1-2-1',
    //                             meta: {
    //                                 title: 'Menu1-2-1'
    //                             }
    //                         },
    //                         {
    //                             path: 'menu1-2-2',
    //                             component: () =>
    //                                 import ('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //                             name: 'Menu1-2-2',
    //                             meta: {
    //                                 title: 'Menu1-2-2'
    //                             }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     path: 'menu1-3',
    //                     component: () =>
    //                         import ('@/views/nested/menu1/menu1-3'),
    //                     name: 'Menu1-3',
    //                     meta: {
    //                         title: 'Menu1-3'
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             path: 'menu2',
    //             component: () =>
    //                 import ('@/views/nested/menu2/index'),
    //             meta: {
    //                 title: 'menu2'
    //             }
    //         }
    //     ]
    // },

    // {
    //     path: 'external-link',
    //     component: Layout,
    //     children: [{
    //         path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
    //         meta: {
    //             title: 'External Link',
    //             icon: 'link'
    //         }
    //     }]
    // },

    {
        path: '/example',
        component: Layout,
        redirect: '/example/list',
        name: 'Example',
        meta: {
            title: '文章列表',
            icon: 'documentation'
        },
        children: [{
                path: 'create',
                component: () =>
                    import ('@/views/example/create'),
                name: 'CreateArticle',
                meta: {
                    title: '发布文章',
                    icon: 'edit'
                }
            },
            {
                path: 'edit/:id(\\d+)',
                component: () =>
                    import ('@/views/example/edit'),
                name: 'EditArticle',
                meta: {
                    title: '编辑文章',
                    noCache: true
                },
                hidden: true
            },
            {
                path: 'list',
                component: () =>
                    import ('@/views/example/list'),
                name: 'ArticleList',
                meta: {
                    title: '文章列表',
                    icon: 'list'
                }
            }
        ]
    },
    {
        path: '/evaluate',
        component: Layout,
        children: [{
            path: 'index',
            name: 'evaluate',
            component: () =>
                import ('@/views/evaluate/index'),
            meta: {
                title: '反馈列表',
                icon: 'message'
            }
        }]
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})