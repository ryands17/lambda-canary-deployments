import { ProxyHandler } from 'aws-lambda'

export const handler: ProxyHandler = async (event) => {
  console.log('all method handler')
  if (Math.random() > 0.5) {
    throw Error('an unexpected error occured!')
  }

  return {
    body: JSON.stringify({
      message: 'API version 6 has been deployed!',
      path: event.path,
    }),
    headers: { 'Content-Type': 'application/json' },
    statusCode: 200,
  }
}
