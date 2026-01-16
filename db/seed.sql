INSERT INTO phones (id, brand, model, price, camera_mp, has_ois, battery_mah, charging_watts, size_category, os, rating) VALUES
('p1', 'Samsung', 'Galaxy S24', 79999, 50, true, 4000, 25, 'compact', 'Android 14', 4.5),
('p2', 'Samsung', 'Galaxy S24 Ultra', 129999, 200, true, 5000, 45, 'large', 'Android 14', 4.8),
('p3', 'Google', 'Pixel 8', 75999, 50, true, 4575, 27, 'compact', 'Android 14', 4.4),
('p4', 'Google', 'Pixel 8 Pro', 106999, 50, true, 5050, 30, 'large', 'Android 14', 4.6),
('p5', 'Apple', 'iPhone 15', 79900, 48, true, 3349, 20, 'compact', 'iOS 17', 4.7),
('p6', 'Apple', 'iPhone 15 Pro Max', 159900, 48, true, 4422, 20, 'large', 'iOS 17', 4.9),
('p7', 'OnePlus', '12', 64999, 50, true, 5400, 100, 'large', 'Android 14', 4.6),
('p8', 'OnePlus', '12R', 39999, 50, true, 5500, 100, 'large', 'Android 14', 4.4),
('p9', 'Xiaomi', '14', 69999, 50, true, 4610, 90, 'compact', 'Android 14', 4.5),
('p10', 'Nothing', 'Phone (2)', 36999, 50, true, 4700, 45, 'medium', 'Android 13', 4.2),
('p11', 'Motorola', 'Edge 50 Pro', 31999, 50, true, 4500, 125, 'medium', 'Android 14', 4.1),
('p12', 'Samsung', 'Galaxy A55', 39999, 50, true, 5000, 25, 'medium', 'Android 14', 4.0),
('p13', 'Google', 'Pixel 7a', 39999, 64, true, 4385, 18, 'compact', 'Android 13', 4.1),
('p14', 'Apple', 'iPhone 13', 49900, 12, true, 3240, 20, 'compact', 'iOS 15', 4.5),
('p15', 'Vivo', 'X100', 63999, 50, true, 5000, 120, 'large', 'Android 14', 4.6)
ON CONFLICT (id) DO NOTHING;
