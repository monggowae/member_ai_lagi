/*
  # Fix Settings Table Format

  1. Changes
    - Update service fees entries to have correct format
    - Move values to int_value column
    - Clean up value column format

  2. Details
    - Remove int_value from jsonb
    - Keep only the service name and amount in value
    - Store numeric amount in int_value
*/

-- Update photo_product
UPDATE settings
SET 
  value = jsonb_build_object('photo_product', (value->>'photo_product')::int),
  int_value = (value->>'photo_product')::int
WHERE key = 'service_fees_photo_product';

-- Update food_photography
UPDATE settings
SET 
  value = jsonb_build_object('food_photography', (value->>'food_photography')::int),
  int_value = (value->>'food_photography')::int
WHERE key = 'service_fees_food_photography';

-- Update animal_photography
UPDATE settings
SET 
  value = jsonb_build_object('animal_photography', (value->>'animal_photography')::int),
  int_value = (value->>'animal_photography')::int
WHERE key = 'service_fees_animal_photography';

-- Update photo_modification
UPDATE settings
SET 
  value = jsonb_build_object('photo_modification', (value->>'photo_modification')::int),
  int_value = (value->>'photo_modification')::int
WHERE key = 'service_fees_photo_modification';

-- Update fashion_photography
UPDATE settings
SET 
  value = jsonb_build_object('fashion_photography', (value->>'fashion_photography')::int),
  int_value = (value->>'fashion_photography')::int
WHERE key = 'service_fees_fashion_photography';

-- Update other settings to ensure proper format
UPDATE settings
SET int_value = (value->>'amount')::int
WHERE key IN ('minimum_token_request', 'minimum_balance', 'welcome_token')
  AND value ? 'amount';

UPDATE settings
SET int_value = (value->>'days')::int
WHERE key = 'token_expiration'
  AND value ? 'days';