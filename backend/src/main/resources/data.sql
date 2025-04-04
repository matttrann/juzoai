-- Insert sample users (password = 'password')
INSERT INTO users (username, email, password) 
SELECT 'testuser', 'test@example.com', '$2a$10$ZPfWw.QiRyCCuSZlNkSgRu.4a45r8Nx0T/M1uV2SHsA3gNjxKSs3y'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'testuser'); 