# Random Item Purchase System

1. Install KEDA:
   ```bash
   # Add KEDA Helm repository
   helm repo add kedacore https://kedacore.github.io/charts
   helm repo update

   # Create KEDA namespace
   kubectl create namespace keda

   # Install KEDA Helm chart
   helm install keda kedacore/keda --namespace keda
   ```

2. Build Docker images and Push to DockerHub:
   ```bash
   # Build API Server
   cd api-server
   docker build -t suzye/api-server .
   docker push suzye/api-server

   # Build Web Server
   cd ../web-server
   docker build -t suzye/web-server .
   docker push suzye/web-server
   ```

3. Deploy to Kubernetes:
   ```bash
   # Deploy core services
   kubectl apply -f k8s/

   # Deploy KEDA scalers
   kubectl apply -f k8s/keda/
   

## Components

1. API Server (Customer Management)
   - Handles customer data and purchase history
   - Consumes messages from Kafka
   - Stores data in MongoDB
   - Auto-scales based on Kafka message lag using KEDA

2. Web Server (Customer Facing)
   - Handles purchase requests
   - Publishes messages to Kafka
   - Provides user purchase history

3. MongoDB
   - Stores customer purchase data
   - Stores user purchases with username, userId, price, and timestamp
   - Indexes for efficient querying

4. Kafka
   - Message broker for purchase events
   - Handles asynchronous communication between services
   - Monitored by KEDA for auto-scaling triggers

## Architecture

### Data Flow
1. Web Server receives purchase request
2. Purchase data is published to Kafka
3. API Server consumes purchase messages
4. Purchase data is stored in MongoDB
5. Customers can query their purchase history

### Technologies
- TypeScript for type-safe development
- Express.js for REST APIs
- MongoDB for data persistence
- Kafka for message queuing
- Kubernetes for container orchestration(Minikube)

## API Endpoints

### Web Server (Customer Facing)
- POST /api/buy
  - Make a purchase
  - Body: { username: string, userId: string, price: number }
  - Returns: { message: string }
  Example:
  curl -i -X POST "http://localhost:8080/api/buy"   -H "Host: purchase.local"   -H "Content-Type: application/json"   -d '{"username":"elad","userId":"555","price":12.00}'

- GET /api/user/:userId/purchases
  - Get user's purchase history
  - Returns: Array of purchases

### API Server (Customer Management)
- GET /api/purchases?userId=:userId
  - Get all purchases for a specific user
  - Returns: Array of purchases with timestamps
  Example:
  curl -s "http://localhost:8080/api/getAllUserBuys/555"

## Minikube
there is an implemantation of ingress which is a better solution:
minikube addons enable ingress
minkube tunnel
I used for testing the following way:
kubectl port-forward svc/web-server 8080:4000
minikube addons enable metrics-server

### Keda

## Auto-scaling with KEDA

The system uses KEDA (Kubernetes Event-driven Autoscaling) to automatically scale the API server based on Kafka message lag.

### Monitoring Auto-scaling

Monitor the scaling behavior:
```bash
# Check HorizontalPodAutoscaler status
kubectl get hpa

# Check current pod count
kubectl get pods -l app=api-server

# View scaling events
kubectl describe ScaledObject kafka-scaler
```

### Testing Auto-scaling

1. Generate load:
   ```bash
   # Use the provided load testing script
   cd test
   npm run load-test
   ```

2. Monitor scaling:
   ```bash
   # Watch pods scaling up/down
   kubectl get pods -l app=api-server -w
   ```

### Troubleshooting

1. Check KEDA logs:
   ```bash
   kubectl logs -n keda -l app=keda-operator
   ```

2. Check ScaledObject status:
   ```bash
   kubectl describe ScaledObject kafka-scaler
   ```

3. Monitor Kafka metrics:
   ```bash
   kubectl exec -it kafka-0 -- kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group purchase-group
   ```
# List KEDA resources
kubectl get scaledobjects
kubectl get hpa
kubectl get -n keda all

# Describe specific scaler
kubectl describe scaledobject kafka-scaler

# Check KEDA operator logs
kubectl logs -n keda deploy/keda-operator --tail=50
kubectl logs -n keda deploy/keda-operator-metrics-apiserver --tail=50

# Events for specific namespace
kubectl get events --sort-by=.metadata.creationTimestamp | grep -i keda

# Check scaled deployment status
kubectl get deploy api-server
kubectl describe deploy api-server | grep -A 10 Events