-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)

ALTER TABLE screenings
  ADD COLUMN IF NOT EXISTS report_url TEXT;
