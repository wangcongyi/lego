import axios from 'axios'
export const upload = file => {
  const formData = new FormData()
  if (!file) {
    alert('File Empty')
    return
  }
  formData.append('file', file)
  return axios
    .post('/api/storage/uploadFile', formData)
    .then(res => {
      if (res.code === 200) {
        return res.msg
      } else {
        return Promise.reject('file')
      }
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
