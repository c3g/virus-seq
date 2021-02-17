/*
 * constants.js
 */

const USER_TYPE = {
  NORMAL: 'NORMAL',
  ADMIN: 'ADMIN',
}

const SEX = {
  MALE: 'M',
  FEMALE: 'F',
}

const PROVINCE = {
  ON: 'Ontario',
  QC: 'Quebec',
  NS: 'Nova Scotia',
  NB: 'New Brunswick',
  MB: 'Manitoba',
  BC: 'British Columbia',
  PE: 'Prince Edward Island',
  SK: 'Saskatchewan',
  AB: 'Alberta',
  NL: 'Newfoundland and Labrador',
  NT: 'Northwest Territories',
  YT: 'Yukon',
  NU: 'Nunavut',
}

const PROVINCE_NAME =
  Object.fromEntries(
    Object.entries(PROVINCE)
      .map(([key, value]) => [value, key]))

const PROVINCE_CODES = Object.keys(PROVINCE)

module.exports = {
  USER_TYPE,
  SEX,
  PROVINCE,
  PROVINCE_NAME,
  PROVINCE_CODES,
}
