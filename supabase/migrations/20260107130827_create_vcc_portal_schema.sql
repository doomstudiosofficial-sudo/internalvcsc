/*
  # Internal VCC Portal Database Schema

  ## Overview
  This migration creates the complete database structure for the Internal VCC Portal,
  a secure platform for managing Virtual Credit Card services for Turkey-issued cards.

  ## New Tables

  ### 1. `vcc_cards`
  Stores virtual credit card information and metadata
  - `id` (uuid, primary key) - Unique card identifier
  - `card_number` (text) - Masked card number for display
  - `card_holder` (text) - Cardholder name
  - `expiry_date` (text) - Card expiry (MM/YY format)
  - `cvv` (text) - Card CVV (encrypted in production)
  - `amount_limit` (numeric) - Maximum transaction amount in TRY
  - `currency` (text) - Always TRY for Turkey cards
  - `provider` (text) - Sipay or İşbank
  - `status` (text) - active, inactive, expired, blocked
  - `merchant_restriction` (text) - Specific merchant or category restriction
  - `created_at` (timestamptz) - Card creation timestamp
  - `expires_at` (timestamptz) - Card expiration timestamp
  - `last_used_at` (timestamptz) - Last transaction timestamp

  ### 2. `transactions`
  Records all VCC transaction attempts and results
  - `id` (uuid, primary key) - Unique transaction identifier
  - `card_id` (uuid, foreign key) - Reference to vcc_cards
  - `amount` (numeric) - Transaction amount in TRY
  - `merchant` (text) - Merchant name
  - `status` (text) - success, failed, pending, declined
  - `error_code` (text) - Error code if failed
  - `error_message` (text) - Human-readable error message
  - `created_at` (timestamptz) - Transaction timestamp

  ### 3. `api_logs`
  Logs all API requests for monitoring and debugging
  - `id` (uuid, primary key) - Unique log identifier
  - `endpoint` (text) - API endpoint called
  - `method` (text) - HTTP method (GET, POST, etc.)
  - `request_body` (jsonb) - Request payload
  - `response_status` (integer) - HTTP response status code
  - `response_body` (jsonb) - Response payload
  - `ip_address` (text) - Client IP address
  - `created_at` (timestamptz) - Request timestamp

  ### 4. `providers`
  Stores information about payment providers (Sipay, İşbank)
  - `id` (uuid, primary key) - Unique provider identifier
  - `name` (text) - Provider name
  - `status` (text) - active, inactive, maintenance
  - `card_types` (text[]) - Supported card types
  - `min_limit` (numeric) - Minimum card limit in TRY
  - `max_limit` (numeric) - Maximum card limit in TRY
  - `processing_fee` (numeric) - Processing fee percentage
  - `integration_notes` (text) - Technical integration details
  - `created_at` (timestamptz) - Provider added timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS (Row Level Security) enabled on all tables
  - Policies allow authenticated access only
  - In production, implement user-based access control
*/

-- Create vcc_cards table
CREATE TABLE IF NOT EXISTS vcc_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number text NOT NULL,
  card_holder text NOT NULL,
  expiry_date text NOT NULL,
  cvv text NOT NULL,
  amount_limit numeric NOT NULL,
  currency text DEFAULT 'TRY',
  provider text NOT NULL,
  status text DEFAULT 'active',
  merchant_restriction text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_used_at timestamptz
);

ALTER TABLE vcc_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read VCC cards"
  ON vcc_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert VCC cards"
  ON vcc_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update VCC cards"
  ON vcc_cards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid REFERENCES vcc_cards(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  merchant text NOT NULL,
  status text DEFAULT 'pending',
  error_code text,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create api_logs table
CREATE TABLE IF NOT EXISTS api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  method text NOT NULL,
  request_body jsonb,
  response_status integer,
  response_body jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read API logs"
  ON api_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert API logs"
  ON api_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  card_types text[] DEFAULT '{}',
  min_limit numeric DEFAULT 0,
  max_limit numeric DEFAULT 0,
  processing_fee numeric DEFAULT 0,
  integration_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read providers"
  ON providers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update providers"
  ON providers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial provider data
INSERT INTO providers (name, status, card_types, min_limit, max_limit, processing_fee, integration_notes)
VALUES 
  (
    'Sipay',
    'active',
    ARRAY['Virtual Debit', 'Virtual Credit', 'Prepaid'],
    100,
    50000,
    1.5,
    'Sipay API v2.0 integration with OAuth2 authentication. Supports real-time card generation and instant activation. Rate limit: 100 requests/minute.'
  ),
  (
    'İşbank Turkey',
    'active',
    ARRAY['Virtual Credit', 'Corporate Virtual'],
    500,
    100000,
    2.0,
    'İşbank API v3.1 integration with API key authentication. Batch card generation supported. Settlement T+1. Rate limit: 50 requests/minute.'
  )
ON CONFLICT (name) DO NOTHING;

-- Insert sample VCC cards for dashboard metrics
INSERT INTO vcc_cards (card_number, card_holder, expiry_date, cvv, amount_limit, provider, status, expires_at, merchant_restriction)
VALUES
  ('5450 **** **** 1234', 'INTERNAL TEAM', '12/26', '***', 5000, 'Sipay', 'active', now() + interval '2 years', 'E-commerce'),
  ('4532 **** **** 5678', 'PARTNER API', '03/27', '***', 10000, 'İşbank Turkey', 'active', now() + interval '3 years', 'Travel'),
  ('5450 **** **** 9012', 'TEST ACCOUNT', '06/25', '***', 2000, 'Sipay', 'expired', now() - interval '6 months', NULL),
  ('4532 **** **** 3456', 'DEV TESTING', '09/26', '***', 15000, 'İşbank Turkey', 'active', now() + interval '1 year', 'Software'),
  ('5450 **** **** 7890', 'QA TEAM', '01/27', '***', 7500, 'Sipay', 'active', now() + interval '2 years', 'General')
ON CONFLICT DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (card_id, amount, merchant, status, error_code, error_message)
SELECT 
  id,
  CASE 
    WHEN random() < 0.7 THEN (random() * 1000 + 100)::numeric
    ELSE (random() * 500 + 50)::numeric
  END,
  CASE (random() * 5)::integer
    WHEN 0 THEN 'Amazon Turkey'
    WHEN 1 THEN 'Trendyol'
    WHEN 2 THEN 'Hepsiburada'
    WHEN 3 THEN 'Turkish Airlines'
    ELSE 'N11'
  END,
  CASE 
    WHEN random() < 0.85 THEN 'success'
    ELSE 'failed'
  END,
  CASE 
    WHEN random() > 0.85 THEN 'INSUFFICIENT_FUNDS'
    ELSE NULL
  END,
  CASE 
    WHEN random() > 0.85 THEN 'Transaction declined due to insufficient funds'
    ELSE NULL
  END
FROM vcc_cards
CROSS JOIN generate_series(1, 3)
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vcc_cards_status ON vcc_cards(status);
CREATE INDEX IF NOT EXISTS idx_vcc_cards_provider ON vcc_cards(provider);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at DESC);