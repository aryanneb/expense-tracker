-- Create database
CREATE DATABASE IF NOT EXISTS expense_tracker;

-- Use database
USE expense_tracker;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INT NOT NULL AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) DEFAULT NULL,
    date DATE DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
