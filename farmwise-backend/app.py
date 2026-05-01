from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import sqlite3 
import json
import urllib3
import google.generativeai as genai
import os

# Suppress the SSL warning for local development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)

# --- DATABASE HELPER FUNCTION ---
def get_db_connection():
    conn = sqlite3.connect('farmwise.db')
    conn.row_factory = sqlite3.Row # Formats data nicely as a dictionary for React
    return conn

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "FarmWise Backend is live!"})

# --- SMART LAND RECOMMENDATION ENGINE ---
def generate_smart_recommendations(soil, drainage):
    recs = []
    if soil == 'black_soil': recs.append("Ideal for moisture retention. Great for Cotton or Soybean.")
    elif soil == 'alluvial': recs.append("Highly fertile. Excellent for Wheat and Rice.")
    elif soil == 'desert_soil': recs.append("Requires frequent drip irrigation. Consider Pearl Millet.")
    elif soil == 'red_soil': recs.append("Add organic compost to improve water holding capacity.")
    elif soil == 'mountain_soil': recs.append("Perfect for orchards. Prevent soil erosion with terracing.")
    elif soil == 'laterite': recs.append("Add fertilizers heavily as this soil lacks primary nutrients.")
    
    if drainage == 'poor': recs.append("URGENT: Add gypsum or create channels to improve drainage.")
    elif drainage == 'excellent': recs.append("Use mulching to prevent water loss.")
    
    if not recs: recs.append("Standard NPK fertilizer application recommended.")
    return recs

# --- WEATHER API ROUTES ---
def get_condition(wmo_code):
    if wmo_code == 0: return "Sunny"
    elif 1 <= wmo_code <= 3: return "Partly Cloudy"
    elif 45 <= wmo_code <= 48: return "Foggy"
    elif 51 <= wmo_code <= 67: return "Rainy"
    elif 71 <= wmo_code <= 77: return "Snowy"
    elif 80 <= wmo_code <= 82: return "Rainy"
    elif 95 <= wmo_code <= 99: return "Stormy"
    return "Sunny"

@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('location', 'Ahmedabad')
    
    try:
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_data = requests.get(geo_url, verify=False).json()
        
        if not geo_data.get('results'):
            return jsonify({"error": f"Could not find a place named '{city}'."}), 404
            
        lat = geo_data['results'][0]['latitude']
        lon = geo_data['results'][0]['longitude']
        actual_city_name = geo_data['results'][0]['name']
        
        weather_url = (
            f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
            f"&timezone=auto"
        )
        weather_data = requests.get(weather_url, verify=False).json()
        
        current = weather_data['current']
        daily = weather_data['daily']
        
        alerts = []
        if current['temperature_2m'] >= 38: alerts.append("High Heat Alert: Protect heat-sensitive crops.")
        if current['weather_code'] in [51, 61, 63, 65, 80]: alerts.append("Rain Expected: Delay pesticide spraying.")
        if current['weather_code'] in [95, 96, 99]: alerts.append("Thunderstorm Warning: Secure outdoor equipment.")
        if not alerts: alerts.append("Conditions are optimal for standard farming operations today.")

        forecast_7_days = []
        for i in range(7):
            forecast_7_days.append({
                "date": daily['time'][i],
                "condition": get_condition(daily['weather_code'][i]),
                "max_temp": round(daily['temperature_2m_max'][i]),
                "min_temp": round(daily['temperature_2m_min'][i]),
                "rainfall_chance": daily['precipitation_probability_max'][i]
            })
        
        return jsonify({
            "temperature": round(current['temperature_2m']),
            "condition": get_condition(current['weather_code']),
            "humidity": current['relative_humidity_2m'],
            "wind_speed": current['wind_speed_10m'],
            "rainfall": current.get('precipitation', 0), 
            "location": actual_city_name,
            "forecast_7_days": forecast_7_days,
            "alerts": alerts
        })
        
    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"error": "Failed to fetch weather data"}), 500

# --- LANDS DATABASE ROUTES ---
@app.route('/api/lands', methods=['GET'])
def get_lands():
    conn = get_db_connection()
    lands = conn.execute('SELECT * FROM lands ORDER BY id DESC').fetchall()
    conn.close()
    
    lands_list = []
    for land in lands:
        land_dict = dict(land)
        try:
            land_dict['water_source'] = json.loads(land_dict['water_source']) if land_dict['water_source'] else []
            land_dict['recommendations'] = json.loads(land_dict['recommendations']) if land_dict['recommendations'] else []
        except:
            land_dict['water_source'] = []
            land_dict['recommendations'] = []
            
        lands_list.append(land_dict)
        
    return jsonify(lands_list)

