<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

try {
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if all required fields are present
    $requiredFields = ['project', 'client', 'email', 'offer_date', 'due_date', 'client_address', 'items'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            throw new Exception("The field $field is required.");
        }
    }

    // JSON encode the items array to store it in the database
    $itemsJson = json_encode($input['items']); // Encoding the items array as JSON

    // Prepare SQL statement to insert the offer data
    $stmt = $conn->prepare("
        INSERT INTO offers (project, client, email, offer_date, due_date, client_address, items)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "sssssss",  
        $input['project'],
        $input['client'],
        $input['email'],
        $input['offer_date'],
        $input['due_date'],
        $input['client_address'],
        $itemsJson  // Bind the JSON-encoded items array
    );

    // Execute the query
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Offer created successfully.';
    } else {
        throw new Exception('Failed to insert data into the database.');
    }

    $stmt->close();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);

?>
