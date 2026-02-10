# import csv
# import os
# from datetime import datetime
# from pymongo import MongoClient
# from dotenv import load_dotenv

# # =====================
# # ENV + DB
# # =====================
# load_dotenv()

# # MONGO_URI="mongodb://backe742ndbotscl_db_user:aWGw7oncDweTvyr7@ac-fzfv9vr-shard-00-00.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-01.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-02.smhbg2d.mongodb.net:27017/test?tls=true&replicaSet=atlas-fzfv9vr-shard-0&authSource=admin&retryWrites=true&w=majority"

# MONGO_URI="mongodb://backe742ndbotscl_db_user:aWGw7oncDweTvyr7@ac-fzfv9vr-shard-00-00.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-01.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-02.smhbg2d.mongodb.net:27017/test?tls=true&authSource=admin&retryWrites=true&w=majority"


# # MONGO_URI = "mongodb://backe742ndbotscl_db_user:aWGw7oncDweTvyr7@ac-fzfv9vr-shard-00-00.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-01.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-02.smhbg2d.mongodb.net:27017/test?ssl=true&replicaSet=atlas-fzfv9vr-shard-0&authSource=admin"


# client = MongoClient(
#     MONGO_URI,
#     serverSelectionTimeoutMS=5000,
#     socketTimeoutMS=4500000,
#     maxPoolSize=10
# )

# db = client.get_default_database()
# properties = db["properties"]

# print("✅ MongoDB connected")
# print("📊 Database:", db.name)

# # =====================
# # HELPERS
# # =====================
# ALPHABETS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")




# def next_property_code(last_code: str | None) -> str:
#     if not last_code or len(last_code) != 4:
#         return "00AA"

#     num = int(last_code[:2])
#     i1 = ALPHABETS.index(last_code[2])
#     i2 = ALPHABETS.index(last_code[3])

#     i2 += 1
#     if i2 == 26:
#         i2 = 0
#         i1 += 1
#     if i1 == 26:
#         i1 = 0
#         num += 1

#     return f"{num:02d}{ALPHABETS[i1]}{ALPHABETS[i2]}"


# def clean(v):
#     if v is None:
#         return None
#     v = str(v).strip()
#     return v if v else None


# def build_property_name(bhk, sector, city):
#     parts = []
#     if bhk:
#         parts.append(f"{bhk} BHK")
#     parts.append("Builder Floor")

#     loc = []
#     if sector:
#         loc.append(f"Sector {sector}")
#     if city:
#         loc.append(city)

#     if loc:
#         parts.append(" ".join(loc))

#     return ", ".join(parts)
  
  

# from datetime import datetime

# def parse_date(value):
#     if not value:
#         return None

#     value = value.strip()

#     for fmt in ("%d-%b-%Y", "%d-%B-%Y", "%Y-%m-%d"):
#         try:
#             return datetime.strptime(value, fmt)
#         except ValueError:
#             continue

#     return None
  


# # =====================
# # GET LAST PROPERTY CODE
# # =====================
# last_doc = properties.find_one(
#     {"propertyCode": {"$exists": True}},
#     sort=[("createdAt", -1)]
# )

# current_code = last_doc.get("propertyCode") if last_doc else None

# # =====================
# # CSV IMPORT
# # =====================
# records = []

# with open("floor.csv", newline="", encoding="utf-8") as f:
#     reader = csv.DictReader(f)

#     for row in reader:
#         current_code = next_property_code(current_code)

#         bhk = clean(row.get("BHK"))
#         sector = clean(row.get("SEC"))
#         city = clean(row.get("CITY"))

#         record = {
#             # =====================
#             # AUTO
#             # =====================
#             "propertyCode": current_code,
#             "propertyName": build_property_name(bhk, sector, city),

#             # =====================
#             # FIXED
#             # =====================
#             "propertyType": "builder_floor",
#             "category": "residential",

#             # =====================
#             # BASIC
#             # =====================
#             "propertyTitle": clean(row.get("TITLE")),
#             "bhk": bhk,
#             "layout": clean(row.get("AREA")),
#             "floorInfo": clean(row.get("FLR")),

#             # =====================
#             # DATE
#             # =====================
#             "propertyAddedDate": parse_date(row.get("DATE")),


#             # =====================
#             # PRICING
#             # =====================
#             "demand": clean(row.get("ASKING")),
#             "netPrice": clean(row.get("NET PRICE")),

#             # =====================
#             # LOCATION
#             # =====================
#             "city": city,
#             "sector": sector,
#             "block": clean(row.get("BLK")),
#             "pocket": clean(row.get("PKT")),
#             "road": clean(row.get("ROAD")),
#             "address": clean(row.get("NUM")),

#             # =====================
#             # FACING
#             # =====================
#             "facing": clean(row.get("FACE")).lower() if clean(row.get("FACE")) else None,

#             # =====================
#             # STATUS
#             # =====================
#             "status": "active",
#             "availabilityStatus": "available",
#             "availabilityRemark": clean(row.get("STATUS")),
#             "comments": clean(row.get("STATUS.1")),
#             "legalStatus": clean(row.get("STATUS.2")),

#             # =====================
#             # DEALER
#             # =====================
#             "dealerType": clean(row.get("THROUGH")).lower() if clean(row.get("THROUGH")) else "dealer",
#             "dealerSource": clean(row.get("OFFICE NAME")),
#             "dealerName": clean(row.get("NAME")),
#             "dealerMobile": clean(row.get("MOBILE")),

