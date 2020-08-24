import axios from 'axios'
import OSS from 'ali-oss'
import uuidv1 from 'uuid/v1'
export const getAK = () => {
  return axios.post('/api/ossAccessInfo').then(res => {
    return {
      accessKeyId: res.msg.accessKeyID,
      accessKeySecret: res.msg.accessKeySecret
    }
  })
}
export default async function(file) {
  const ak = await getAK()
  const config = Object.assign(
    {
      bucket: 'dev-lego',
      region: 'oss-cn-hangzhou'
    },
    ak
  )
  const client = new OSS(config)
  const key = uuidv1()
  try {
    let r1 = await client.put(key, file)
    let r2 = await client.get(key)
    return r1
  } catch (e) {
    return Promise.reject(e)
  }
}