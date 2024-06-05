import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import {List, message, Pagination, PaginationProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  listInterfaceInfoVoByPageUsingGet,
} from "@/services/yaziAPI/interfaceInfoController";

/**
 * 接口列表页
 * @constructor
 */

const Index: React.FC = () => {
  //设置加载的状态
  const [loading, setLoading] = useState(false);
  //传回数据
  const [list, setList] = useState<API.InterfaceInfoVO[]>([]);
  //总的条数
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);


  const loadData=async (current=1, pageSize=5) =>{
    setLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
       const res=await listInterfaceInfoVoByPageUsingGet({
         current, //当前页
         pageSize, //一页有多少条
      });
      //设置数据
      setList(res.data?.records?? [])
      setTotal(res?.data?.total ?? 0)
      // message.success('请求成功');
      return true;
    } catch (error: any) {
      message.error('请求失败，' + error.message);
      return false;
    }
    //设置加载状态为false:
    setLoading(false);
  }
  //页面首次加载会被触发
  useEffect(() => {
    loadData()
  }, []);

  //修改分页
  const onChange: PaginationProps['onChange'] = (current,pageSize) => {
    loadData(current,pageSize)
    setCurrent(current); // 设置当前页
    setPageSize(pageSize) //设置当前页有几条数据
  };
  return (
    <PageContainer>
      <List
        className="my-interfaceInfor-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item actions={[<a key={item.id} href={apiLink}>查看接口</a>]}>
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
        // pagination={{
        //   // eslint-disable-next-line @typescript-eslint/no-shadow
        //   showTotal(total: number) {
        //     return '总数：' + total;
        //   },
        //   pageSize: 5,
        //   total,
        //   onChange(page, pageSize) {
        //     loadData(page, pageSize);
        //   },
        // }}
      />
      <Pagination
        total={total}
        showTotal={(total) => ` 总数：${total}`}
        current={current}
        pageSize={pageSize}
        onChange={onChange}
         />
    </PageContainer>
  );
};
export default Index;
