# 🛒 Price Comparison Website

A full-stack **Price Comparison Website** that enables users to compare product prices across multiple e-commerce platforms. The application allows users to search for products, compare prices, save favourite products, and receive email notifications when product prices fall below their target price.

The project consists of three main modules:

- 🌐 Frontend Website
- 🐍 Python Price Scraper
- ☁️ Firebase Cloud Functions

---

# ✨ Features

## 👤 User Features

- Google Sign-In Authentication
- Product Search
- Browse Products by Category
- Product Details Page
- Save Favourite Products
- Set Price Alerts
- Responsive User Interface

---

## 🛍 Price Comparison

- Compare Amazon and Flipkart prices
- Display the lowest available price
- Product images
- Product descriptions
- Category filtering
- Real-time product data from Firebase

---

## 🐍 Python Price Scraper

The project includes a Python Selenium scraper that updates product prices stored in Firebase.

Features:

- Scrapes product prices from Amazon
- Scrapes product prices from Flipkart
- Updates Firebase Realtime Database
- Updates product timestamps
- Supports multiple product categories

> **Note:** The scraper is **run manually** whenever prices need to be refreshed.

---

## ☁️ Firebase Cloud Functions

Cloud Functions automatically monitor price changes in Firebase.

Features:

- Detects price drops
- Sends email notifications
- Checks user target prices
- Uses Firebase Realtime Database triggers

---

# 💻 Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Firebase Realtime Database
- Firebase Authentication
- Firebase Cloud Functions
- Node.js

## Web Scraping

- Python
- Selenium
- ChromeDriver
- WebDriver Manager

---

# 📂 Project Structure

```
Price-Comparison-Website
│
├── Frontend
│   ├── HTML
│   ├── CSS
│   ├── JavaScript
│   └── Images
│
├── Python-Scraper
│   ├── scraper.py
│   ├── requirements.txt
│   └── README.md
│
├── Firebase-Backend
│   ├── firebase.json
│   ├── .firebaserc
│   ├── functions
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── .eslintrc.js
│   │   └── .gitignore
│
├── Screenshots
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Price-Comparison-Website.git
```

---

## 2. Frontend Setup

Open the **Frontend** folder using Visual Studio Code or any web server.

---

## 3. Python Scraper Setup

Install the required Python packages.

```bash
pip install -r requirements.txt
```

Place your Firebase Admin SDK key (`firebase_key.json`) in the scraper directory.

Run the scraper:

```bash
python scraper.py
```

The scraper will:

- Fetch prices from Amazon and Flipkart
- Update Firebase Realtime Database
- Update the last refreshed timestamp

> **Note:** The scraper must be started manually whenever prices need to be updated.

---

## 4. Firebase Backend Setup

Navigate to the Firebase Functions folder.

```bash
cd Firebase-Backend/functions
```

Install Node.js dependencies.

```bash
npm install
```

Create environment variables for email notifications.

```
EMAIL=your-email@gmail.com
APP_PASSWORD=your-app-password
```

Login to Firebase.

```bash
firebase login
```

Initialize Firebase (only required the first time).

```bash
firebase init functions
```

Deploy the Cloud Functions.

```bash
firebase deploy --only functions
```

Once deployed, Firebase Cloud Functions automatically detect price drops and send email notifications to users whose target price has been reached.

---

# 📸 Screenshots

Add screenshots of:

- Login Page
- Home Page
- Product Categories
- Product Details
- Saved Products
- Price Alerts

Example:

```
Screenshots/
│
├── LoginPage.png
├── HomePage.png
├── ProductDetails.png
├── SavedProducts.png
└── PriceAlerts.png
```

---

# 🔒 Security

- Firebase Admin SDK keys are **not included**.
- Email credentials are stored using **environment variables**.
- Sensitive files are excluded using `.gitignore`.
- Passwords are managed using Firebase Authentication.

---

# 🚀 Future Improvements

- Automatic scheduled price scraping
- Support for additional e-commerce websites
- Price history charts
- AI-based product recommendations
- Wishlist sharing
- Browser extension
- Mobile responsive improvements
- Push notifications

---

# 📚 Learning Outcomes

This project helped in learning:

- Firebase Authentication
- Firebase Realtime Database
- Firebase Cloud Functions
- Python Selenium Web Scraping
- JavaScript DOM Manipulation
- Asynchronous Programming
- Full-Stack Web Development

---

# 👨‍💻 Author

**Shreyas Nagvekar**

B.Sc. Information Technology

Mumbai, India

---

## ⭐ If you found this project useful, consider giving it a star!
