
import ajax from './ajax'
const BaseUrl = 'http://localhost:7000'

 
export const login = (username,password) => {
    return ajax(BaseUrl + '/login',
    {username,password},
    'POST'
)}


 
export const register = (username,password) => {
    return ajax(BaseUrl + '/register',
    {username,password},
    'POST'
)}

export const getUsers = () => {
    return ajax(BaseUrl + '/userlist',
    {},
    'GET'
)}

export const getUserInfo = () => {
    return ajax(BaseUrl + '/userinfo',
    {},
    'GET'
)}

export const logout = () => {
    return ajax(BaseUrl + '/logout',
    {},
    'GET'
)}

export const updateUserInfo = (user) => {
    return ajax(BaseUrl + '/updateuserinfo',
    {user},
    'POST'
)}

export const changePassword = (oldpwd,newpwd) => {
    return ajax(BaseUrl + '/changepassword',
    {oldpwd,newpwd},
    'POST'
)}

export const createWorker = (workername,sexual,worktype,phonenumber) => {
    return ajax(BaseUrl + '/newworker',
    {workername,sexual,worktype,phonenumber},
    'POST'
)}


export const getWorkerList = () => {
    return ajax(BaseUrl + '/workerlist',
    {},
    'GET'
)}

export const deleteWorker = (_id) => {
    return ajax(BaseUrl + '/deleteworker',
    {_id},
    'POST'
)}

export const editWorker = (worker) => {
    return ajax(BaseUrl + '/editworker',
    {worker},
    'POST'
)}

export const createWorkOrder = (
    userid,
    ordername,
    worktype,
    ordercaptain,
    cocompany,
    moneyamount
    ) => {
    return ajax(BaseUrl + '/newworkorder',
    {
        userid,
        ordername,
        worktype,
        ordercaptain,
        cocompany,
        moneyamount
    },
    'POST'
)}


export const getWorkOrderList = () => {
    return ajax(BaseUrl + '/workorderlist',
    {},
    'GET'
)}


export const editWorkOrder = (data) => {
    return ajax(BaseUrl + '/editworkorder',
    data,
    'POST'
)}


export const deleteWorkOrder = (_id) => {
    return ajax(BaseUrl + '/deleteworkorder',
    {_id},
    'POST'
)}