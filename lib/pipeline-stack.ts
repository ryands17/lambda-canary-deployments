import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions'
import * as pipelines from '@aws-cdk/pipelines'
import { StagingStage } from './stages'

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const sourceArtifact = new codepipeline.Artifact()
    const cloudAssemblyArtifact = new codepipeline.Artifact()

    const pipeline = new pipelines.CdkPipeline(this, 'deployApp', {
      cloudAssemblyArtifact,
      sourceAction: new codepipelineActions.GitHubSourceAction({
        actionName: 'GH',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
        owner: 'ryands17',
        repo: 'lambda-canary-deployments',
        branch: 'main',
      }),
      synthAction: pipelines.SimpleSynthAction.standardYarnSynth({
        cloudAssemblyArtifact,
        sourceArtifact,
      }),
    })

    const stagingStage = new StagingStage(this, 'staging', {
      env: { region: process.env.region || 'us-east-2' },
    })
    // const staging = pipeline.addApplicationStage(stagingStage)
    pipeline.addApplicationStage(stagingStage)

    // staging.addActions(
    //   new pipelines.ShellScriptAction({
    //     actionName: 'testURL',
    //     useOutputs: {
    //       API_URL: pipeline.stackOutput(stagingStage.apiURL),
    //     },
    //     commands: ['curl -Ssf $API_URL'],
    //   })
    // )
  }
}
