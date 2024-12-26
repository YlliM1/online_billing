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

    // Prepare and execute the delete query
    $sql = "DELETE FROM offers WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $offerId);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Offer deleted successfully.';
    } else {
        $response['message'] = 'Failed to delete offer.';
    }

    $stmt->close();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
