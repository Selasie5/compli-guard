-- Update the check constraint to allow 'reviewed' status
ALTER TABLE scan_results DROP CONSTRAINT IF EXISTS scan_results_status_check;

ALTER TABLE scan_results 
ADD CONSTRAINT scan_results_status_check 
CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed'));