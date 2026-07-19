pipeline {
  options {
    disableConcurrentBuilds()
    lock('langstitch-global')
  }
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: shell
    image: alpine:3.20
    command: ["sleep"]
    args: ["3600"]
'''
      defaultContainer 'shell'
    }
  }
  stages {
    stage('Validate') {
      steps { sh 'ls -la && test -d . && echo OK' }
    }
  }
}
