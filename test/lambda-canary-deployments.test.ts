import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LambdaCanaryDeployments from '../lib/lambda-canary-deployments-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaCanaryDeployments.LambdaCanaryDeploymentsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
