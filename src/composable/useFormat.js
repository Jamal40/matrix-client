import moment from 'moment'

export const DateFormat = date => {
  return moment(date).format('hh:mm - M.D.YYYY')
}

export const DateOnlyFormat = date => {
  return moment(date).format('M.D.YYYY')
}
