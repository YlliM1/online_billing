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
    $requiredFields = ['project', 'client', 'email', 'offer_date', 'due_date', 'client_address', 'items', 'status'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            throw new Exception("The field $field is required.");
        }
    }

    $conn->begin_transaction(); // Start transaction

    foreach ($input['items'] as $item) {
        // Validate each item
        if (empty($item['name']) || empty($item['quantity']) || empty($item['price'])) {
            throw new Exception("Each item must have a name, quantity, and price.");
        }

        // Insert each item as a separate row
        $stmt = $conn->prepare("
            INSERT INTO offers (project, client, email, offer_date, due_date, client_address, items, quantity, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $itemName = $item['name'];
        $itemQuantity = $item['quantity'];
        $itemPrice = $item['price'];

        $stmt->bind_param(
            "ssssssssds",
            $input['project'],
            $input['client'],
            $input['email'],
            $input['offer_date'],
            $input['due_date'],
            $input['client_address'],
            $itemName,
            $itemQuantity,
            $itemPrice,
            $input['status']
        );

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert item: " . $itemName);
        }
    }

    $conn->commit(); // Commit transaction
    $response['success'] = true;
    $response['message'] = 'Offer created successfully.';

} catch (Exception $e) {
    $conn->rollback(); // Rollback transaction on error
    $response['message'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
