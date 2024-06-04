import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Drawer, GetProp, message, Table, TableColumnsType, TablePaginationConfig, TableProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {deleteUserUsingPost, listUserByPageUsingGet, updateUserUsingPost} from "@/services/yaziAPI/userController";
import Moment from "moment";
import {updateInterfaceInfoUsingPost} from "@/services/yaziAPI/interfaceInfoController";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;



const UserList: React.FC = () => {


  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<API.UserVO[]>([]);
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  interface DataType {
    createTime?: string;
    id?: number;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
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

  /**
   *    createTime?: string;
   */
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

  interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  }

  const getParameters=(params: TableParams)=>({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });


  //传入参数 加载数据
  const loadData= async(fields:  API.UserVO)=>{
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const res= await listUserByPageUsingGet({
        current: 1,
        pageSize: 10,
       ...fields
     });
     try{
       if (res.data){
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


    return (
    <PageContainer>
      <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} pagination={false} bordered />
    </PageContainer>

  );
};
export default UserList;