@app.route('/api/lands', methods=['POST'])
def add_land():
    data = request.json
    conn = get_db_connection()
    
    water_src = json.dumps(data.get('water_source', []))
    
    recs_list = data.get('recommendations', [])
    if not recs_list: 
        recs_list = generate_smart_recommendations(data.get('soil_type'), data.get('drainage'))
    recs = json.dumps(recs_list)
    
    conn.execute('''
        INSERT INTO lands (
            farm_name, location, size_acres, soil_type, 
            ph_level, organic_matter, drainage, topography, water_source, recommendations
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('farm_name'), data.get('location'), data.get('size_acres'), data.get('soil_type'),
        data.get('ph_level'), data.get('organic_matter'), data.get('drainage'), data.get('topography'),
        water_src, recs
    ))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "message": "Land added successfully!"}), 201

@app.route('/api/lands/<int:id>', methods=['PUT'])
def update_land(id):
    data = request.json
    conn = get_db_connection()
    
    water_src = json.dumps(data.get('water_source', []))
    
    recs_list = data.get('recommendations', [])
    if not recs_list: 
        recs_list = generate_smart_recommendations(data.get('soil_type'), data.get('drainage'))
    recs = json.dumps(recs_list)
    
    conn.execute('''
        UPDATE lands 
        SET farm_name = ?, location = ?, size_acres = ?, soil_type = ?, 
            ph_level = ?, organic_matter = ?, drainage = ?, topography = ?, 
            water_source = ?, recommendations = ?
        WHERE id = ?
    ''', (
        data.get('farm_name'), data.get('location'), data.get('size_acres'), data.get('soil_type'),
        data.get('ph_level'), data.get('organic_matter'), data.get('drainage'), data.get('topography'),
        water_src, recs, id
    ))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "message": "Land updated successfully!"}), 200

@app.route('/api/lands/<int:id>', methods=['DELETE'])
def delete_land(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM lands WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "message": "Land deleted successfully!"}), 200


# --- CROP RECOMMENDATIONS ROUTE ---
@app.route('/api/crops', methods=['GET'])
def get_crops():
    conn = get_db_connection()
    crops = conn.execute('SELECT * FROM crops').fetchall()
    conn.close()
    return jsonify([dict(crop) for crop in crops])


# --- MARKET PRICES ROUTE ---
@app.route('/api/market-prices', methods=['GET'])
def get_market_prices():
    conn = get_db_connection()
    prices = conn.execute('SELECT * FROM market_prices').fetchall()
    conn.close()
    return jsonify([dict(price) for price in prices])


# --- REAL BACKEND AUTHENTICATION ROUTES ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    conn = get_db_connection()
    
    conn.execute('''CREATE TABLE IF NOT EXISTS users 
                    (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)''')
    
    user = conn.execute('SELECT * FROM users WHERE email = ?', (data.get('email'),)).fetchone()
    if user:
        conn.close()
        return jsonify({"error": "An account with this email already exists"}), 400
        
    conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                 (data.get('name'), data.get('email'), data.get('password')))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Account created!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    conn = get_db_connection()
    
    try:
        user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', 
                            (data.get('email'), data.get('password'))).fetchone()
    except sqlite3.OperationalError:
        conn.close()
        return jsonify({"error": "No users registered yet. Please sign up first."}), 404
        
    conn.close()
    
    if user:
        return jsonify({"status": "success", "user": {"name": user['name'], "email": user['email']}}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# --- DYNAMIC MULTI-LINGUAL AI CHATBOT ROUTE ---
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    lang = data.get('language', 'en')
    msg = data.get('message', '')
    
    lang_map = {'en': 'English', 'hi': 'Hindi', 'gu': 'Gujarati'}
    full_lang = lang_map.get(lang, 'English')
    
    try:
        # This tells Python to go get the secret key you saved in Render
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        
        # Using the exact model that just worked in your test!
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are an expert, friendly agricultural assistant named FarmWise. 
        Answer the following question about farming, crops, soil, or weather concisely. 
        You MUST reply entirely in {full_lang}. 
        User Question: {msg}
        """
        
        response = model.generate_content(prompt)
        reply_text = response.text
        
    except Exception as e:
        print(f"AI Brain Error: {e}")
        if lang == 'gu': 
            reply_text = "ક્ષમા કરશો, અત્યારે મારું સર્વર વ્યસ્ત છે. (API Key Error)"
        elif lang == 'hi': 
            reply_text = "क्षमा करें, मेरा सर्वर अभी व्यस्त है। (API Key Error)"
        else: 
            reply_text = "I'm sorry, my AI brain is disconnected. Please check the API key in app.py!"
            
    return jsonify({"reply": reply_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)