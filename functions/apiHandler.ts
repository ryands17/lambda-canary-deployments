import { ProxyHandler } from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {
  console.log('all method handler')
  return {
    body: JSON.stringify({
      message: 'API version 4 has been deployed!',
      path: event.path,
    }),
    headers: { 'Content-Type': 'application/json' },
    statusCode: 200,
  }
}
