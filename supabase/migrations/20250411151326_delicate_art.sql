/*
  # Fix Settings Table Format

  1. Changes
    - Update all settings to store numeric values only in int_value
    - Clean up value column to only contain simple key-value pairs
    - Ensure no null values by defaulting to 0
    - Remove nested structures from value column

  2. Details
    - Move all numeric values to int_value column
    - Simplify value column JSON structure
    - Set default 0 for missing values
*/

-- Update service fees to correct format
UPDATE settings
SET 
  value = jsonb_build_object(
    REPLACE(key, 'service_fees_', ''),
    COALESCE(int_value, 0)
  ),
  int_value = COALESCE(int_value, 0)
WHERE key LIKE 'service_fees_%';

-- Update token_expiration
UPDATE settings
SET
  value = jsonb_build_object('days', COALESCE(int_value, 0)),
  int_value = COALESCE(int_value, 0)
WHERE key = 'token_expiration';

-- Update other settings with amount
UPDATE settings
SET
  value = jsonb_build_object('amount', COALESCE(int_value, 0)),
  int_value = COALESCE(int_value, 0)
WHERE key IN ('minimum_token_request', 'minimum_balance', 'welcome_token');

-- Create function to ensure proper format on insert/update
CREATE OR REPLACE FUNCTION update_int_value_from_jsonb()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract the first numeric value from the JSONB
  SELECT COALESCE(
    (SELECT value::text::integer 
     FROM jsonb_each(NEW.value) 
     LIMIT 1),
    0
  ) INTO NEW.int_value;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to maintain format
DROP TRIGGER IF EXISTS sync_int_value_with_jsonb ON settings;
CREATE TRIGGER sync_int_value_with_jsonb
  BEFORE INSERT OR UPDATE ON settings
  FOR EACH ROW
  WHEN (NEW.value IS NOT NULL)
  EXECUTE FUNCTION update_int_value_from_jsonb();