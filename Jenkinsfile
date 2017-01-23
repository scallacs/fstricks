node { 
    echo build.buildVariableResolver.resolve("WEBROOT_DIR")
    // ${GIT_BRANCH#*/}
    sh 'cd "/var/www/fstricks-develop"'

    stage('Pre-Build') { 
	sh 'git reset --hard '
    }

    stage('Build') { 
        sh 'make build'
    }

    stage('Test') {
        sh 'make test-backend'
        junit 'reports/**/*.xml'
    }

    stage('Deploy') {
        sh 'echo "DEPLOYING"'
    }
}