<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password are required."]);
    exit();
}

$query = "SELECT id, password, firstname, role FROM users WHERE email = ?";  
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['last_activity'] = time();  

        // Check if the logged-in user is the specific admin email
        if ($email === 'yllmurati@gmail.com') {
            $user['role'] = 'admin'; // Assign admin role directly
        }

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user_id" => $user['id'],
            "firstname" => $user['firstname'],
            "role" => $user['role']  // Return the user's role (admin or other)
        ]);
    } else {       
        echo json_encode(["success" => false, "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No account found with that email."]);
}

$stmt->close();
$conn->close();
?>
