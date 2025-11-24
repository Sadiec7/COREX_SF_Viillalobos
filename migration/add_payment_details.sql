-- Migration: Add payment detail columns to Recibo table
-- Date: 2025-11-23
-- Description: Adds metodo_pago, referencia_pago, and notas columns to support enhanced payment tracking

-- Add new columns to Recibo table
ALTER TABLE Recibo ADD COLUMN metodo_pago VARCHAR(50) NULL;
ALTER TABLE Recibo ADD COLUMN referencia_pago VARCHAR(100) NULL;
ALTER TABLE Recibo ADD COLUMN notas TEXT NULL;

-- Create index for payment method searches (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_recibo_metodo_pago ON Recibo(metodo_pago);
