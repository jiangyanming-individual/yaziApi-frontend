export default [
  { path: '/', name: '接口列表页', icon: 'smile', component: './Index' },
  { path: '/interface_info/:id', name: '查看接口', icon: 'smile', component: './UserInterfaceInfo', hideInMenu: true },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/user',
    routes: [
      { path: '/user/info',
        name: '个人信息页',
        icon: 'AuditOutlined',
        component: './User/Info'
      },
    ],
  },


  // {
  //   path: '/myInterface',
  //   name: '我的接口',
  //   icon: 'appstoreOutlined',
  //   component: './User/MyInterface',
  // },
  {
    path: '/admin',
    name: '管理页',
    icon: 'HomeOutlined',
    access: 'canAdmin',
    routes: [
      { name: '用户管理页', icon: 'CaretRightOutlined', path: '/admin/user', component: './Admin/User' },
      { name: '接口管理页', icon: 'CheckSquareOutlined', path: '/admin/interfaceInfo', component: './Admin/InterfaceInfo' },
      { name: '接口分析页', icon: 'BarChartOutlined', path: '/admin/AnalysisInterfaceInfo', component: './Admin/AnalysisInterfaceInfo' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
