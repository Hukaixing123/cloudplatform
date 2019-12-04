import axios from 'axios'/* 
import { resolve } from 'dns'
import { reject } from 'q' */

export default function ajax(url,data={},type='GET'){
    return new Promise((resolve,reject)=>{  
        let promise
        if(type === 'GET'){
        //get请求函数
            let dataStr = ''
            Object.keys(data).forEach(key=>{
                dataStr += key + '=' + data[key] + '&' 
            })
            if(dataStr !== ''){
                dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            promise = axios.get(url)//因为axios在get或post方法之后返回的是一个promise对象，所以后续可以进行then
        }else{
        //post请求函数
            promise = axios.post(url,data)
        }
        promise.then(response=>{//这是axios的then方法，即表示axios的调用如果成功，则调用promise的resolve
            resolve(response.data)//这个resolve方法是外层promise的参数调用，根据promise的规则，
            //这里resolve方法里的数据会作为调用这个函数的返回值，这也是本来封装promise函数的意义所在
        }).catch((error)=>{//axios异步获取数据失败，进入catch方法，并调用promise的reject
            reject(error)
        })
        /*函数思想：
        axios.get和axios.post可以得到一个promise对象，then和catch方法可以承接各自的回调函数，
        即axios请求成功则可以通过then方法调用，失败则通过catch方法进行调用，
        重点！then方法里的回调函数，可以设置参数(response)，这里的response就是axios调用成功后得到的全部数据
        此时在外面封装new promise函数，该函数的参数是resolve和reject，用于改变promise状态，
        一旦执行resolve，则该promise函数的后续调用会选择then，
        并且，如果执行resolve的同时，resolve()里的参数会自动作为后续then调用的回调函数的参数，
        即then(callback(参数))，那么就可以把这个回调函数设置为获取参数中我们想要的部分，即response.data。
        catch方法同理，axios失败则调用catch方法，并执行reject
        */
    })
}


/* 
export default function ajax(url,data={},type='GET'){
        if(type === 'GET'){
        //get请求函数
            let dataStr = ''
            Object.keys(data).forEach(key=>{
                dataStr += key + '=' + data[key] + '&' 
            })m
            if(dataStr !== ''){
                dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
                url = url + '?' + dataStr
            }
            return axios.get(url)//因为axios在get或post方法之后返回的是一个promise对象，所以后续可以进行then
        }else{
        //post请求函数
            return axios.post(url,data)
}
} */