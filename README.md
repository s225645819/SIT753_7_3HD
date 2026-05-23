# SIT703 — Memory & Volatile Data Forensics
## Code Submission — README
**Analyst:** Pratiyush  
**Unit:** SIT703 Computer Forensics and Investigations  
**Task:** 1.2HD Part 2

## Scripts

| File | Purpose |
|------|---------|
| memory_forensics_pipeline.py | Orchestrates full Volatility 3 analysis pipeline |
| suspicious_process_detector.py | Detects DKOM-hidden processes, scores suspicion 0-100 |
| network_connection_analyzer.py | Classifies network connections by threat level |

## Dependencies
pip install -r requirements.txt

## requirements.txt
volatility3>=2.4.0
python-dateutil>=2.8.0

## Usage
# Step 1 — Run pipeline
python3 memory_forensics_pipeline.py --dump memdump.raw --output output/

# Step 2 — Detect suspicious processes
python3 suspicious_process_detector.py \
  --pslist output/pslist.txt \
  --psscan output/psscan.txt \
  --netscan output/netscan.txt \
  --output forensic_report.json

# Step 3 — Analyze network connections
python3 network_connection_analyzer.py \
  --netscan output/netscan.txt \
  --output network_report.json

## Environment
- Ubuntu 22.04 LTS
- Python 3.8
- Volatility 3 v2.28.1
- WinPmem mini x64 rc2
