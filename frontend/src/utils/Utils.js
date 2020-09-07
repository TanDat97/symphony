import {
  LOCATION_CHANGE
} from 'react-router-redux'

import DateUtils from './DateUtils'

let account = {
  user_scope: window.localStorage.getItem('studio/scope'),
  user_token: window.localStorage.getItem('studio/token')
}

const navigateToPage = path => ({
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: path,
      search: '',
      hash: '',
    },
    action: 'push',
  },
});

const setAccount = (account_param) => {
  account = account_param
}

const isLogin = (role) => {
  if (account.user_token && account.user_scope.toLowerCase().includes(role)) {
    return true
  }
  return false
}

const isEmpty = (input) => {
  if (input === undefined || input === '' || input === null) {
    return true;
  }
  if (input.toString().replace(/\s/g, '').length) {
    return false;
  }
  return true;
}

const getDataWithKey = (keys, data) => {
  let result = []
  keys.forEach(key => {
    if (key.includes('_at')) {
      result.push(DateUtils.changeDateFormat(data[key], DateUtils.DDMMYYYYhhmm))
    } else {
      result.push(data[key].toString())
    }
  })
  return result
}

const mapKeyForState = (data) => {
  return Object.values(data).map((e) => {
    return JSON.stringify(e)
  }).join(',')
}

const countNumberOccur = (mainStr = '', subStr) => {
  return (mainStr.match(/-/g) || []).length
}

const isBoolean = (arg) => {
  return typeof arg === 'boolean';
}

const isNumber = (arg) => {
  return typeof arg === 'number';
}

const isString = (arg) => {
  return typeof arg === 'string';
}

const isFunction = (arg) => {
  return typeof arg === 'function';
}

const isObject = (arg) => {
  return arg !== null && typeof arg === 'object';
}

export default {
  navigateToPage,
  setAccount,
  isLogin,
  isEmpty,
  getDataWithKey,
  mapKeyForState,
  countNumberOccur,
  isBoolean,
  isNumber,
  isString,
  isFunction,
  isObject
}
