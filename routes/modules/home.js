const express = require('express')
const router = express.Router()
const axios = require('axios')

const randomURL = require('../../public/javascripts/randomURL.js')
const ShortenURL = require('../../models/shortenURL')
const baseURL = 'http://localhost:3000/'

// 輸入帶有參數網址時
router.get('/:shortenURL', (req, res) => {
  ShortenURL
    .findOne({ shortenURL: req.params.shortenURL })
    .lean()
    .then(url => {
      // 1. 搜尋資料庫，有找到，重新導向
      res.status(301).redirect(url.userURL)
    })
    .catch(err => {
      // 2. 資料庫中沒有，返回頁面，回傳警告訊息
      req.flash('warning', `This shorten URL (${baseURL}${req.params.shortenURL}) is not in database.`)
      res.redirect('/')
    })
})

// 首頁面
router.get('/', (req, res) => {
  res.render('index')
})

// 送出表格時
router.post('/', (req, res) => {
  const userURL = req.body.userURL.trim()
  // 當有錯誤，重新導向回'/'時，將使用可輸入URL回傳到input內
  req.flash('userURL', userURL)

  // 網址列包含空白時，重新導向'/'，回傳警告訊息
  if (userURL.includes(' ')) {
    req.flash('warning', 'Input is an invalid URL.')
    return res.redirect('/')
  }

  // 測試是否符合URL結構，必須有protocal與domain
  try {
    new URL(userURL)
  } catch {
    // 測試未通過，重新導向'/'，回傳警告訊息
    req.flash('warning', 'Input is an invalid URL (protocal and domain are both required).')
    return res.redirect('/')
  }

  // 通過基本網址檢查後，搜尋資料庫是否已有
  ShortenURL
    .findOne({ userURL })
    .lean()
    .then(url => {
      // 若已建立，從資料庫回傳短網址
      req.flash('success', baseURL + url.shortenURL)
      return res.redirect('/')
    })
    .catch(() => {
      // 若為新網址，使用axios測試連線
      axios.get(userURL)
        .then(response => {
          // 1. 可連線時(400以外status)
          // a. 產生新的5碼英數亂碼
          const shortenURL = randomURL(5)
          // b. 在資料庫建立資料
          ShortenURL.create({ userURL, shortenURL })
          // c-1. 當屬於100或200的status時，正常回傳
          if (response.status < 300) {
            return req.flash('success', baseURL + shortenURL)
          }
          // c-2. 當為500或以上其他status時，回傳警告訊息
          req.flash('warning', `success, but URL has an issue. (${response.status}: ${response.statusText})`)
        })
        .catch(err => {
          // 2. 連線異常(400系列status)，回傳警告訊息
          req.flash('warning', `Input is an invalid URL. (${err.response.status}: ${err.response.statusText})`)
        })
        .finally(() => res.redirect('/'))
    })
})

module.exports = router