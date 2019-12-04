//引入axios和 qs
import axios from "axios";
import qs from "qs";

//创建axios实例
const serve = axios.create({
    baseURL: '/api',  // api的基本url，也可以直接写定好的url
    //baseURL: process.env.BASE_URL，
    timeout: 5000,  // 请求超时时间
　　withCredentials: true,
});
serve.interceptors.request.use(config => {    
    config.method === 'post'        
        ? config.data = qs.stringify({...config.data})        
        : config.params = {...config.params};    
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded'; 
    return config;
    }, error => {  //请求错误处理   
        Promise.reject(error)
    }
);

serve.interceptors.response.use(    
    response => {  //成功请求到数据        
           
        //这里根据后端提供的数据进行对应的处理        
        if (response.data.result === 'TRUE') {            
            return response.data;        
        } else { 
            //打印错误信息
            console.error(response.data.data.msg)
             
        }    
    },    
    error => {  //响应错误处理console.log('error');        
        console.error(error);        
        console.error(JSON.stringify(error));         
        let text = JSON.parse(JSON.stringify(error)).response.status === 404            
            ? '404'            
            : '网络异常，请重试';        
        alert(text)        
        return Promise.reject(error)   
    }
)

export default serve