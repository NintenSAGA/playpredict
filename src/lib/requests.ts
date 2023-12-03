export function post(url: string, data: object, headers: HeadersInit) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: headers,
    body: JSON.stringify(data),
  })
}