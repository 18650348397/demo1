import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () =>
        import ('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () =>
        import ('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () =>
        import ('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () =>
        import ('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () =>
        import ('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
            path: 'home',
            title: '首页',
            name: 'home_index',
            component: () =>
                import ('@/views/home/home.vue')
        },
        {
            path: 'edit-password',
            title: '修改密码',
            name: 'edit_password',
            component: () =>
                import ('@/views/edit-password/edit-password.vue')
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
    path: '/tool',
    show: true,
    icon: 'wrench',
    access: 0,
    name: 'tool',
    title: '管理工具',
    component: Main,
    children: [{
        path: 'models',
        show: true,
        icon: 'document',
        access: 0,
        name: 'models',
        title: '型号管理',
        component: () =>
            import ('@/views/tool/models/models.vue')
    }, {
        path: 'statute',
        show: true,
        icon: 'document',
        access: 0,
        name: 'statute',
        title: '规约管理',
        component: () =>
            import ('@/views/tool/statute/statute.vue')
    }, {
        path: 'network-allocation',
        show: true,
        icon: 'document',
        name: 'network_allocation',
        title: '网络配置',
        access: 0,
        component: () =>
            import ('@/views/tool/network-allocation/network-allocation.vue')
    }, {
        path: 'alarm',
        show: true,
        icon: 'document',
        name: 'alarm',
        title: '告警配置',
        access: 0,
        component: () =>
            import ('@/views/tool/alarm/alarm.vue')
    }, {
        path: 'port',
        show: true,
        icon: 'document',
        name: 'port',
        title: '串口配置',
        access: 0,
        component: () =>
            import ('@/views/tool/port/port.vue')
    }, {
        path: 'roles',
        show: true,
        icon: 'document',
        access: 0,
        name: 'roles',
        title: '用户权限',
        component: () =>
            import ('@/views/tool/roles/roles.vue')
    }, {
        path: 'version',
        show: true,
        icon: 'document',
        access: 0,
        name: 'version',
        title: '版本信息',
        component: () =>
            import ('@/views/tool/version/version.vue')
    }, {
        path: 'restart',
        show: true,
        icon: 'document',
        access: 0,
        name: 'restart',
        title: '主机重启',
        component: () =>
            import ('@/views/tool/restart/restart.vue')
    }]
}, {
    path: '/monitor',
    show: true,
    icon: 'ios-eye',
    access: 0,
    name: 'monitor',
    title: '监测管理',
    component: Main,
    children: [{
            path: 'switchs',
            show: true,
            icon: 'document',
            access: 0,
            name: 'switchs',
            title: '开关型传感器',
            component: () =>
                import ('@/views/monitor/switchs/switchs.vue')
        }, {
            path: 'numerical',
            show: true,
            icon: 'document',
            access: 0,
            name: 'numerical',
            title: '数值型传感器',
            component: () =>
                import ('@/views/monitor/numerical/numerical.vue')
        }
        /* ,
                {
                               path: 'simulation',
                               show: true,
                               icon: 'document',
                               access: 0,
                               name: 'simulation',
                               title: '模拟量传感器',
                               component: () =>
                                   import ('@/views/monitor/simulation/simulation.vue')
                           }, {
                               path: 'video-source',
                               show: true,
                               icon: 'document',
                               access: 0,
                               name: 'video_source',
                               title: '视频资源监测',
                               component: () =>
                                   import ('@/views/monitor/video-source/video-source.vue')
                           } */
        , {
            path: 'allocation',
            show: true,
            icon: 'document',
            access: 0,
            name: 'allocation',
            title: '监控平台配置',
            component: () =>
                import ('@/views/monitor/allocation/allocation.vue')
        }
    ]
}, {
    path: '/info',
    show: true,
    icon: 'monitor',
    name: 'info',
    title: '设备信息',
    component: Main,
    children: [{
            path: 'switchs-info',
            show: true,
            icon: 'document',
            name: 'switchs_info',
            title: '开关型传感器',
            component: () =>
                import ('@/views/info/switchs/switchs.vue')
        }
        /* , {
                path: 'numerical-info',
                show: true,
                icon: 'document',
                name: 'numerical_info',
                title: '数值型传感器',
                component: () =>
                    import ('@/views/info/numerical/numerical.vue')
            }, {
                path: 'simulation-info',
                show: true,
                icon: 'document',
                name: 'simulation_info',
                title: '模拟量传感器',
                component: () =>
                    import ('@/views/info/simulation/simulation.vue')
            } */
    ]
}, {
    path: '/log',
    show: true,
    icon: 'clipboard',
    access: 0,
    name: 'log',
    title: '事件日志',
    component: Main,
    children: [
        /* {
                path: 'alarm-events',
                show: true,
                icon: 'document',
                access: 0,
                name: 'alarm_events',
                title: '告警事件',
                component: () =>
                    import ('@/views/log/alarm-events/alarm-events.vue')
            }, {
                path: 'device-working',
                show: true,
                icon: 'document',
                access: 0,
                name: 'device_working',
                title: '设备运行',
                component: () =>
                    import ('@/views/log/device-working/device-working.vue')
            }, */
        {
            path: 'user-action',
            show: true,
            icon: 'document',
            access: 0,
            name: 'user_action',
            title: '用户操作',
            component: () =>
                import ('@/views/log/user-action/user-action.vue')
        }
    ]
}];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];