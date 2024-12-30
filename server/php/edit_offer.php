<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$response = ['success' => false];

try {
    // Retrieve and decode input
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        $response['message'] = 'Offer ID is required.';
        echo json_encode($response);
        exit;
    }

    $offerId = $data['id'];

    $conn->begin_transaction();

    // Delete existing items for the offer
    $stmt = $conn->prepare("DELETE FROM offers WHERE id = ?");
    $stmt->bind_param("i", $offerId);
    $stmt->execute();

    // Insert updated items
    foreach ($data['items'] as $item) {
        $stmt = $conn->prepare("
            INSERT INTO offers (project, client, email, offer_date, due_date, client_address, items, quantity, price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $itemName = $item['name'];
        $itemQuantity = $item['quantity'];
        $itemPrice = $item['price'];

        $stmt->bind_param(
            "ssssssssds",
            $data['project'],
            $data['client'],
            $data['email'],
            $data['offer_date'],
            $data['due_date'],
            $data['client_address'],
            $itemName,
            $itemQuantity,
            $itemPrice,
            $data['status']
        );

        $stmt->execute();
    }

    $conn->commit();
    $response['success'] = true;
    $response['message'] = 'Offer updated successfully.';

} catch (Exception $e) {
    $conn->rollback();
    $response['message'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
