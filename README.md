# ⚙️ **Fault-Tolerant Decoupled Microservice Architecture**

## 🚀 **Overview**

This project demonstrates a **fault-tolerant** and **decoupled microservice architecture** using **Kafka** and **Redis Streams**. Built with **NestJS**, it showcases how microservices can communicate through various transport layers like **Kafka** (for event-driven communication) and **TCP**. 

In **NestJS**, a microservice is an application that uses a different transport layer from HTTP. Nest supports several built-in transport layer implementations (called **transporters**) for transmitting messages between microservices. These transporters natively support both **request-response** and **event-based messaging styles**. 

This project implements two main transporters: **Kafka** and **TCP**, providing a flexible architecture for different use cases.

---

## 🏗️ **Key Components**

### 1. **Producer Service**
- The **Producer Service** exposes **HTTP endpoints** to trigger events that are pushed to Kafka and Redis Stream topics.
- **Transport Layers**:
  - **Kafka**: Used to send messages to the Kafka broker.
  - **TCP**: Used for sending messages to the Redis Stream.
  
**Use Case**: 
- When the producer sends messages to a topic in Kafka or Redis, these messages will be queued even if the consumer services are down. Once the consumers come back online, they can **process** and **acknowledge** these messages, making the system **fault-tolerant**.

---

### 2. **Kafka Consumer Service**
- The **Kafka Consumer Service** uses **Kafka** as the transport layer protocol.
- It listens to a **specific Kafka topic** and retrieves the **pending messages** through a particular **consumer group**. The Kafka broker is managed using a **Docker container**.
  
**Fault-Tolerance**: 
- If this service crashes or becomes inactive, the producer can still add messages to the topic. Once the consumer service is back online, it can **process** and **acknowledge** the pending messages, ensuring **loose coupling** and **fault tolerance**.

📹 **Demo**:  


https://github.com/user-attachments/assets/529f814b-a6b3-4280-a0c4-6e2ec9aac442


---

### 3. **Redis Stream Consumer Service**
- The **Redis Stream Consumer Service** uses **TCP** as its transport layer protocol.
- It listens for a specific **topic/message pattern** defined by the `@MessagePattern` decorator.
  
**Fault-Tolerance**:
- Similar to the Kafka consumer, if this service is down, messages from the producer will still be queued. Once the service comes back online, it will **recover** and **process** those messages, making the system **fault-tolerant**.

📹 **Demo**:  


https://github.com/user-attachments/assets/55a3e44f-1afb-43d9-aea8-2dac5312d43d



## Project Structure

```
Fault-Tolerant-Decoupled-Microservice-Arch
|
|
├── kafka-consumer-service
│   ├── dist
│   │   ├── app.controller.d.ts
│   │   ├── app.controller.js
│   │   ├── app.controller.js.map
│   │   ├── app.module.d.ts
│   │   ├── app.module.js
│   │   ├── app.module.js.map
│   │   ├── app.service.d.ts
│   │   ├── app.service.js
│   │   ├── app.service.js.map
│   │   ├── main.d.ts
│   │   ├── main.js
│   │   ├── main.js.map
│   │   └── tsconfig.build.tsbuildinfo
│   ├── docker-compose.yml
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── producer-service
│   ├── dist
│   │   ├── app.controller.d.ts
│   │   ├── app.controller.js
│   │   ├── app.controller.js.map
│   │   ├── app.module.d.ts
│   │   ├── app.module.js
│   │   ├── app.module.js.map
│   │   ├── app.service.d.ts
│   │   ├── app.service.js
│   │   ├── app.service.js.map
│   │   ├── main.d.ts
│   │   ├── main.js
│   │   ├── main.js.map
│   │   └── tsconfig.build.tsbuildinfo
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── README.md
└── redis-stream-consumer-service
    ├── dist
    │   ├── app.controller.d.ts
    │   ├── app.controller.js
    │   ├── app.controller.js.map
    │   ├── app.module.d.ts
    │   ├── app.module.js
    │   ├── app.module.js.map
    │   ├── app.service.d.ts
    │   ├── app.service.js
    │   ├── app.service.js.map
    │   ├── main.d.ts
    │   ├── main.js
    │   ├── main.js.map
    │   └── tsconfig.build.tsbuildinfo
    ├── nest-cli.json
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── src
    │   ├── app.controller.spec.ts
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   └── main.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```



## Contributing

 - Fork the repository.

 - Create a new branch (git checkout -b feature/your-feature).

 - Make your changes.

 - Commit your changes (git commit -m 'Add new feature').

 - Push to the branch (git push origin feature/your-feature).

 - Open a pull request.

## License
This project is licensed under the MIT License
