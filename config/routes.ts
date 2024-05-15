export default [
  { path: '/', name: '欢迎', icon: 'smile', component: './Index' },
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
    path: '/admin',
    name: '管理页',
    icon: 'HomeOutlined',
    access: 'canAdmin',
    routes: [
      { name: '接口管理页', icon: 'CheckSquareOutlined', path: '/admin/interfaceInfo', component: './Admin/InterfaceInfo' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
