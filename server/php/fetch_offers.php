<?php
include 'db.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');

$response = ['success' => false, 'data' => []];

try {
    // Check if status is provided in the query string and filter accordingly
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

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $response['data'][] = $row;
        }
        $response['success'] = true;
    } else {
        $response['message'] = 'No offers found.';
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();

echo json_encode($response);
?>
