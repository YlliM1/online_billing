<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['firstname']) && isset($data['lastname']) && isset($data['email']) && isset($data['password'])) {
    $first_name = $data['firstname'];
    $last_name = $data['lastname'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); 

    
    $checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkEmailQuery);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email already exists."]);
        exit;
    }

    $sql = "INSERT INTO users(firstname, lastname, email, password) VALUES (?,?,?,?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssss', $first_name, $last_name, $email, $password);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error registering user"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}


?>
