import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router'
import qs from 'qs'

let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

axios.defaults.baseURL ='http://192.168.31.130:8011/';
//axios.defaults.baseURL ='http://localhost:3089/';

//axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//axios.defaults.headers.common['auth'] = '645B355FE6E19468A548B4EB1321FA05EDCCB1417AF14134A7D8A4A905362DD4FC9804A7859361AB1875ECEDE0D2FCA43DC2ED69CD7FCF994537E3965738568A3B56607F1DA14AFD1A36DEE827350686A0C4DDD65D04AB8BFD9A8126E296CFBDD5B1BF50673C2359DBB5FD4862E54FF217C15C0BB7E7299AB9FE1B2E2851AAFD779F6CA1ECF92852E38C3F60C6B03F2541F183EE0AE8E9CFFD298BC793B6A23898A77F88833E96B0A825A34D664D355861E1ED51613DE3671C704883B22F24420F94EE32C3E0BFA425A186C1FCB39D978682BBEF993F196416C614DA074950B1CD6F593A1280394E2BD66541BA9507973F5F5B583282D7671E016B7193175B75DD079659956E3B62CAB3A84A106398A820FC5ADC6B090A7C567A36F47B78581A1D332C70F024946277E0937B6852497002E3DC1532EC9C5DD7AEE7472C6BDFF008699C8527074F1426ED5C6010CA92574F35155DEA69F2D2AF98E41B97649977789A24BEC02CFB5170EB78EB5137AA12';
//axios.defaults.headers['Content-Type'].post = 'application/x-www-form-urlencoded';

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
    // 加载
//  startLoading()
    if (sessionStorage.token){
    	config.headers.auth = sessionStorage.token
    }else{
    	router.push('/login')
    }
    if(config.method  === 'post'){
	    config.data = qs.stringify(config.data);
	}
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截  token过期处理
axios.interceptors.response.use(response => {
//  endLoading()
    const { Success } = response.data;
    if (Success=='false') {
//      Message.error(response.data.ErrorCode)
        // 清除token
        sessionStorage.removeItem('token')
        // 页面跳转
        router.push('/login')
    }
    return response
}, error => {
	console.log(error)
    endLoading()
    return Promise.reject(error)
})

export default axios