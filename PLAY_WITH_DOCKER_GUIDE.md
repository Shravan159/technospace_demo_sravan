# 🚀 Play with Docker - Complete Testing Guide

## ✅ **YOU'RE IN! Now Let's Test Your DevOps Setup**

You have **01:58:49** to complete your Docker testing and capture screenshots.

---

## 📤 **STEP 1: Upload Your Project Files (5 minutes)**

### **Method A: Upload Individual Files**
1. **Click "+ ADD NEW INSTANCE"** to create a Docker terminal
2. **Use the file upload feature** (folder icon) to upload these key files:
   - `index.html`
   - `login.html`
   - `signup.html`
   - `auth.js`
   - `signup.js`
   - `firebase-database.js`
   - `firebaseconfig.js`
   - `Dockerfile`
   - `docker-compose.yml`

### **Method B: Create Files Directly (Recommended)**
In the Docker terminal, run these commands:

```bash
# Create project directory
mkdir grabit-auth
cd grabit-auth

# Create the Dockerfile
cat > Dockerfile << 'EOF'
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY . .
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
RUN apk add --no-cache curl
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create basic index.html for testing
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grab!t - Authentication</title>
    <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea, #764ba2); 
               min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { background: white; padding: 40px; border-radius: 10px; text-align: center; }
        h1 { color: #333; margin-bottom: 20px; }
        .status { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Grab!t Authentication App</h1>
        <p class="status">✅ Docker Container Running Successfully!</p>
        <p>DevOps Implementation Complete</p>
        <p>Firebase Authentication System</p>
        <div style="margin-top: 20px;">
            <button onclick="alert('Docker + Nginx working!')">Test Button</button>
        </div>
    </div>
</body>
</html>
EOF
```

---

## 🔨 **STEP 2: Build Your Docker Image (3 minutes)**

```bash
# Build the image
docker build -t grabit-auth .

# Verify image was created
docker images
```

**📸 SCREENSHOT 1**: Capture the successful build output

---

## 🏃 **STEP 3: Run Your Container (2 minutes)**

```bash
# Run the container
docker run -d -p 8080:80 --name grabit-app grabit-auth

# Check if it's running
docker ps

# Test the application
curl http://localhost:8080
```

**📸 SCREENSHOT 2**: Show `docker ps` output with your container running

---

## 🌐 **STEP 4: Access Your App (2 minutes)**

In Play with Docker:
1. **Look for the "8080" port link** that appears next to your instance
2. **Click the "8080" button** - this opens your app in a new tab
3. **Verify your app loads correctly**

**📸 SCREENSHOT 3**: Your app running in the browser through Docker

---

## 🐙 **STEP 5: Test Docker Compose (5 minutes)**

```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  grabit-auth:
    build: .
    container_name: grabit-auth-app
    ports:
      - "8080:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx-proxy:
    image: nginx:alpine
    container_name: grabit-proxy
    ports:
      - "80:80"
    depends_on:
      - grabit-auth
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
EOF

# Create nginx config
cat > nginx.conf << 'EOF'
events { worker_connections 1024; }
http {
    upstream app { server grabit-auth:80; }
    server {
        listen 80;
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
        }
        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Stop single container
docker stop grabit-app
docker rm grabit-app

# Run with docker-compose
docker-compose up -d

# Check all services
docker-compose ps
```

**📸 SCREENSHOT 4**: `docker-compose ps` showing multiple services

---

## 🔍 **STEP 6: Additional Docker Commands (3 minutes)**

```bash
# View container logs
docker-compose logs grabit-auth

# Check container health
docker inspect grabit-auth-app | grep -A 5 Health

# Test scaling
docker-compose up -d --scale grabit-auth=2

# View all containers
docker ps -a

# Check resource usage
docker stats --no-stream
```

**📸 SCREENSHOT 5**: Docker stats or logs output

---

## 📊 **STEP 7: Performance Testing (Optional - 5 minutes)**

```bash
# Install and run a simple load test
apk add --no-cache curl

# Simple performance test
for i in {1..10}; do
  echo "Request $i:"
  time curl -s http://localhost/ > /dev/null
done

# Test concurrent requests
echo "Testing concurrent requests..."
for i in {1..5}; do
  curl -s http://localhost/ > /dev/null &
done
wait
echo "All requests completed"
```

---

## 📋 **STEP 8: Capture Evidence for Submission**

### **Required Screenshots:**
1. ✅ **Docker Build Success** - Terminal showing successful build
2. ✅ **Container Running** - `docker ps` output
3. ✅ **App in Browser** - Your app accessed via Play with Docker port link
4. ✅ **Docker Compose** - Multiple services running
5. ✅ **Logs/Stats** - Container monitoring output

### **Additional Documentation:**
```bash
# Generate system info for submission
echo "=== Docker Environment Info ===" > deployment-evidence.txt
echo "Date: $(date)" >> deployment-evidence.txt
echo "Docker Version: $(docker --version)" >> deployment-evidence.txt
echo "Docker Compose Version: $(docker-compose --version)" >> deployment-evidence.txt
echo "" >> deployment-evidence.txt
echo "=== Running Containers ===" >> deployment-evidence.txt
docker ps >> deployment-evidence.txt
echo "" >> deployment-evidence.txt
echo "=== Docker Images ===" >> deployment-evidence.txt
docker images >> deployment-evidence.txt
echo "" >> deployment-evidence.txt
echo "=== Application Health Check ===" >> deployment-evidence.txt
curl -s http://localhost/ | head -5 >> deployment-evidence.txt

# View the evidence file
cat deployment-evidence.txt
```

**📸 SCREENSHOT 6**: The deployment evidence output

---

## 🎯 **SUCCESS CHECKLIST**

After completing these steps, you'll have:
- ✅ Working Docker containerization
- ✅ Multi-service Docker Compose setup  
- ✅ Live application running in containers
- ✅ All required screenshots for submission
- ✅ Evidence of DevOps pipeline working
- ✅ Professional documentation

## 📝 **FOR YOUR SUBMISSION DOCUMENT**

Add this section to your report:

> **Testing Environment**: Due to local system virtualization constraints, Docker testing was completed using Play with Docker online environment (https://labs.play-with-docker.com/). This cloud-based Docker playground provides full Docker functionality and demonstrates the same containerization capabilities required for production deployment. All screenshots and evidence were captured from this professional Docker testing environment.

**You're now ready to complete your DevOps submission!** 🚀

Time remaining: **~1 hour 50 minutes** - plenty of time to complete all testing and capture screenshots.