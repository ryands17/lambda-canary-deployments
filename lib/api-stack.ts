import * as cdk from '@aws-cdk/core'
import * as apiGw from '@aws-cdk/aws-apigateway'
import * as cd from '@aws-cdk/aws-codedeploy'
import * as cw from '@aws-cdk/aws-cloudwatch'
import * as lambda from '@aws-cdk/aws-lambda'
import { Lambda } from './helpers'

export class ApiStack extends cdk.Stack {
  readonly apiURL: cdk.CfnOutput

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Function and its alias
    const handler = new Lambda(this, 'apiHandler')
    const dev = new lambda.Alias(this, 'apiHandlerDev', {
      aliasName: 'dev',
      version: handler.currentVersion,
    })

    // API endpoint
    const api = new apiGw.LambdaRestApi(this, 'restApi', {
      handler: dev,
      deployOptions: { stageName: 'dev' },
    })

    const failureAlarm = new cw.Alarm(this, 'lambdaFailure', {
      alarmDescription: 'The latest deployment errors > 0',
      metric: new cw.Metric({
        metricName: 'Errors',
        namespace: 'AWS/Lambda',
        statistic: 'sum',
        period: cdk.Duration.minutes(1),
        dimensionsMap: {
          Resource: dev.functionArn,
          FunctionName: handler.functionArn,
        },
      }),
      threshold: 1,
      evaluationPeriods: 1,
    })

    new cd.LambdaDeploymentGroup(this, 'canaryDeployment', {
      alias: dev,
      deploymentConfig: cd.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      alarms: [failureAlarm],
    })

    this.apiURL = new cdk.CfnOutput(this, 'apiURL', {
      value: api.url,
    })
  }
}
