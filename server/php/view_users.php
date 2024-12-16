<?php
// Include database connection

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

// Check database connection
if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Query to fetch all users
$sql = "SELECT * FROM users";
$result = $conn->query($sql);

// Initialize an empty array to hold user data
$users = [];

// Debug: Check if the query executed successfully
if ($result) {
    if ($result->num_rows > 0) {
        // Fetch each row as an associative array
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    } else {
        // Debug: No users found
        echo "No users found in the database.";
        exit;
    }
} else {
    // Debug: Query error
    echo "Query error: " . $conn->error;
    exit;
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Return the JSON-encoded users array
echo json_encode($users);
?>
