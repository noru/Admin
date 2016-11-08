import { Key } from '../consts'

export function Headers(request, next) {
  request.headers.set('Authorization', `Bearer ${Store.get(Key.Token)}`)
  next()
}
