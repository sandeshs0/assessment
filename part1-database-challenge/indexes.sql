-- Index Reccomendation

-- Index on transaction_master
CREATE INDEX IF NOT EXISTS idx_tm_date_time
ON operators.transaction_master (txn_date, local_txn_date_time DESC);
-- This index helps to filter by txn_date quickly which is useful for reporting date-range based queries

-- Index on transaction_details
CREATE INDEX IF NOT EXISTS idx_td_master_time
ON operators.transaction_details (master_txn_id, local_txn_date_time DESC);
-- This index helps to quickly fetch details for a given master_txn_id ordered by local_txn_date_time


-- Read Write Performance Considerations:

-- Time slightly increases for insert operations because each new transcations must update idx_tm_date_time 
-- and each new transaction detail much update idx_td_master_time

-- Despire the slight increase in write time, it is worth it becase the reporting queries become significantly faster



