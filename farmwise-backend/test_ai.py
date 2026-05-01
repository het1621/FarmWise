import importlib

# 1. PUT YOUR REAL API KEY HERE
API_KEY = "AIzaSyAOjwooF0Moy9H1v_STaG0SpbRwBZOubck"

print("Starting AI Test...")

try:
    genai = importlib.import_module("google.generativeai")

    # 2. Connect to Google
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    print("Connecting to Google's servers...")
    
    # 3. Ask it a simple question
    response = model.generate_content("Say the exact words: 'Hello, the API is working!'")
    
    print("\n✅ SUCCESS! The AI replied:")
    print("---------------------------------")
    print(response.text)
    print("---------------------------------")

except Exception as e:
    print("\n❌ FAILED! The connection was blocked.")
    print("Here is the EXACT reason why:")
    print("---------------------------------")
    print(e)
    print("---------------------------------")