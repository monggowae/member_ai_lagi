/*
  # Expiring Tokens View

  1. New View
    - `expiring_tokens_view`
      Shows tokens that will expire within the configured expiration period
      
  2. Columns
    - user_id (uuid)
    - total_expiring_tokens (integer)
    - earliest_expiration (timestamptz)

  3. Security
    - Grant SELECT access to authenticated users
*/

CREATE OR REPLACE VIEW expiring_tokens_view AS
WITH token_expiration AS (
  SELECT COALESCE(int_value, 14) as expiration_days
  FROM settings
  WHERE key = 'token_expiration'
),
timezone_config AS (
  SELECT 'Asia/Jakarta'::text as tz
)
SELECT 
  th.user_id,
  SUM(th.amount) as total_expiring_tokens,
  MIN(th.expires_at) as earliest_expiration
FROM token_history th
CROSS JOIN token_expiration te
CROSS JOIN timezone_config tc
WHERE 
  th.type = 'approved'
  AND th.expires_at IS NOT NULL
  AND th.expires_at BETWEEN 
    (timezone(tc.tz, now()))
    AND 
    (timezone(tc.tz, now() + (te.expiration_days * INTERVAL '1 day')))
GROUP BY th.user_id;

-- Grant access to authenticated users
GRANT SELECT ON expiring_tokens_view TO authenticated;

COMMENT ON VIEW expiring_tokens_view IS 'Shows tokens that will expire within the configured expiration period';