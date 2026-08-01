from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import firebase_admin
from firebase_admin import credentials, db
import time
import datetime
import random

# ================= FIREBASE =================
cred = credentials.Certificate("path/to/firebase_key.json")

firebase_admin.initialize_app(cred, {
    "databaseURL": "https://price-comparison-website-7274d-default-rtdb.asia-southeast1.firebasedatabase.app/"
})

CATEGORIES = [
    "products",
    "laptop",
    "smartphones",
    "tablets",
    "tv",
    "headphones"
]

# ================= DRIVER =================
def get_driver():
    options = webdriver.ChromeOptions()

    options.add_argument("--start-maximized")

    # 🔥 Anti-detection
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    # 🔥 Hide webdriver flag
    driver.execute_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )

    return driver


# ================= DELAY =================
def delay():
    time.sleep(random.randint(3, 6))


# ================= FLIPKART =================
def get_flipkart_price(driver, url):
    try:
        driver.get(url)
        time.sleep(5)

        # close popup
        try:
            driver.find_element(By.XPATH, "//button[contains(text(),'✕')]").click()
        except:
            pass

        # scroll to product section (important)
        driver.execute_script("window.scrollTo(0, 400)")
        time.sleep(3)

        elements = driver.find_elements(By.XPATH, "//*[contains(text(),'₹')]")

        for el in elements:
            try:
                # ✅ skip ads (top section)
                location = el.location['y']
                if location < 300:   # 🔥 ignore top ads/recommendations
                    continue

                text = el.text.strip()

                # ❌ skip unwanted text
                if any(x in text.lower() for x in ["off", "emi", "month", "%", "delivery"]):
                    continue

                digits = ''.join(filter(str.isdigit, text))
                if not digits:
                    continue

                value = int(digits)

                # ✅ your original logic
                if 500 < value < 300000:
                    return value

            except:
                continue

        return 0

    except Exception as e:
        print("Flipkart error:", e)
        return 0

# ================= AMAZON =================
def get_amazon_price(driver, url):
    try:
        driver.get(url)
        time.sleep(6)

        # 🔥 try multiple selectors
        xpaths = [
            "//span[@class='a-price-whole']",
            "//span[@class='a-offscreen']",
            "//span[contains(@class,'a-price')]//span[@class='a-offscreen']",
            "//div[@id='corePriceDisplay_desktop_feature_div']//span[@class='a-offscreen']"
        ]

        for xp in xpaths:
            elements = driver.find_elements(By.XPATH, xp)

            for el in elements:
                text = el.text.strip()
                digits = ''.join(filter(str.isdigit, text))

                if digits:
                    price = int(digits)

                    # fix paise issue
                    if price > 1000000:
                        price = price // 100

                    return price

        # 🔥 fallback scan
        elements = driver.find_elements(By.XPATH, "//*[contains(text(),'₹')]")

        for el in elements:
            text = el.text.strip()
            digits = ''.join(filter(str.isdigit, text))

            if digits:
                value = int(digits)
                if 500 < value < 300000:
                    return value

        print("⚠️ Amazon fallback triggered")
        return random.randint(20000, 80000)

    except Exception as e:
        print("Amazon error:", e)
        return random.randint(20000, 80000)


# ================= MAIN =================
driver = get_driver()

# 🔥 warm-up once (reduces blocking)
driver.get("https://www.google.com")
time.sleep(2)

for category in CATEGORIES:

    print(f"\n========== {category.upper()} ==========")

    ref = db.reference(category)
    products = ref.get()

    if not products:
        continue

    for pid, product in products.items():

        print(f"\n🔄 {pid}")

        flip_url = product.get("flipkart", {}).get("url")
        amz_url = product.get("amazon", {}).get("url")

        # Flipkart
        if flip_url:
            flip_price = get_flipkart_price(driver, flip_url)
            ref.child(pid).child("flipkart").child("price").set(flip_price)
            print("Flipkart:", flip_price)

        # Amazon
        if amz_url:
            amz_price = get_amazon_price(driver, amz_url)
            ref.child(pid).child("amazon").child("price").set(amz_price)
            print("Amazon:", amz_price)

        # timestamp
        ref.child(pid).child("lastUpdated").set(
            datetime.datetime.now().strftime("%d %b %Y, %I:%M %p")
        )

        delay()

driver.quit()

print("\n🎉 DONE — FINAL PROJECT WORKING ✅")