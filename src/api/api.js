/* import serve from './axios'

 
export const login = (data) => {
    console.log(data)
    return serve({
        url: '/login',
        method: 'post',
        data
    })
} */

import ajax from './ajax'
const BaseUrl = 'http://localhost:7000'
//import serve from './axios'
//const BaseUrl = '/api'

 
export const login = (username,password) => {
    return ajax(BaseUrl + '/login',
    {username,password},
    'POST'
    )
}

 
export const register = (username,password) => {
    ajax(BaseUrl + '/register',
    {username,password},
    'POST'
    )
}

/* export const getusers = () => {
    ajax('http://localhost:7000/userlist',
    {},
    'GET'
    )
} */
export const getusers = () => {
    return ajax(BaseUrl + '/userlist',
    {},
    'GET'
    )
}
    /* 
}
export const getusers = () => {
    return serve({
        url:'/userlist',
        method:'GET',
        data:{}
})
    
} */