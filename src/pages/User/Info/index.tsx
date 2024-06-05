import {
  PageContainer,
} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Form, GetProp, Input, message, Modal, Select, Space, Upload, UploadProps} from "antd";
import {useModel} from "@umijs/max";
import Moment from "moment";
import Meta from "antd/es/card/Meta";
import {updateUserUsingPost} from "@/services/yaziAPI/userController";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {requestConfig} from "@/requestConfig";


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('必须上传JPG/PNG 格式的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于2MB');
  }
  return isJpgOrPng && isLt2M;
};


const UserInfo: React.FC = () => {

  const [initLoading, setInitLoading] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(""); //图片地址
  //获得用户信息
  const { initialState, setInitialState } = useModel('@@initialState');
  const { loginUser } = initialState;


  //样式
  const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
  };
  //表单样式:
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };



  /**
   * 提交图片
   * @param info
   */
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setInitLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setInitLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {initLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>提交</div>
    </button>
  );

  /**
   * 取消表单
   */
  const handleCancel=()=>{
    setUpdateModalShow(false);
  }
  /**
   *提交更新
   */
  const handleUpdate = async (values: any) => {

    setInitLoading(true);
    console.log('Received values of form: ', values);
    //传递参数
    const res = await updateUserUsingPost ({
      ...values,
      id: loginUser.id,
    });
    if (res.code === 0) {
      message.success('修改成功');
    } else {
      message.error('修改失败，请刷新重试！');
    }
    setUpdateModalShow(false);
    setInitLoading(false);
  };

  return (
    <>
    <PageContainer title="个人信息页">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card
          // loading={loading}
          title="个人信息"
          bordered={true}
          style={{ marginTop: 16 }}
          actions={[
            <b key="role">用户角色：{loginUser?.userRole?? null === 'admin' ? '管理员' : '普通用户'}</b>,
            <b key="createTime">创建时间: { Moment(loginUser?.createTime).format('YYYY-MM-DD HH:mm:ss')?? null}</b>,
          ]}
          extra={
            <Button type={'link'} onClick={() => setUpdateModalShow(true)}>
              编辑
            </Button>}
        >
          {/*数据*/}
          <Meta
            avatar={<Avatar src={loginUser?.userAvatar ?? null} />}
            title={'账号：' + loginUser?.userAccount?? null}
            description={'用户名：' + loginUser?.userName?? null}
          />
        </Card>
      </Space>
    </PageContainer>

      <Modal
        open={updateModalShow}
        title="更新个人信息"
        footer={null}
        onCancel={() => handleCancel()}
      >
        <Form
          {...formItemLayout}
          name="control-hooks"
          onFinish={handleUpdate}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="userName" label="昵称:" rules={[{ required: true }]}>
            <Input  placeholder="请输入你的昵称" />
          </Form.Item>
          <Form.Item name="userRole " label="角色:" rules={[{ required: true }]}>
            <Input  placeholder="请输入角色" />
          </Form.Item>
          {/*  <Form.Item label="头像" valuePropName="fileList">*/}
          {/*    <Upload*/}
          {/*      name="file"*/}
          {/*      listType="picture-card"*/}
          {/*      maxCount={1}*/}
          {/*      className="avatar-uploader"*/}
          {/*      showUploadList={false}*/}
          {/*      withCredentials={true}*/}
          {/*      action={requestConfig.baseURL + '/api/user/update/avatar'}*/}
          {/*      beforeUpload={beforeUpload}*/}
          {/*      onChange={handleChange}*/}
          {/*    >*/}
          {/*      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '50%' }} /> : uploadButton}*/}
          {/*    </Upload>*/}
          {/*</Form.Item>*/}

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
export default UserInfo;
