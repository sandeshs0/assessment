# Merchant Settlement Processing System

The system processes settlements for 10,000 merchants everyday. Five Million transactions need to be handled everyday ensuring data consistency and idempotency. The system should also provide real time status tracking for trustable User Experience.

The breakdown of the components, dataflow, technology choices etc are explained below:

## Component Breakdown

1. API Server
API Server can be built with Java Springboot which acts as the interface for client and other components. It can have endpoints for viewing settlement status, history, transaction summaries etc. The server fetches data from PostgreSQL and Redis Cache. Its main responsibility is to respond quickly to client requests in structured way instead of performing heavy tasks.

2. Scheduler
Scheduler is a cron job that runs periodically. We can schedule it for less active time of the day like midnight. It creates settlement tasks for each merchant and sends them to the message queue. For 10,000 merchants, it creates 10,000 tasks and sends to the message queue.

3. Message Queue
Message Queue will be used for message queues. The tasks created by the scheduler are stored in a queue for a worker to pick it. The tasks in the queue are processed one by one. If a worker fails, the task goes back in the queue. This stores the tasks safely while not overloading the workers. 

4. Settlement Worker Service
The workers do the actual work of settling the transactions. The workers pick the tasks in the MessageQueue and complete them one by one. At once multiple workers can work on multiple tasks. For each tasks, the worker will fetch transactions from the database, make calculations, save the settlement record, update the status as settled in the database and the Redis Cache. Workers do the heavy processing  reducing the load on the API Server.

5. PostgreSQL 
PostgresSQL will be used as the main database of the system. It is a good choice for financial systems as it supports ACID transactions and makes the system reliable. All the transactions, settlement records, user information, history etc can be stored in the database. 

6. Redis Cache
Redis will be used as a cache to store real time status of settlements. Redis stores data in memory instead of disk so read/write operations are much faster for quick updates. It will also reduce the load from the main database.


## Technology Choices

PostgreSQL :For Financial solutions that requires consistent and reliable data storage, PostgresSQL is a good choice.It supports ACID transactions so that settlements can be reliable and atomic. It also supports Efficient Indexing, Table Partitioning, Custom Data Types. PostgreSQL is also Open source so it doesnt require licensing.

RabbitMQ: To store settlement jobs in queue and deliver to the worker services. Since we have to store more than 10,000 jobs daily, RabbitMQ ensures reliable message delivery. It supports idempotency so that same job is not picked twice.

Redis: Quering to the main database can be slow and expensive so Redis Cache is used to store the status of settlements so that the workers can update the status of jobs and API can fetch them quickly without quering the main database. Redis stores the data in its memory instead of disk so the read/write operations are significantly faster than the database.




## Data Flow and Processing Strategy
- All the transaction records are stored by the API to PostgreSQL database.
- At Idle time (maybe midnight), Scheduler scans the unique merchants and creates jobs for each merchant.
- The jobs are stored in the message queue.
- Workers pull the job from the queue one by one.
- For each job, worker queries database for all the transactions of the merchant.
- Worker processes the settlement and marks the transactions as settled. Settlements and status updates are creates/updated in the database as atomic database transactions.
- Worker updates the status in Redis Cache so API can show real-time update.
- API returns the status to the merchant's dashboards.



## Scalability and Failure Handling

### Scalability:
- Workers can be added to process more settlememts as the paltform grows
- PostgreSQL supports Table Partitioning, and indexing.
- Redis reduces the read query to main Database and hence reducing the response time.

### Failure Handling
- If a worker service crashes, the message is lined to the message queue again.
- Idempotency checks to prevent duplicate settlements.
- Critical database operations are operated as database transactions ensuring ACID principle.
- Redis Cache has TTL to expire the old status keys.
- If Redis fails, API checks database for settlement status as fallback.





