import { ProxyHandler } from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {
  console.log('all method handler')
  return {
    body: JSON.stringify({
      message: 'API version 1 has been deployed!',
      path: event.path,
    }),
    statusCode: 200,
  }
}
