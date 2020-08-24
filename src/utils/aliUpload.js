import axios from 'axios'
import { Axios } from '@/utils/axios'
import SparkMD5 from 'spark-md5'
const bucketName = 'yummy-server'
const bucketHost = `${bucketName}.oss-cn-hangzhou.aliyuncs.com`
const getSignature = (date, contentMD5, contentType) => {
  return Axios.post('', `/ossUploadSignature`, {
    contentMD5: contentMD5,
    contentType: contentType,
    date: date,
    canonicalizedResource: bucketName
  }).then(res => {
    return res.signature
  })
}

export const getAbsMd5 = (file) => {
  const fileReader = new FileReader()
  const blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice
  const chunkSize = 2097152
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  // new SparkMD5() readAsBinaryString
  const spark = new SparkMD5.ArrayBuffer()
  return new Promise((resolve, reject) => {
    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      // readAsBinaryString
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    fileReader.onload = function (e) {
      console.log("read chunk nr", currentChunk + 1, "of", chunks)
      // appendBinary readAsBinaryString // append binary string
      spark.append(e.target.result)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      }
      else {
        const res = spark.end()
        resolve(res)
        console.log('finished loading')
        console.info('computed absMd5 hash', res, 'length', res.length) // compute hash
      }
    }

    loadNext()
  })
}

const getDate = () => {
  return new Date().getTime()
}

/**
 * @return binaryMd5
 * @param {*} s absMd5
 */
export const getBinaryMd5 = (s) => {
  const arr = []
  for (var i = 0; i < s.length; i += 2) {
    const tem = parseInt(s.substr(i, 2), 16)
    arr.push(tem.toString(2).padStart(8, '0'))
  }
  return arr.join('')
}

export async function getContentMd5 (file) {
  const absMd5 = await getAbsMd5(file)
  const binaryMd5 = getBinaryMd5(absMd5)
  // console.log('binaryMd5', binaryMd5, 'length', binaryMd5.length)
  const contentMd5 = window.btoa(binaryMd5)
  return contentMd5
}

export async function upload (file) {
  const date = getDate()
  const contentType = file.type
  const contentMD5 = await getContentMd5(file)
  const signature = await getSignature(date, contentMD5, contentType)
  const config = {
    headers: {
      'Content-Type': contentType,
      'Authorization': `OSS ${signature}`,
      'Content-Encoding': 'utf-8',
      'date': new Date(),
      'Accept': '*/*'
    }
  }
  axios.put(`//${bucketHost}/${file.name}`, new Blob([file]), config).then(res => {
    debugger
    console.log('putObject', res)
  })
}