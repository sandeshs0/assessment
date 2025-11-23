
-- Optimized Query

-- Creating a CTE (temporary table) to prepare all the transaction details first in JSON form
-- This ensures that transaction_details table is scanned only once.
WITH details_temp AS (
    SELECT
        td.master_txn_id,
        json_agg(
            json_build_object(
                'txn_detail_id',       td.txn_detail_id,
                'master_txn_id',       td.master_txn_id,
                'detail_type',         td.detail_type,
                'amount',              td.amount,
                'currency',            td.currency,
                'description',         td.description,
                'local_txn_date_time', td.local_txn_date_time,
                'converted_date',      td.local_txn_date_time AT TIME ZONE 'UTC'
            )
            ORDER BY td.local_txn_date_time DESC
        ) AS details
    FROM operators.transaction_details td
    GROUP BY td.master_txn_id
)

-- Now joining the CTE with transaction_master and members

SELECT
   tm.*,
   tm.txn_id AS "tm.txnId",
   tm.local_txn_date_time AT TIME ZONE 'UTC' AS "tm.localTxnDateTime",
   dt.details, -- details from CTE created above
   ins.member_name AS member,
   iss.member_name AS issuer

FROM operators.transaction_master tm
-- Left join so that transactions without details are also included
   LEFT JOIN details_temp dt ON dt.master_txn_id = tm.txn_id
   LEFT JOIN operators.members ins ON tm.gp_acquirer_id = ins.member_id
   LEFT JOIN operators.members iss ON tm.gp_issuer_id = iss.member_id

WHERE 1=1
   tm.txn_date > DATE '2025-11-16' 
   AND tm.txn_date < DATE '2025-11-18'

ORDER BY tm.local_txn_date_time DESC;
    
-- Since we are not joining transaction_details table directly, there is no rows explosion and No Group By is needed


-- ALTERNATIVE APPROACH : Using LATERAL JOIN

-- We can also use LATERAL JOIN to achieve similar results instead of CTE.
-- It can be more efficient than original correlated subquery because it avoids row explosion.
-- But it performs one scan per transcation.

-- Trade Offs

-- Simpler to understand than CTE
-- No row explosion and GROUP BY required
-- Still performs one scan per transaction so can be slower than CTE for large data
-- Higher CPU usage than CTE for large data