#             # =====================
#             # EXTRA
#             # =====================
#             "customFields": {
#                 "genCor": clean(row.get("GEN/COR")),
#                 "unnamed8": clean(row.get("Unnamed: 8")),
#                 "alternateMobile": clean(row.get("MOBILE.1")),
#                 "blkPkt": clean(row.get("BLK PKT")),
#                 "pocketAlt": clean(row.get("POCKET")),
#                 "plotNoAlt": clean(row.get("NO")),
#                 "sectorAlt": clean(row.get("SEC.1")),
#             },
#         }

#         records.append(record)

# # =====================
# # INSERT
# # =====================
# if records:
#     result = properties.insert_many(records)
#     print(f"✅ Imported {len(result.inserted_ids)} properties")
# else:
#     print("⚠️ No records found")

# client.close()


import csv
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv
import sys
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sys.stdout.reconfigure(encoding="utf-8")


# =====================
# ENV + DB
# =====================
load_dotenv()

MONGO_URI = "mongodb://backe742ndbotscl_db_user:aWGw7oncDweTvyr7@ac-fzfv9vr-shard-00-00.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-01.smhbg2d.mongodb.net:27017,ac-fzfv9vr-shard-00-02.smhbg2d.mongodb.net:27017/test?tls=true&authSource=admin&retryWrites=true&w=majority"

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client.get_default_database()
properties = db["properties"]

print("✅ MongoDB connected")

# =====================
# RESET COLLECTION
# =====================
properties.delete_many({})
print("🧹 All existing properties deleted")

# =====================
# HELPERS
# =====================
ALPHABETS = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

def next_property_code(last_code):
    if not last_code or len(last_code) != 4:
        return "00AA"

    num = int(last_code[:2])
    i1 = ALPHABETS.index(last_code[2])
    i2 = ALPHABETS.index(last_code[3])

    i2 += 1
    if i2 == 26:
        i2 = 0
        i1 += 1
    if i1 == 26:
        i1 = 0
        num += 1

    return f"{num:02d}{ALPHABETS[i1]}{ALPHABETS[i2]}"

def clean(v):
    if v is None:
        return None
    v = str(v).strip()
    return v if v else None

def parse_date(v):
    if not v:
        return None
    for fmt in ("%d-%b-%Y", "%d-%B-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(v.strip(), fmt)
        except:
            pass
    return None

def normalize_bhk(v):
    if not v:
        return None
    v = v.upper()
    if "ONE" in v: return 1
    if "TWO" in v or "2" in v: return 2
    if "THREE" in v or "3" in v: return 3
    if "FOUR" in v or "4" in v: return 4
    if "FIVE" in v or "5" in v: return 5
    if "SIX" in v or "6" in v: return 6
    return None

def build_property_name(bhk, prop_type, sector, city):
    parts = []
    if bhk:
        parts.append(str(bhk))
    parts.append(prop_type.replace("_", " ").title())

    loc = []
    if sector:
        loc.append(f"Sector {sector}")
    if city:
        loc.append(city)

    if loc:
        parts.append(" ".join(loc))

    return ", ".join(parts)

# =====================
# IMPORT CONFIG
# =====================
FILES = [
    ("floor.csv", "builder_floor"),
    ("flat.csv", "flat"),
    ("kothi.csv", "kothi"),
]

# =====================
# START IMPORT
# =====================
current_code = None
records = []

for file_name, property_type in FILES:
    print(f"📥 Importing {file_name}")

    full_path = os.path.join(BASE_DIR, file_name)

    with open(full_path, newline="", encoding="utf-8") as f:

        reader = csv.DictReader(f)

        for row in reader:
            current_code = next_property_code(current_code)

            raw_bhk = clean(row.get("BHK"))
            bhk_number = normalize_bhk(raw_bhk)

            sector = clean(row.get("SEC") or row.get("SEC.1"))
            city = clean(row.get("CITY"))

            record = {
                # =====================
                # IDENTIFICATION
                # =====================
                "propertyCode": current_code,
                "propertyType": property_type,
                "category": "residential",
                "propertyName": build_property_name(
                    raw_bhk, property_type, sector, city
                ),

                # =====================
                # CONFIGURATION
                # =====================
                "bhkRaw": raw_bhk,
                "bhk": bhk_number,

                # =====================
                # DATE
                # =====================
                "propertyAddedDate": parse_date(row.get("DATE")),

                # =====================
                # PRICING
                # =====================
                "pricing": {
                    "askingRaw": clean(row.get("ASKING")),
                    "netRaw": clean(row.get("NET PRICE")),
                },

                # =====================
                # LOCATION
                # =====================
                "location": {
                    "city": city,
                    "sector": sector,
                    "block": clean(row.get("BLK") or row.get("B")),
                    "pocket": clean(row.get("PKT") or row.get("P")),
                    "plotNumber": clean(row.get("NUM") or row.get("NO")),
                    "road": clean(row.get("ROAD")),
                },

                # =====================
                # STATUS
                # =====================
                "status": "active",
                "availabilityStatus": "available",
                "remarks": {
                    "primary": clean(row.get("STATUS")),
                    "secondary": clean(row.get("STATUS.1")),
                    "legal": clean(row.get("STATUS.2")),
                },

                # =====================
                # DEALER
                # =====================
                "dealer": {
                    "type": clean(row.get("THROUGH")),
                    "office": clean(row.get("OFFICE NAME")),
                    "name": clean(row.get("NAME")),
                    "mobile": clean(row.get("MOBILE")),
                    "alternateMobile": clean(row.get("MOBILE.1")),
                },

                # =====================
                # RAW BACKUP (IMPORTANT)
                # =====================
                "customFields": {k: clean(v) for k, v in row.items()},
                "createdAt": datetime.utcnow(),
            }

            records.append(record)

# =====================
# INSERT
# =====================
if records:
    properties.insert_many(records)
    print(f"✅ Imported {len(records)} properties")
else:
    print("⚠️ No records found")

client.close()
