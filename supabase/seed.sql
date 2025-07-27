-- -- seed.sql

-- -- Insert dummy data into the "notifications" table

-- INSERT INTO notifications (id, user_id, type, message, read, link, created_at)
-- VALUES
--     (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'new_message', 'You have a new message from John.', FALSE, '/messages/123', NOW()),
--     (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'product_update', 'The price of product X has been updated.', TRUE, '/products/abc', NOW() - INTERVAL '1 day'),
--     (uuid_generate_v4(), 'b1c2d3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'promotion', 'Limited time offer! 20% off all items.', FALSE, '/promotions', NOW()),
--     (uuid_generate_v4(), 'b1c2d3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'account_activity', 'Your password was changed successfully.', TRUE, '/settings', NOW() - INTERVAL '2 days'),
--     (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'system_alert', 'System maintenance scheduled for tomorrow.', FALSE, NULL, NOW());

-- -- Note: Replace the placeholder user_ids ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1c2d3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f') with actual user IDs from your 'users' table.

-- -- Insert dummy data into the "products" table
-- INSERT INTO products (id, name, description, image, author, points, upvotes, badges, category, link, created_at, updated_at, peer_push_points)
-- VALUES
--     ('c0a80121-7d3b-4f5e-8a0b-8b8d8c0b0c0b', 'Awesome Gadget', 'A revolutionary gadget that will change your life.', 'https://placehold.co/600x400', 'Gadget Creator', 100, 25, '{"Innovator", "Popular"}', 'Technology', 'https://example.com/gadget', NOW(), NOW(), 15),
--     ('d1b90232-8e4c-5g6f-9b1c-9c9e9d1c1d1c', 'Eco-Friendly Water Bottle', 'Stay hydrated and save the planet with this reusable bottle.', 'https://placehold.co/600x400', 'Green Earth Co.', 50, 10, '{"Eco-Warrior"}', 'Lifestyle', 'https://example.com/waterbottle', NOW(), NOW(), 5),
--     ('e2c00343-9f5d-6h7g-0c2d-0d0f0e2d2e2d', 'Smart Home Hub', 'Control all your smart devices from one central hub.', 'https://placehold.co/600x400', 'Smart Living Inc.', 120, 40, '{"Innovator", "Tech Savvy"}', 'Technology', 'https://example.com/smarthomehub', NOW(), NOW(), 20),
--     ('f3d10454-af6e-7i8h-1d3e-1e1g1f3e3f3f', 'Organic Coffee Beans', ' ethically sourced and roasted to perfection.', 'https://placehold.co/600x400', 'Coffee Masters', 80, 15, '{"Taste Maker"}', 'Food & Beverage', 'https://example.com/coffeebeans', NOW(), NOW(), 10);

-- -- Insert dummy data into the "badges" table
-- INSERT INTO badges (id, name, description, icon)
-- VALUES
--     ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Innovator', 'Awarded for creating groundbreaking products.', '💡'),
--     ('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Popular', 'Awarded for products with a high number of upvotes.', '👍'),
--     ('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Eco-Warrior', 'Awarded for products that promote sustainability.', '🌳'),
--     ('d4e5f6a7-b8c9-0123-4567-890123456789', 'Taste Maker', 'Awarded for exceptional food and beverage products.', ' useCustomToast');

-- -- Insert dummy data into the "user_badges" table
-- INSERT INTO user_badges (id, user_id, badge_id, earned_at)
-- VALUES
--     (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', NOW()),
--     (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', NOW()),
--     (uuid_generate_v4(), 'b1c2d3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01', NOW());

-- -- Insert dummy data into the "tags" table
-- INSERT INTO tags (id, name, color)
-- VALUES
--     ('1a2b3c4d-5e6f-7890-1234-abcdef012345', 'AI', '#FF0000'),
--     ('2b3c4d5e-6f7a-8901-2345-bcdef0123456', 'Machine Learning', '#00FF00'),
--     ('3c4d5e6f-7a8b-9012-3456-cdef01234567', 'Web Development', '#0000FF'),
--     ('4d5e6f7a-8b9c-0123-4567-def012345678', 'Mobile App', '#FFFF00'),
--     ('5e6f7a8b-9c0d-1234-5678-ef0123456789', 'Data Science', '#FF00FF');

-- -- Insert dummy data into the "product_tags" table
-- INSERT INTO product_tags (product_id, tag_id)
-- VALUES
--     ('c0a80121-7d3b-4f5e-8a0b-8b8d8c0b0c0b', '1a2b3c4d-5e6f-7890-1234-abcdef012345'), -- Awesome Gadget tagged with AI
--     ('c0a80121-7d3b-4f5e-8a0b-8b8d8c0b0c0b', '2b3c4d5e-6f7a-8901-2345-bcdef0123456'), -- Awesome Gadget tagged with Machine Learning
--     ('e2c00343-9f5d-6h7g-0c2d-0d0f0e2d2e2d', '3c4d5e6f-7a8b-9012-3456-cdef01234567'), -- Smart Home Hub tagged with Web Development
--     ('e2c00343-9f5d-6h7g-0c2d-0d0f0e2d2e2d', '4d5e6f7a-8b9c-0123-4567-def012345678'), -- Smart Home Hub tagged with Mobile App
--     ('f3d10454-af6e-7i8h-1d3e-1e1g1f3e3f3f', '5e6f7a8b-9c0d-1234-5678-ef0123456789'); -- Organic Coffee Beans tagged with Data Science (example of potentially unrelated tags)