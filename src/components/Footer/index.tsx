import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '灰太狼家的小鸭子出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '鸭子API开放平台',
          title: '鸭子API开放平台',
          href: 'https://blog.csdn.net/JEREMY_GYJ',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/jiangyanming-individual',
          blankTarget: true,
        },
        {
          key: '鸭子API开放平台',
          title: '鸭子API开放平台',
          href: 'https://blog.csdn.net/JEREMY_GYJ',
          blankTarget: true,
        },
        {
          key: '豫ICP备2024072460号',
          title: '豫ICP备2024072460',
          href: 'https://beian.miit.gov.cn/',
          // blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
