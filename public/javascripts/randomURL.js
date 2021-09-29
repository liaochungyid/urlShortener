module.exports = function randomURL(requiredChars) {
  const charsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const charsLower = charsUpper.toLowerCase()
  const numbers = '0123456789'

  const chars = charsUpper + charsLower + numbers
  let url = '/'

  for (let i = 0; i < requiredChars; i++) {
    url += chars[Math.floor(Math.random() * chars.length)]
  }

  return url
}
