-- =========================================
-- Craftopia - Full PostgreSQL Database Script
-- Schema + Seed Data + Functions + Triggers
-- Run with: psql -d craftopia_db -f craftopia_full.sql
-- Postgres version: 12+
-- =========================================

-- ========== CLEANUP ==========
-- Drop in correct order to avoid FK issues
DROP TABLE IF EXISTS quiz_results, quiz_attempts, answers, questions, quizzes, recommendations;
DROP TABLE IF EXISTS artist_stories;
DROP TABLE IF EXISTS gift_messages, gift_cards, wrapping_papers;
DROP TABLE IF EXISTS payments, delivery_details, order_items, orders;
DROP TABLE IF EXISTS wishlist, reviews, rewards;
DROP TABLE IF EXISTS cart_items, cart;
DROP TABLE IF EXISTS product_images, product_categories, categories, products, sellers, support_tickets, support_staff, users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- ========== TYPES ==========
CREATE TYPE user_role AS ENUM ('customer','seller','admin');
CREATE TYPE order_status AS ENUM ('Pending','Approved','Rejected','Shipped','Delivered','Cancelled');
CREATE TYPE payment_status AS ENUM ('Unpaid','Pending','Completed','Failed','Refunded');

-- ========== USERS & SELLERS ==========
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE sellers (
    seller_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    shop_name VARCHAR(150) NOT NULL,
    bio TEXT,
    rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support staff (optional)
CREATE TABLE support_staff (
    staff_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    role_description VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== CATEGORIES & PRODUCTS ==========
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES sellers(seller_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    is_limited_edition BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE product_categories (
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_images (
    image_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE artist_stories (
    story_id SERIAL PRIMARY KEY,
    product_id INT UNIQUE REFERENCES products(product_id) ON DELETE CASCADE,
    artist_name VARCHAR(150),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== CART ==========
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_cart_user ON cart(user_id);

CREATE TABLE cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(cart_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (cart_id, product_id)
);
CREATE INDEX idx_cartitems_cart ON cart_items(cart_id);
CREATE INDEX idx_cartitems_product ON cart_items(product_id);

-- ========== ORDERS ==========
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount NUMERIC(12,2) DEFAULT 0 CHECK (total_amount >= 0),
    status order_status DEFAULT 'Pending',
    payment_status payment_status DEFAULT 'Unpaid',
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE RESTRICT,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * price) STORED
);
CREATE INDEX idx_orderitems_order ON order_items(order_id);
CREATE INDEX idx_orderitems_product ON order_items(product_id);

-- Trigger: decrement stock when order_item inserted
CREATE OR REPLACE FUNCTION decrement_stock_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT stock FROM products WHERE product_id = NEW.product_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Not enough stock for product %', NEW.product_id;
    END IF;

    UPDATE products
    SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_stock_after_insert
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE PROCEDURE decrement_stock_on_order_item();

-- ========== WISHLIST ==========
CREATE TABLE wishlist (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, product_id)
);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- ========== REVIEWS ==========
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, product_id) -- one review per user per product
);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ========== REWARDS ==========
CREATE TABLE rewards (
    reward_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    points INT DEFAULT 0 CHECK (points >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    description TEXT
);

-- ========== DELIVERY DETAILS ==========
CREATE TABLE delivery_details (
    delivery_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(20),
    delivery_status VARCHAR(30) DEFAULT 'Processing' CHECK (delivery_status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== PAYMENTS ==========
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    amount NUMERIC(12,2) CHECK (amount >= 0),
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== GIFTS ==========
CREATE TABLE wrapping_papers (
    paper_id SERIAL PRIMARY KEY,
    design_name VARCHAR(100),
    image_url TEXT
);

CREATE TABLE gift_cards (
    card_id SERIAL PRIMARY KEY,
    design_name VARCHAR(100),
    image_url TEXT
);

CREATE TABLE gift_messages (
    message_id SERIAL PRIMARY KEY,
    order_id INT UNIQUE REFERENCES orders(order_id) ON DELETE CASCADE,
    content TEXT,
    paper_id INT REFERENCES wrapping_papers(paper_id) ON DELETE SET NULL,
    card_id INT REFERENCES gift_cards(card_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== QUIZ SYSTEM ==========
CREATE TABLE quizzes (
    quiz_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_option_index INT NOT NULL CHECK (correct_option_index >= 0)
);

CREATE TABLE quiz_attempts (
    attempt_id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    finished_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    attempt_id INT REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(question_id) ON DELETE CASCADE,
    selected_option_index INT NOT NULL CHECK (selected_option_index >= 0),
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (attempt_id, question_id)
);

CREATE TABLE quiz_results (
    result_id SERIAL PRIMARY KEY,
    attempt_id INT UNIQUE REFERENCES quiz_attempts(attempt_id) ON DELETE CASCADE,
    score INT CHECK (score >= 0),
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== SUPPORT ==========
CREATE TABLE support_tickets (
    ticket_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open','Pending','Resolved','Closed')),
    assigned_staff_id INT REFERENCES support_staff(staff_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== INDEXES & VIEWS ==========
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_limited ON products(is_limited_edition);
CREATE INDEX idx_productcategories_category ON product_categories(category_id);
CREATE INDEX idx_quizattempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_answers_attempt ON answers(attempt_id);

CREATE OR REPLACE VIEW product_rating AS
SELECT p.product_id,
       COALESCE(ROUND(AVG(r.rating)::numeric,2),0) AS avg_rating,
       COUNT(r.review_id) AS review_count
FROM products p
LEFT JOIN reviews r ON r.product_id = p.product_id
GROUP BY p.product_id;

-- ========== SEED DATA ==========
-- Users
INSERT INTO users (name, email, password, role)
VALUES
('Alice Customer', 'alice@example.com', 'hashed_pass_1', 'customer'),
('Bob Seller', 'bob@example.com', 'hashed_pass_2', 'seller'),
('Carol Admin', 'carol@example.com', 'hashed_pass_3', 'admin');

-- Seller profile
INSERT INTO sellers (user_id, shop_name, bio, rating)
VALUES ((SELECT user_id FROM users WHERE email='bob@example.com'), 'BobsHandmade', 'Eco-friendly crafts and jewelry', 4.8);

-- Categories
INSERT INTO categories (category_name, description) VALUES
('Home Decor', 'Handmade items for home decoration'),
('Jewelry', 'Unique handmade jewelry'),
('Eco-Friendly', 'Sustainable and eco-friendly products');

-- Products
INSERT INTO products (seller_id, name, description, price, stock, is_limited_edition)
VALUES
((SELECT seller_id FROM sellers LIMIT 1), 'Handmade Ceramic Vase', 'Eco-friendly ceramic vase', 35.00, 10, FALSE),
((SELECT seller_id FROM sellers LIMIT 1), 'Recycled Paper Necklace', 'Handmade necklace from recycled paper', 25.00, 5, TRUE),
((SELECT seller_id FROM sellers LIMIT 1), 'Wooden Photo Frame', 'Handcrafted wooden frame', 15.00, 8, FALSE);

-- Product categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.product_id, c.category_id
FROM products p
JOIN categories c ON
    ( (p.name ILIKE '%Vase%' AND c.category_name='Home Decor')
      OR (p.name ILIKE '%Necklace%' AND c.category_name='Jewelry')
      OR (p.name ILIKE '%Wooden%' AND c.category_name='Home Decor')
      OR (p.name ILIKE '%Necklace%' AND c.category_name='Eco-Friendly') );

-- Artist stories
INSERT INTO artist_stories (product_id, artist_name, content)
SELECT product_id, 'Bob Seller', 'Crafted carefully using recycled materials and traditional techniques.'
FROM products;

-- Rewards (give customer initial points)
INSERT INTO rewards (user_id, points, description)
SELECT user_id, 50, 'Welcome bonus' FROM users WHERE role='customer';

-- Create cart for Alice and add an item
INSERT INTO cart (user_id)
SELECT user_id FROM users WHERE email='alice@example.com';

INSERT INTO cart_items (cart_id, product_id, quantity)
SELECT c.cart_id, p.product_id, 2
FROM cart c, products p
WHERE c.user_id=(SELECT user_id FROM users WHERE email='alice@example.com')
AND p.name ILIKE '%Vase%';

-- Wishlist: Alice adds limited edition products
INSERT INTO wishlist (user_id, product_id)
SELECT u.user_id, p.product_id FROM users u JOIN products p ON p.is_limited_edition = TRUE WHERE u.role='customer';

-- Reviews: Alice reviews the vase
INSERT INTO reviews (user_id, product_id, rating, comment)
SELECT u.user_id, p.product_id, 5, 'Absolutely love this vase!'
FROM users u, products p WHERE u.role='customer' AND p.name ILIKE '%Vase%';

-- Quizzes & Questions
INSERT INTO quizzes (title, description) VALUES ('Find Your Eco Style', 'Which products match your eco personality?');

INSERT INTO questions (quiz_id, question_text, options, correct_option_index)
VALUES
((SELECT quiz_id FROM quizzes LIMIT 1), 'Which material do you prefer?', ARRAY['Wood', 'Ceramic', 'Paper'], 1),
((SELECT quiz_id FROM quizzes LIMIT 1), 'How important is sustainability to you?', ARRAY['Not at all', 'Somewhat', 'Very important'], 2);

-- Sample quiz attempt by Alice
INSERT INTO quiz_attempts (quiz_id, user_id, started_at, finished_at)
VALUES ((SELECT quiz_id FROM quizzes LIMIT 1), (SELECT user_id FROM users WHERE email='alice@example.com'), now(), now());

-- Answers: assume Alice chose the correct options (for demo)
INSERT INTO answers (attempt_id, question_id, selected_option_index)
SELECT qa.attempt_id, q.question_id, q.correct_option_index
FROM quiz_attempts qa JOIN questions q ON qa.quiz_id=q.quiz_id
WHERE qa.user_id = (SELECT user_id FROM users WHERE email='alice@example.com');

-- Run calculate_quiz_score below to create quiz_results (function provided later)
-- Recommendations will be generated by the function provided below.

-- ========== FUNCTIONS & PROCEDURES ==========

-- 1) place_order_for_user: moves cart -> order, creates order_items, updates order total, clears cart
CREATE OR REPLACE FUNCTION place_order_for_user(_user_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_cart_id INT;
    v_order_id INT;
    v_total NUMERIC(12,2);
BEGIN
    -- Ensure user and cart exist
    SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = _user_id;
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'No cart exists for user %', _user_id;
    END IF;

    -- Start transaction (function runs inside transaction)
    -- Create order
    INSERT INTO orders (user_id, total_amount, status, payment_status, payment_method)
    VALUES (_user_id, 0, 'Pending', 'Unpaid', NULL)
    RETURNING order_id INTO v_order_id;

    -- Insert each cart_item as an order_item (this will fire stock decrement trigger)
    INSERT INTO order_items (order_id, product_id, quantity, price)
    SELECT v_order_id, ci.product_id, ci.quantity, p.price
    FROM cart_items ci
    JOIN products p ON p.product_id = ci.product_id
    WHERE ci.cart_id = v_cart_id;

    -- Calculate and set total_amount on order
    SELECT COALESCE(SUM(subtotal),0) INTO v_total FROM order_items WHERE order_id = v_order_id;
    UPDATE orders SET total_amount = v_total WHERE order_id = v_order_id;

    -- Clear cart items
    DELETE FROM cart_items WHERE cart_id = v_cart_id;

    RETURN v_order_id;
EXCEPTION WHEN others THEN
    RAISE;
END;
$$;

-- 2) calculate_quiz_score: compute score and insert quiz_results
CREATE OR REPLACE FUNCTION calculate_quiz_score(_attempt_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_correct INT;
    v_total INT;
    v_score_percent INT;
    v_user_id INT;
BEGIN
    SELECT COUNT(*) FILTER (WHERE q.correct_option_index = a.selected_option_index) INTO v_correct
    FROM answers a
    JOIN questions q ON q.question_id = a.question_id
    WHERE a.attempt_id = _attempt_id;

    SELECT COUNT(*) INTO v_total FROM answers WHERE attempt_id = _attempt_id;
    IF v_total = 0 THEN
        RAISE EXCEPTION 'No answers found for attempt %', _attempt_id;
    END IF;

    v_score_percent := FLOOR((v_correct::NUMERIC / v_total::NUMERIC) * 100);

    -- insert or update quiz_results
    INSERT INTO quiz_results (attempt_id, score, recommendation, created_at)
    VALUES (_attempt_id, v_score_percent, NULL, now())
    ON CONFLICT (attempt_id) DO UPDATE SET score = EXCLUDED.score, created_at = EXCLUDED.created_at
    RETURNING score INTO v_score_percent;

    -- for convenience, return the score
    RETURN v_score_percent;
END;
$$;

-- 3) generate_recommendations_for_user: simple rule-based recommendations
CREATE OR REPLACE FUNCTION generate_recommendations_for_user(_user_id INT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete old recommendations for user
    DELETE FROM recommendations WHERE user_id = _user_id;

    -- 1) Recommend limited edition products (highest priority)
    INSERT INTO recommendations (user_id, product_id, reason, created_at)
    SELECT _user_id, p.product_id, 'Limited edition pick', now()
    FROM products p
    WHERE p.is_limited_edition = TRUE
    ORDER BY p.created_at DESC
    LIMIT 5;

    -- 2) Recommend popular products from categories user liked (based on wishlist + top categories)
    INSERT INTO recommendations (user_id, product_id, reason, created_at)
    SELECT _user_id, p.product_id, 'Popular in your interested categories', now()
    FROM products p
    JOIN product_categories pc ON pc.product_id = p.product_id
    WHERE pc.category_id IN (
        SELECT pc2.category_id FROM wishlist w
        JOIN product_categories pc2 ON pc2.product_id = w.product_id
        WHERE w.user_id = _user_id
        GROUP BY pc2.category_id
        ORDER BY COUNT(*) DESC
        LIMIT 3
    )
    AND p.product_id NOT IN (SELECT product_id FROM recommendations WHERE user_id = _user_id)
    LIMIT 10;
END;
$$;

-- ========== EXAMPLE USAGE (run these manually) ==========

-- Example: Place order for Alice
-- SELECT place_order_for_user((SELECT user_id FROM users WHERE email='alice@example.com'));

-- Example: Calculate quiz score for Alice's attempt
-- SELECT calculate_quiz_score((SELECT attempt_id FROM quiz_attempts WHERE user_id=(SELECT user_id FROM users WHERE email='alice@example.com') LIMIT 1));

-- Example: Generate recommendations for Alice
-- SELECT generate_recommendations_for_user((SELECT user_id FROM users WHERE email='alice@example.com'));

-- Example reports:
-- Limited edition products
-- SELECT p.product_id, p.name, p.price, p.stock FROM products p WHERE p.is_limited_edition = TRUE ORDER BY p.created_at DESC;

-- Seller sales report (sum of subtotals)
-- SELECT s.shop_name, SUM(oi.subtotal) AS total_sales, COUNT(DISTINCT o.order_id) AS total_orders
-- FROM sellers s
-- JOIN products p ON p.seller_id = s.seller_id
-- JOIN order_items oi ON oi.product_id = p.product_id
-- JOIN orders o ON o.order_id = oi.order_id
-- GROUP BY s.shop_name;

-- Quiz score query (explicit)
-- SELECT qr.score, qr.recommendation FROM quiz_results qr JOIN quiz_attempts qa ON qa.attempt_id = qr.attempt_id WHERE qa.user_id = (SELECT user_id FROM users WHERE email='alice@example.com');

-- ========== END OF SCRIPT ==========
