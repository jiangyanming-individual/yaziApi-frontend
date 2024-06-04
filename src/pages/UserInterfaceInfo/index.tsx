import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Card, Col, Descriptions, Divider, Form, Input, message, Row} from 'antd';
import React, {useEffect, useState} from 'react';
import {
  getFreeInvokeCountUsingPost,
  getInterfaceInfoVoByIdUsingGet, getLeftFreeInvokeCountUsingPost, invokeInterfaceInfoUsingPost,
} from "@/services/yaziAPI/interfaceInfoController";
import {useParams} from "@@/exports";
import Moment from "moment";
import {SizeType} from "@ant-design/pro-form/es/BaseForm";

/**
 * 接口详情页
 * @constructor
 */
const InterfaceInfo: React.FC = () => {
  const [loading,setLoading] = useState(true);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfoVO>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [size, setSize] = useState<SizeType>('middle'); // 按钮大小
  const [leftNum, setLeftNum] = useState<number>(0);
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

  //加载剩余调用次数
  const loadLeftNum = async ()=>{
    if (!params.id){
      message.error("接口不存在");
      return;
    }
    const resNum =  await getLeftFreeInvokeCountUsingPost({
      id: Number(params.id),
    });
    if(resNum.data){
      setLeftNum(resNum.data);
    }
  }

  useEffect(() => {
    loadData();
    loadLeftNum(); //加载剩余次数
  }, []);

  /**
   * 提交接口请求，返回数据
   * @param values
   */
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

      const resNum = await getLeftFreeInvokeCountUsingPost({
          id: Number(params.id),
        });
      setInvokeRes(res.data);
      //每次调用后都需要查询
      setLeftNum(resNum.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setInvokeLoading(false);
  };
  /**
   * 获取免费调用次数接口
   */
  const getFreeCount= async () =>{
      if (!params.id){
      message.error("接口不存在");
        return;
      }
    //设置加载效果
    setInvokeLoading(true);
      try{
        const res= await getFreeInvokeCountUsingPost({
          id: Number(params.id),
        });
        if(res.data){
           message.info('申请免费调用接口成功');
           loadLeftNum(); //更新数据
        }
      }catch(error:any){
        message.error('申请免费调用次数失败，' + error.message);
      }
      //懒加载位false
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

        <Row gutter={12}>
          <Col span={4}>
            <Button type="primary" size={size} onClick={getFreeCount}>
              申请免费接口调用
            </Button>
          </Col>
          <Col span={6}>
            剩余接口调用次数：{leftNum}
          </Col>
        </Row>

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
