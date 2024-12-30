<?php
include('db.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->firstname) && isset($data->lastname) && isset($data->email) && isset($data->role)) {
    $id = $conn->real_escape_string($data->id);
    $firstname = $conn->real_escape_string($data->firstname);
    $lastname = $conn->real_escape_string($data->lastname);
    $email = $conn->real_escape_string($data->email);
    $role = $conn->real_escape_string($data->role);

    // Update query
    $sql = "UPDATE users SET firstname = '$firstname', lastname = '$lastname', email = '$email', role = '$role' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}

$conn->close();
?>
