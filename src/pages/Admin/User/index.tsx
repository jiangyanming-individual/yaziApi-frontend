import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import {
  Button, Card, Divider,
  Drawer, Form,
  GetProp, Input,
  message, Modal, Select,
  Space,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps
} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {
  addUserUsingPost,
  deleteUserUsingPost,
  getUserByParamsUsingPost,
  listUserByPageUsingGet,
  updateUserUsingPost
} from "@/services/yaziAPI/userController";
import Moment from "moment";
import {updateInterfaceInfoUsingPost} from "@/services/yaziAPI/interfaceInfoController";
import {Simulate} from "react-dom/test-utils";
import Search from "antd/es/input/Search";



//样式
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
//表单样式:
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const UserList: React.FC = () => {

  const [form] = Form.useForm();
  const[addForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<API.UserVO[]>([]);
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const [modalOpen,isModalOpen] =useState(false);

  interface DataType {
    createTime?: string;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  }

  /**
   * 查询用户：
   */
  const onSearch=async()=>{
    setLoading(true);

    const  params= await form.validateFields();
    console.log("params:"+ params.userName);
    const res= await getUserByParamsUsingPost({
      userName:params.userName,
      userAccount:params.userAccount,
    })

    if(res.data){
        message.success("查询成功")
        setData([res?.data])
    }else{
      message.info("查询用户失败")
    }
    setLoading(false);
  }


  /**
   * 新增用户
   */
  const handleAdd=async()=>{
    setLoading(true);
    const  params= await addForm.validateFields();
    console.log("params:"+ params.userAccount);
    //参数：
    const res= await addUserUsingPost({
      userAccount:params.userAccount,
      userName:params.userName,
      userPassword:params.userPassword,
      userRole:params.userRole,
    })
    if(res.data){
      message.success("添加用户成功")
      return location;
    }else{
      message.info("添加用户失败")
    }
    isModalOpen(false);
    setLoading(false);
  }
  /**
   * 更新用户
   * @param fields
   */
  const handleUpdate = async (fields:  API.InterfaceInfoVO) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPost({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   * 删除用户
   * @param fields
   */
  const handleDelete= async (fields:  API.InterfaceInfoVO) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      const res=await deleteUserUsingPost({
        id: currentRow.id,
        ...fields
      });
      console.log("res:",res.data);
      if(res.data){
        hide();
        message.success('操作成功');
        return true;
      }
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const handleCancel=()=>{
    isModalOpen(false);
  }

  //传入参数 加载数据
  const loadData= async()=>{
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res= await listUserByPageUsingGet({
      current: 1,
      pageSize: 10,
    });
    try{
      if (res.data){
        console.log("res.data.records:",res.data.records);
        setData(res?.data.records)
      }
    }catch(e:any){
      message.error("加载失败："+ e.getMessage);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [])

  const columns: TableColumnsType<DataType> = [
    {
      title: '用户ID',
      width: 100,
      dataIndex: 'id',
      fixed: 'left',
    },
    { title: '用户名', dataIndex: 'userName'},
    { title: '用户账户', dataIndex: 'userAccount' },
    {
      title: '用户头像',
      width: 100,
      dataIndex: 'userAvatar',
      render: (_, record) => (
        <img src={record.userAvatar} width="50" height="50" alt="" />
      ),
    },

    {title: '用户角色', dataIndex: 'userRole' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        Moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
      ),
    },

    {
      title: '编辑',
      width: 90,
      render: (_,record) =>(
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            // handleUpdate(record);
            setCurrentRow(record);
          }}
        >
          修改
        </Button>
      ),
    },
    {
      title: '删除',
      fixed: 'right',
      width: 90,
      render: (_,record) =>(
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            // handleDelete(record);
          }}
        >
          删除
        </Button>
      ),
    },
  ];

    return (

    <>
      <PageContainer>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Form form={form} layout="inline">
            <Form.Item name="userName" label="查询用户名">
              <Input placeholder="请输入用户昵称" />
            </Form.Item>
            <Form.Item name="userAccount" label="查询账户">
              <Input placeholder="请输入用户账户" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={onSearch}>查询</Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" danger onClick={()=>{isModalOpen(true)}} >添加</Button>
            </Form.Item>
          </Form>
        </Space>

        <Divider />

        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} pagination={false} bordered />
        </Space>
      </PageContainer>


      <Modal title="添加用户"
             open={modalOpen}
             footer={null}
             onCancel={() => handleCancel()}
      >
        <Form
          form={addForm}
          {...formItemLayout}
          name="control-hooks"
          onFinish={handleAdd}
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            name="userAccount"
            label="账号:"
            rules={[{ required: true }]}>
            <Input  placeholder="请输入账户!" />
          </Form.Item>
          <Form.Item
            label="密码:"
            name="userPassword"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="userName" label="昵称:" rules={[{ required: true }]}>
            <Input  placeholder="请输入昵称" />
          </Form.Item>
          {/*<Form.Item name="userRole" label="角色:" rules={[{ required: true }]}>*/}
          {/*  <Input  placeholder="请输入角色" />*/}
          {/*</Form.Item>*/}
          <Form.Item name="userRole" label="角色" rules={[{ required: true }]}>
            <Select
              placeholder="请选择角色"
              allowClear
            >
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout} >
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button htmlType="reset" onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </>


  );
};
export default UserList;
