# ISCSlotBooking
MYSQL CODE
=> Open MySQL Client
=> establish connection
=> set username to root
=> put all these queries
=> and make sure to change the password as per your mysql in the server.js code!

MYSQL Queries

CREATE DATABASE IndoorSportsComplexBooking;
USE IndoorSportsComplexBooking;
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL
);
CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  pwd VARCHAR(100) NOT NULL
);

CREATE TABLE facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facility_name VARCHAR(100) NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  slots_available INT NOT NULL,
  availability VARCHAR(50) NOT NULL
);

CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  facility_id INT,
  FOREIGN KEY (facility_id) REFERENCES facilities(id),
  booking_date DATE NOT NULL
);
