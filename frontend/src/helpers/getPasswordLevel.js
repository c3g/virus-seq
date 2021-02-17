/*
 * getPasswordLevel.js
 */

export default function getPasswordLevel(password) {
  if (password === '')
    return -1
  let value = 0
  if (password.length >= 6)
    value++
  else
    return value
  if (/[a-z]/.test(password) && /[A-Z]/.test(password))
    value++
  if (/\d/.test(password))
    value++
  if (/\W/.test(password))
    value++
  return value
}
