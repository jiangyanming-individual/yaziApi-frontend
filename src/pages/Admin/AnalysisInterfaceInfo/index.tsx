import {
  PageContainer,
} from '@ant-design/pro-components';
import '@umijs/max';
import ReactECharts from 'echarts-for-react';
import {useEffect, useState} from "react";
import {getAnalysisInvokeUsingGet} from "@/services/yaziAPI/anaysisInvokeController";

const AnalysisInterfaceInfo: React.FC = () => {
  //设置加载
 const [loading, setLoading] = useState(true);
 const [data, setData] = useState<API.AnalysisInvokeVO[]>([]);
  //页面首次加载会被触发
  useEffect(() => {
    getAnalysisInvokeUsingGet().then(res=>{
      try{
        if(res.data){
          setData(res.data)
        }
      }catch(e: any){

      }
    })
  }, []);

  //数据解析：
  const chartData=data.map(item=>{
    return {
      value: item.totalNum,
      name: item.name,
    }
  })

 const option = {
   title: {
     text: '接口调用次数统计Top3',
     left: 'center'
   },
   tooltip: {
     trigger: 'item'
   },
   legend: {
     orient: 'vertical',
     left: 'left'
   },
   series: [
     {
       name: 'Access From',
       type: 'pie',
       radius: '50%',
       data: chartData,
       emphasis: {
         itemStyle: {
           shadowBlur: 10,
           shadowOffsetX: 0,
           shadowColor: 'rgba(0, 0, 0, 0.5)'
         }
       }
     }
   ]
 };
  return (
    <PageContainer>
      <ReactECharts  loadingOption={{showLoading: loading}} option={option} />
    </PageContainer>
  );
};
export default AnalysisInterfaceInfo;
