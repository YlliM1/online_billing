<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';


if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}


$sql = "SELECT * FROM users";
$result = $conn->query($sql);


$users = [];


if ($result) {
    if ($result->num_rows > 0) {
       
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
            
        }
    } else {

        echo "No users found in the database.";
        exit;
    }
} else {
    echo "Query error: " . $conn->error;
    exit;
}

header('Content-Type: application/json');

echo json_encode($users);
?>
