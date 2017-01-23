node { 
    echo env.GIT_COMMIT
    echo env.GIT_BRANCH
    echo env.GIT_REVISION
    sh 'cd "/var/www/fstricks-${GIT_BRANCH#*/}"'

    stage('Pre-Build') { 
	sh 'git reset --hard origin/${GIT_BRANCH}'
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