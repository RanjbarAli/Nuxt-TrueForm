import trans from './trans'

export const required = (a) => {
  return {
    status: a.length,
    message: trans('required'),
  }
}
export const email = (a) => {
  return {
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    status: a.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})$/),
    message: trans('email'),
  }
}
export const url = (a) => {
  return {
    status: a.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/),
    message: trans('url'),
  }
}
export const phone = (a) => {
  return {
    status: a.match(/^09\d{9}$/),
    message: trans('phone'),
  }
}
export const min = (a, min) => {
  return {
    status: a.length >= Number(min),
    message: trans('min', { min }),
  }
}

export const max = (a, max) => {
  return {
    status: a.length <= Number(max),
    message: trans('max', { max }),
  }
}
export const length = (a, len) => {
  return {
    status: a.length == Number(len),
    message: trans('length', { len }),
  }
}

export const regex = (a, regex) => {
  return {
    status: a.match(new RegExp(regex)),
    message: trans('regex'),
  }
}
