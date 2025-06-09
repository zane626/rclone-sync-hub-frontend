import dayjs from 'dayjs'

export function timeFormat (t, format = 'YYYY-MM-DD HH:mm:ss') {
  return t ? dayjs(t).format(format) : '-'
}
