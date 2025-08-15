-- Remove Stripe-specific fields from database schema
ALTER TABLE users DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE orders DROP COLUMN IF EXISTS provider;

-- Add YooKassa-specific fields
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS yookassa_payment_id VARCHAR(255);

-- Update existing orders to remove provider references
UPDATE orders SET provider = NULL WHERE provider = 'stripe';

-- Create index for YooKassa payment lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_yookassa_payment_id ON subscriptions(yookassa_payment_id);
