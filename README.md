# Fault-Tolerant Decoupled Microservice Architecture

## Overview
This project implements a fault-tolerant and decoupled microservice architecture using Kafka and Redis Streams. The architecture is built with NestJS and comprises three main services, In Nest, a microservice is fundamentally an application that uses a different transport layer than HTTP. Nest supports several built-in transport layer implementations, called transporters, which are responsible for transmitting messages between different microservice instances. Most transporters natively support both request-response and event-based message styles. This project demonstrates kafka and TCP as transporters:

Producer Service: This service exposes endpoints to trigger inputs to the microservices comprising kafka (kakfa is the transport layer of choice) and redis stream (TCP as transport layer).

Kafka Consumer Service: This service has its transport layer protocol set as Kafka, along with the event listeners to fetch the pending list of messages from a topic, and acknowledge them through a particular consumer group, using the kafka server which is running in docker container which acts as a broker. Lets say this service has crashed or was inactive, even in that case if producer service adds some messages to the topic, it can be processed and acknowledged once this kafka consumer service is up and running, this is one of the use case making it loosely coupled and fault tolerant.

Redis Stream Consumer Service: This service is accessible using Transmission Control Protocol, which listens to a specific topic or message pattern defined by the decorator @MessagePattern.


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
