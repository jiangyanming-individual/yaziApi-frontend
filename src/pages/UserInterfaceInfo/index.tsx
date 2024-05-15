import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Card, Descriptions, Divider, Form, Input, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  getInterfaceInfoVoByIdUsingGet, invokeInterfaceInfoUsingPost,
} from "@/services/yaziAPI/interfaceinfoController";
import {useParams} from "@@/exports";
import Moment from "moment";

const InterfaceInfo: React.FC = () => {
  const [loading,setLoading] = useState(false);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfoVO>();
  const [invokeRes, setInvokeRes] = useState<any>();

  //拿到路径上的id
  const params = useParams();
  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoVoByIdUsingGet({
        id: Number(params.id),
      });
      //设置返回值
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  //提交接口请求，返回数据
  const onFinish = async (values:any) => {
    if (!params.id){
      message.error("接口不存在");
      return;
    }
    //设置加载效果
    setInvokeLoading(true);
      try {
        //调用后端接口
      const res = await invokeInterfaceInfoUsingPost({
        id: Number(params.id),
        ...values,
      });
      setInvokeRes(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card title="接口文档">
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{Moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{Moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <Card title="在线测试" bordered={false}>
        <Form
          name="basic"
          layout={"vertical"}
          onFinish={onFinish}
        >
          <Form.Item label="请求参数" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};
export default InterfaceInfo;
