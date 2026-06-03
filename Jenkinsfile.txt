pipeline {
    agent any
    environment {
        // Pulls your existing SonarCloud token
        SONAR_TOKEN = credentials('SONAR_TOKEN') 
        // Your specific Discord webhook URL
        DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1506911387106934816/4AeJjk52dtQj63Kfz_ZDWvWEARcqLQ6sEzLDrIAevZ2VIaOnyDZJ3f5wPBBYu-dqTG1y" 
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/s225645819/SIT753_7_3HD.git'
            }
        }
        stage('1. Build (Artefact)') {
            steps {
                echo "Installing dependencies and packaging artefact..."
                sh 'npm install'
                // Creates a versioned artefact file just like a production build
                sh 'tar -czf app-release-v${BUILD_NUMBER}.tar.gz ./*' 
            }
        }
        stage('2. Test') {
            steps {
                echo "Running automated Jest unit tests..."
                sh 'npm test'
            }
        }
        stage('3. Code Quality') {
            steps {
                echo "Running SonarCloud continuous inspection..."
                sh """
                npx sonar-scanner \
                  -Dsonar.projectKey=s225645819_SIT753_7_3HD \
                  -Dsonar.organization=s225645819 \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=https://sonarcloud.io \
                  -Dsonar.login=\${SONAR_TOKEN}
                """
            }
        }
        stage('4. Security') {
            steps {
                echo "Scanning for vulnerable dependencies..."
                sh 'npm audit || true'
            }
        }
        stage('5. Deploy (Staging)') {
            steps {
                echo "Deploying to local staging environment via Docker..."
                // Kills and removes any previously running container
                sh 'docker stop sit753-app || true'
                sh 'docker rm sit753-app || true'
                
                // Builds the new Docker image and runs it on port 3000
                sh 'docker build -t sit753-app-image .'
                sh 'docker run -d -p 3000:3000 --name sit753-app sit753-app-image'
                sh 'sleep 5' // Give it time to boot up
            }
        }
        stage('6. Release') {
            steps {
                echo "Promoting to Release via Jenkins Artifacts..."
                // Saves the packaged app permanently in Jenkins
                archiveArtifacts artifacts: 'app-release-*.tar.gz', followSymlinks: false
            }
        }
        stage('7. Monitoring & Alerting') {
            steps {
                echo "Pinging health endpoint and sending status to Discord..."
                // Using escaped quotes to format the JSON payload correctly for Discord
                sh '''
                if curl -s -f http://localhost:3000/health > /dev/null; then
                    curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"✅ **Production Monitor**: The SIT753 Application is ONLINE and healthy after Build ${BUILD_NUMBER}!\\"}" $DISCORD_WEBHOOK
                else
                    curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\": \\"🚨 **CRITICAL ALERT**: The SIT753 Application is DOWN!\\"}" $DISCORD_WEBHOOK
                    exit 1
                fi
                '''
            }
        }
    }
}
