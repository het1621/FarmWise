import sqlite3
import json
from datetime import datetime

def init_db():
    conn = sqlite3.connect('farmwise.db')
    cursor = conn.cursor()

    # 1. Demolish old tables to start fresh
    cursor.execute('DROP TABLE IF EXISTS lands')
    cursor.execute('DROP TABLE IF EXISTS crops')
    cursor.execute('DROP TABLE IF EXISTS market_prices')

    # 2. Build the Lands Table
    cursor.execute('''
        CREATE TABLE lands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            farm_name TEXT, location TEXT, size_acres REAL, soil_type TEXT,
            ph_level REAL, organic_matter REAL, drainage TEXT, topography TEXT,
            water_source TEXT, recommendations TEXT
        )
    ''')

    # 3. Build the Upgraded Crops Table
    cursor.execute('''
        CREATE TABLE crops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crop_name TEXT, category TEXT, season TEXT, 
            profit_potential TEXT, water_requirement TEXT, growing_period INTEGER, 
            expected_yield TEXT, market_price_range TEXT, suitable_soil TEXT
        )
    ''')

    # 4. Build the Upgraded Market Prices Table
    cursor.execute('''
        CREATE TABLE market_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT, category TEXT, current_price INTEGER, unit TEXT, 
            price_trend TEXT, market_location TEXT, seasonal_low INTEGER, 
            seasonal_high INTEGER, last_updated TEXT
        )
    ''')

    # --- INJECT MASSIVE DUMMY DATA ---
    today = datetime.now().isoformat()

    # Add Diverse Lands
    dummy_water = json.dumps(["canal", "borewell"])
    dummy_recs = json.dumps(["Add organic compost", "Ensure proper drainage"])
    lands_data = [
        ('Main Valley Plot', 'Ahmedabad', 12.5, 'alluvial', 6.8, 2.5, 'good', 'flat', dummy_water, dummy_recs),
        ('Dry Ridge Farm', 'Kutch', 25.0, 'desert_soil', 7.5, 1.0, 'excellent', 'gently_sloped', dummy_water, dummy_recs),
        ('Black Cotton Field', 'Surat', 18.0, 'black_soil', 6.5, 3.0, 'moderate', 'flat', dummy_water, dummy_recs),
        ('Highland Orchard', 'Saputara', 8.5, 'mountain_soil', 5.8, 4.0, 'good', 'hilly', dummy_water, dummy_recs)
    ]
    cursor.executemany('INSERT INTO lands (farm_name, location, size_acres, soil_type, ph_level, organic_matter, drainage, topography, water_source, recommendations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', lands_data)

    # Add Diverse Crops
    crops_data = [
        ('Premium Wheat', 'cereals', 'rabi', 'high', 'medium', 120, '45 Quintals/Acre', '₹2,200 - ₹2,500/Q', json.dumps(['alluvial', 'black_soil'])),
        ('Organic Cotton', 'cash_crops', 'kharif', 'very_high', 'medium', 160, '12 Quintals/Acre', '₹7,000 - ₹8,200/Q', json.dumps(['black_soil'])),
        ('Soybean', 'pulses', 'kharif', 'medium', 'medium', 100, '18 Quintals/Acre', '₹4,000 - ₹4,500/Q', json.dumps(['alluvial', 'black_soil', 'red_soil'])),
        ('Basmati Rice', 'cereals', 'kharif', 'high', 'high', 140, '50 Quintals/Acre', '₹3,500 - ₹4,200/Q', json.dumps(['alluvial'])),
        ('Pearl Millet (Bajra)', 'cereals', 'kharif', 'medium', 'low', 80, '25 Quintals/Acre', '₹2,000 - ₹2,300/Q', json.dumps(['desert_soil', 'red_soil'])),
        ('Tomato', 'vegetables', 'all', 'high', 'medium', 90, '150 Quintals/Acre', '₹1,500 - ₹3,000/Q', json.dumps(['alluvial', 'red_soil', 'laterite'])),
        ('Onion', 'vegetables', 'rabi', 'high', 'low', 110, '120 Quintals/Acre', '₹1,200 - ₹3,500/Q', json.dumps(['alluvial', 'red_soil'])),
        ('Apple', 'fruits', 'rabi', 'very_high', 'medium', 200, '80 Quintals/Acre', '₹6,000 - ₹10,000/Q', json.dumps(['mountain_soil'])),
        ('Mango (Alphonso)', 'fruits', 'summer', 'very_high', 'low', 150, '60 Quintals/Acre', '₹5,000 - ₹12,000/Q', json.dumps(['laterite', 'alluvial', 'red_soil'])),
        ('Groundnut', 'cash_crops', 'kharif', 'high', 'low', 110, '20 Quintals/Acre', '₹5,500 - ₹6,500/Q', json.dumps(['red_soil', 'desert_soil', 'black_soil'])),
        ('Tea', 'cash_crops', 'all', 'very_high', 'high', 365, '25 Quintals/Acre', '₹15,000 - ₹25,000/Q', json.dumps(['mountain_soil', 'laterite'])),
        ('Mustard', 'cash_crops', 'rabi', 'medium', 'low', 110, '15 Quintals/Acre', '₹5,000 - ₹6,000/Q', json.dumps(['alluvial', 'desert_soil']))
    ]
    cursor.executemany('INSERT INTO crops (crop_name, category, season, profit_potential, water_requirement, growing_period, expected_yield, market_price_range, suitable_soil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', crops_data)

    # Add Diverse Market Prices
    market_data = [
        ('Wheat (Lokwan)', 'grains', 2400, 'Quintal', 'increasing', 'Ahmedabad APMC', 2100, 2600, today),
        ('Cotton (Long Staple)', 'cash_crop', 7500, 'Quintal', 'increasing', 'Surat APMC', 6500, 8200, today),
        ('Onion (Red)', 'vegetables', 1800, 'Quintal', 'decreasing', 'Nashik APMC', 1200, 3500, today),
        ('Tomato (Hybrid)', 'vegetables', 2200, 'Quintal', 'stable', 'Pune APMC', 1500, 4000, today),
        ('Basmati Rice', 'grains', 3800, 'Quintal', 'increasing', 'Karnal APMC', 3200, 4200, today),
        ('Mustard Seed', 'seeds', 5200, 'Quintal', 'stable', 'Jaipur APMC', 4800, 5600, today),
        ('Soybean', 'grains', 4200, 'Quintal', 'increasing', 'Indore APMC', 3800, 4600, today),
        ('Mango (Alphonso)', 'fruits', 8500, 'Quintal', 'decreasing', 'Ratnagiri APMC', 6000, 12000, today),
        ('Potato', 'vegetables', 1300, 'Quintal', 'stable', 'Agra APMC', 900, 1600, today),
        ('Groundnut', 'seeds', 6100, 'Quintal', 'increasing', 'Rajkot APMC', 5500, 6800, today),
        ('Tea Leaves', 'cash_crop', 18000, 'Quintal', 'stable', 'Assam Tea Board', 15000, 22000, today),
        ('Pearl Millet (Bajra)', 'grains', 2150, 'Quintal', 'stable', 'Jodhpur APMC', 1900, 2400, today)
    ]
    cursor.executemany('INSERT INTO market_prices (item_name, category, current_price, unit, price_trend, market_location, seasonal_low, seasonal_high, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', market_data)

    conn.commit()
    conn.close()
    print("✅ HUGE Database (Lands, Crops, Markets) built and ready!")

if __name__ == '__main__':
    init_db()