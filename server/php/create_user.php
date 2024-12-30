<?php
include('db.php'); // Include your database connection


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (isset($data->firstname) && isset($data->lastname) && isset($data->email) && isset($data->password) && isset($data->role)) {
    $firstname = $conn->real_escape_string($data->firstname);
    $lastname = $conn->real_escape_string($data->lastname);
    $email = $conn->real_escape_string($data->email);
    $password = password_hash($data->password, PASSWORD_DEFAULT); // Hash password for security
    $role = $conn->real_escape_string($data->role);

    $sql = "INSERT INTO users (firstname, lastname, email, password, role) VALUES ('$firstname', '$lastname', '$email', '$password', '$role')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}

$conn->close();
?>
