<?php
include 'db.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


header('Content-Type: application/json');


$response = ['success' => false, 'data' => []];

try {
    $sql = "SELECT * FROM offers ORDER BY offer_date DESC";
    $result = $conn->query($sql);

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
