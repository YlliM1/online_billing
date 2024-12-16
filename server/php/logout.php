<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

session_unset();
session_destroy();

header('Content-Type: application/json');
echo json_encode(["success" => true, "message" => "Logged out successfully."]);

?>
