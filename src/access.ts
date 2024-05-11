/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: InitialState | undefined) {
  //获取用户信息： loginUser
  const { loginUser } = initialState ?? {};
  //返回管理员权限：
  return {
    canAdmin: loginUser && loginUser?.userRole === 'admin',
  };
}

