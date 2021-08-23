import * as cdk from '@aws-cdk/core'
import { ApiStack } from './api-stack'

export class StagingStage extends cdk.Stage {
  readonly apiURL: cdk.CfnOutput

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props)

    const app = new ApiStack(this, 'ApiStackStaging')

    this.apiURL = app.apiURL
  }
}
