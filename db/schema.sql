-- =========================================================
-- DATABASE: nutech_api
-- =========================================================

-- 1️⃣ USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image TEXT DEFAULT NULL,
    balance NUMERIC(15,2) DEFAULT 0 CHECK (balance >= 0),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ BANNERS TABLE
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ SERVICES TABLE
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_icon TEXT NOT NULL,
    service_tariff NUMERIC(15,2) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ TRANSACTIONS TABLE
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL
);

-- 5️⃣ SEED DEFAULT DATA

-- Insert sample banners
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner 1', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 2', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
('Banner 3', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- Insert sample services
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 50000),
('PAKET_DATA', 'Paket Data', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'https://ppob-nutech.onrender.com//public/dummy.jpg', 300000);
