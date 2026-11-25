-- Rename Paystack-specific columns to provider-agnostic names.
-- No real payment data exists yet, so this is a clean rename.

ALTER TABLE public.payments RENAME COLUMN paystack_ref TO payment_ref;
ALTER TABLE public.payments RENAME COLUMN paystack_txn_id TO provider_txn_id;
ALTER TABLE public.payments RENAME COLUMN amount_ngn TO amount;

ALTER TABLE public.payments
  ADD COLUMN provider TEXT NOT NULL DEFAULT 'flutterwave';

DROP INDEX IF EXISTS idx_payments_paystack_ref;
CREATE INDEX idx_payments_payment_ref ON public.payments (payment_ref);
