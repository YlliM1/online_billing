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
    $project = $data['project'];
    $client = $data['client'];
    $email = $data['email'];
    $offerDate = $data['offer_date'];
    $dueDate = $data['due_date'];
    $clientAddress = $data['client_address'];
    $items = json_encode($data['items']); // Convert items array to JSON for storage

    // Prepare and execute the update query
    $sql = "
        UPDATE offers 
        SET project = ?, client = ?, email = ?, offer_date = ?, due_date = ?, client_address = ?, items = ?
        WHERE id = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssi", $project, $client, $email, $offerDate, $dueDate, $clientAddress, $items, $offerId);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Offer updated successfully.';
    } else {
        $response['message'] = 'Failed to update offer.';
    }

    $stmt->close();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
