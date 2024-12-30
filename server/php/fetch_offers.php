<?php
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');

$response = ['success' => false, 'data' => []];

try {
    $status = isset($_GET['status']) ? $_GET['status'] : null;

    if ($status) {
        $sql = "SELECT * FROM offers WHERE status = ? ORDER BY offer_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $status);
    } else {
        $sql = "SELECT * FROM offers ORDER BY offer_date DESC";
        $stmt = $conn->prepare($sql);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $offers = [];
    while ($row = $result->fetch_assoc()) {
        $offers[] = $row;
    }

    $response['success'] = true;
    $response['data'] = $offers;
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
