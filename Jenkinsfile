node { // <1>
    stage('Build') { // <2>
        sh 'make prod' // <3>
    }

    stage('Test') {
        sh 'make test-backend'
        junit 'reports/**/*.xml' // <4>
    }

    stage('Deploy') {
        sh 'echo "DEPLOYING"'
    }
}