import * as ln from '@aws-cdk/aws-lambda-nodejs'
import { Duration } from '@aws-cdk/core'
import { Runtime } from '@aws-cdk/aws-lambda'
import { RetentionDays } from '@aws-cdk/aws-logs'

export class Lambda extends ln.NodejsFunction {
  constructor(
    ...[scope, id, props]: ConstructorParameters<typeof ln.NodejsFunction>
  ) {
    super(scope, id, {
      ...props,
      entry: `./functions/${id}.ts`,
      memorySize: 256,
      timeout: Duration.seconds(5),
      reservedConcurrentExecutions: 100,
      runtime: Runtime.NODEJS_14_X,
      logRetention: RetentionDays.ONE_WEEK,
      bundling: {
        sourceMap: true,
        sourceMapMode: ln.SourceMapMode.INLINE,
      },
      environment: {
        ...props?.environment,
        NODE_OPTIONS: '--enable-source-maps',
      },
    })
  }
}
