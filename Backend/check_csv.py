import csv
import os

FILE = "floor.csv"

print("📁 Current folder:", os.getcwd())

if not os.path.exists(FILE):
    print("❌ CSV file not found:", FILE)
    exit(1)

print("📄 CSV file size (KB):", round(os.path.getsize(FILE) / 1024, 2))

# Try common encodings + delimiters
tests = [
    ("utf-8", ","),
    ("utf-8-sig", ","),
    ("utf-8", ";"),
    ("utf-8-sig", ";"),
]

for enc, delim in tests:
    try:
        with open(FILE, encoding=enc, newline="") as f:
            reader = csv.DictReader(f, delimiter=delim)
            rows = list(reader)

        print(f"✅ encoding={enc}, delimiter='{delim}' → rows read: {len(rows)}")
    except Exception as e:
        print(f"❌ encoding={enc}, delimiter='{delim}' → {e}")

# Show first header line
with open(FILE, encoding="utf-8-sig") as f:
    print("\n🧾 First line of CSV:")
    print(f.readline())
