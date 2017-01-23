node { 
    echo 'GIT BRANCH: ${GIT_BRANCH}'
    echo 'GIT BRANCH: ${GIT_BRANCH#*/}'
    sh 'cd /var/www/fstricks-${GIT_BRANCH#*/}'

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