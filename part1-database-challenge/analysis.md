## Performance Bottlenecks

1. JOIN on transaction_details
On line 35, the query joins the transaction details table to the master table. The master table has ~5,000,000 rows and details has ~25,000,000 rows. Each transaction has an average of 5 rows in details table. The columns of details table are separately being fetched so this join just creates unnecessary rows per transaction. 
Eg: If there are 10,000 transactions, the join creates a table of 50,000 rows. This makes the other operations like GROUP BY and ORDER BY much slower as there are ~ 5 rows for a transaction. 
Time Complexity : O(M X D) where, M = no of rows in transaction_master, D= Average number of details rows per transaction


2. Correlated Subquery

"WHERE td2.master_txn_id = tm.txn_id" This clause is causing corelated subquery because for every row in transaction_master, this runs once to find the matching rows in transaction_details. So if the outer query returns 1000 rows, the subquery will run 1000 times. 
This is a N+1 problem because for each N rows returned by main query, postgresql runs 1 subquery. So 1 main query + N subqueries = N+1 queries.
In large databases, repeatedly quering the same table is very slow.
Time Complexity: O(M) where, M= Number of rows in transaction_master

3. GROUP BY

Because of the JOIN earlier, there are multiple rows i.e 5 per transaction which should not exist. So for simpler result, GROUP BY is used.
Grouping thousands of multiplied rows takes a lot of time and resources. If the uncessary JOIN was not used, this was not required.
Time Complexity: O(M x D x log(MxJ)) where, M = number of rows in transaction_master, D= avg number of details rows per transaction.


4. The transaction_details table is being scanned twice once in the "WHERE td2.master_txn_id = tm.txn_id" clause and once in the JOIN query. Scanning a large table multiple times in the query significantly slows down the execution time.


-> Since the time complexity of Group By is most significant,

Final Time Complexity = O(M x D x log(MxJ)) where, M = number of rows in transaction_master, D= avg number of details rows per transaction.

As the size of the data grows, the time required to complete the query increases significantly.


## Query Execution



Step 1- PostgreSQL applies the WHERE clause first so, transaction_master is filtered by date. This returns the transactions from 2025-11-16 to 2025-11-18.

Step 2 - Then the table is joined with transaction_details where the row explosion happens. This multiplies the rows significantly.

Step 3: Then the dataset is joined with members table. Since this is a relatively smaller and static table with indexes, this operation is faster.

Step 4: Then the GROUP BY is applied on the already exploded rows. This requires scanning all the rows. This is a time consuming and expensive operation.

Step 5: Then the SELECT clause runs with the correlated subquery 'WHERE td2.master_txn_id = tm.txn_id'. PostgreSQL runs this subquery once for every transaction. 

Step 6: Now, the rows are sorted with ORDER BY to get the final result.


### Most Expensive Operations:
1. Correlated Subquery
2. GROUP BY (caused by the unnecessary join)
3. JOIN with transaction_details


### Performance Impact

1. For 100k transactions: 
    JOIN returns approx. 500k rows. 
    GROUP BY has to scan 500k rows
    Correlated Subquery has to run 100k+1 times

    Impact: As mentioned, the query takes 15-20 seconds, connection pool expires, CPU usage spikes.

2. For 1M transactions:
    JOIN returns approx. 5M rows.
    GROUP BY has to scan 5M rows
    Correlated subquery runs 1M+1 times.

    Impact: Runtime might be in minutes, very high CPU usage, Database might be unresponsive causing Denial of Service.
    



