## Performance Bottlenecks

1. JOIN on transaction_details
On line 35, the query joins the transaction details table to the master table. The master table has ~5,000,000 rows and details has ~25,000,000 rows. Each transaction has an average of 5 rows in details table. The columns of details table are separately being fetched so this join just creates unnecessary rows per transaction. 
Eg: If there are 10,000 transactions, the join creates a table of 50,000 rows. This makes the other operations like GROUP BY and ORDER BY much slower as there are ~ 5 rows for a transaction. 
Time Complexity : O(M X D) where, M = no of rows in transaction_master, D= Average number of details rows per transaction


2. Correlated Subquery

"WHERE td2.master_txn_id = tm.txn_id" This clause is causing corelated subquery because for every row in transaction_master, this runs once to find the matching rows in transaction_details. So if the outer query returns 1000 rows, the subquery will run 1000 times. 
This is a N+1 problem because for each N rows returned by main query, postgresql runs 1 subquery. So 1 main query + N subqueries = N+1 queries.
In large databases, repeatedly quering the same table is very slow.
Time Complexity: O(M) = Number of rows in transaction_master

3. GROUP BY

Because of the JOIN earlier, there are multiple rows i.e 5 per transaction which should not exist. So for simpler result, GROUP BY is used.
Grouping thousands of multiplied rows takes a lot of time and resources. If the uncessary JOIN was not used, this was not required



4. The transaction_details table is being scanned twice once in the "WHERE td2.master_txn_id = tm.txn_id" clause and once in the JOIN query. Scanning a large table multiple times in the query significantly slows down the execution time.


-> The time complefixty
