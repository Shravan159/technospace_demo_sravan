#!/bin/bash

# Grab!t Authentication App - DevOps Setup Script
# This script automates the entire environment setup and deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="grabit-auth"
APP_DIR="/opt/grabit-app"
DOCKER_COMPOSE_VERSION="2.20.2"
GITHUB_REPO="https://github.com/yourusername/grabit-auth.git"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Update system packages
update_system() {
    log_info "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget git unzip htop vim ufw
    log_success "System packages updated"
}

# Install Docker
install_docker() {
    log_info "Installing Docker..."
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Install prerequisites
    sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    log_success "Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink for docker-compose command
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log_success "Docker Compose installed successfully"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    sudo ufw --force enable
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 8080/tcp
    
    log_success "Firewall configured"
}

# Setup application directory
setup_app_directory() {
    log_info "Setting up application directory..."
    
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    
    # Create subdirectories
    mkdir -p $APP_DIR/{logs,backups,nginx,scripts}
    
    log_success "Application directory created"
}

# Clone repository
clone_repository() {
    log_info "Cloning repository..."
    
    if [ -d "$APP_DIR/.git" ]; then
        log_info "Repository already exists, pulling latest changes..."
        cd $APP_DIR
        git pull origin main
    else
        git clone $GITHUB_REPO $APP_DIR
        cd $APP_DIR
    fi
    
    log_success "Repository cloned/updated"
}

# Create environment files
create_env_files() {
    log_info "Creating environment files..."
    
    cat > $APP_DIR/.env << EOF
# Environment Configuration
ENVIRONMENT=production
NODE_ENV=production
PORT=8080

# Firebase Configuration (Add your actual config)
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_PROJECT_ID=your_project_id_here

# Database Configuration
POSTGRES_DB=grabit_analytics
POSTGRES_USER=grabit_user
POSTGRES_PASSWORD=secure_password_123

# Security
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
EOF

    chmod 600 $APP_DIR/.env
    log_success "Environment files created"
}

# Create nginx configuration
create_nginx_config() {
    log_info "Creating nginx configuration..."
    
    mkdir -p $APP_DIR/nginx
    
    cat > $APP_DIR/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    upstream app {
        server grabit-auth:80;
    }
    
    server {
        listen 80;
        server_name localhost;
        
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    log_success "Nginx configuration created"
}

# Create backup script
create_backup_script() {
    log_info "Creating backup script..."
    
    cat > $APP_DIR/scripts/backup.sh << 'EOF'
#!/bin/bash

# Backup script for Grab!t Auth App
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
APP_DIR="/opt/grabit-app"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/grabit-auth-app_$DATE.tar.gz -C $APP_DIR .

# Backup database (if using PostgreSQL)
docker exec grabit-postgres pg_dump -U grabit_user grabit_analytics > $BACKUP_DIR/database_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "grabit-auth-app_*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "database_*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

    chmod +x $APP_DIR/scripts/backup.sh
    log_success "Backup script created"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Install monitoring tools
    sudo apt install -y htop iotop nethogs ncdu
    
    # Create monitoring script
    cat > $APP_DIR/scripts/monitor.sh << 'EOF'
#!/bin/bash

# Simple monitoring script
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Disk Usage:"
df -h
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "Application Health:"
curl -s http://localhost:8080/health || echo "Application not responding"
EOF

    chmod +x $APP_DIR/scripts/monitor.sh
    log_success "Monitoring setup completed"
}

# Build and deploy application
deploy_application() {
    log_info "Building and deploying application..."
    
    cd $APP_DIR
    
    # Build Docker images
    docker-compose build --no-cache
    
    # Stop existing containers
    docker-compose down
    
    # Start application
    docker-compose up -d
    
    # Wait for application to start
    log_info "Waiting for application to start..."
    sleep 30
    
    # Health check
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        log_success "Application deployed successfully!"
        log_success "Access your app at: http://localhost:8080"
    else
        log_error "Application health check failed"
        docker-compose logs
        return 1
    fi
}

# Setup cron jobs
setup_cron_jobs() {
    log_info "Setting up cron jobs..."
    
    # Backup cron job
    (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/scripts/backup.sh >> $APP_DIR/logs/backup.log 2>&1") | crontab -
    
    # Docker cleanup cron job
    (crontab -l 2>/dev/null; echo "0 1 * * * docker system prune -f >> $APP_DIR/logs/cleanup.log 2>&1") | crontab -
    
    # Monitoring cron job
    (crontab -l 2>/dev/null; echo "*/5 * * * * $APP_DIR/scripts/monitor.sh >> $APP_DIR/logs/monitor.log 2>&1") | crontab -
    
    log_success "Cron jobs configured"
}

# Main execution
main() {
    log_info "Starting Grab!t Auth App DevOps Setup..."
    
    check_root
    update_system
    install_docker
    install_docker_compose
    configure_firewall
    setup_app_directory
    clone_repository
    create_env_files
    create_nginx_config
    create_backup_script
    setup_monitoring
    deploy_application
    setup_cron_jobs
    
    log_success "🎉 Setup completed successfully!"
    log_info "Your Grab!t Auth App is now running on http://localhost:8080"
    log_info "Logs are available in: $APP_DIR/logs/"
    log_info "Backups are stored in: /opt/backups/"
    
    echo ""
    echo "Next steps:"
    echo "1. Configure your Firebase credentials in $APP_DIR/.env"
    echo "2. Set up SSL certificate: sudo certbot --nginx"
    echo "3. Configure your domain name in nginx configuration"
    echo "4. Monitor logs: docker-compose logs -f"
}

# Run main function
main "$@"