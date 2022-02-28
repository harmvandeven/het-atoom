/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    // include other plugin configuration that applies to all deploy targets here
    // Enable the git-pages plugin only in production deployments
    pipeline: {
      disabled: {
        cp: deployTarget != 'pi',
        git: deployTarget != 'production',
      },
    },
  };

  // Setup the git-pages config
  ENV.git = {
    repo: 'git@github.com:harmvandeven/het-atoom.git',
    branch: 'github-pages',
    commitMessage: 'Deployed %@',
  };

  // Create a deploy location of the PI version
  ENV.cp = {
    destDir: '../deploy-het-atoom-pi',
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Store the deployTarget used to load local or remote images
  ENV.deployTarget = deployTarget;

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
