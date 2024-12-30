<?php 
include 'db.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Fetch total offers
$totalOffersQuery = "SELECT COUNT(*) AS totalOffers FROM offers";
$totalOffersResult = $conn->query($totalOffersQuery);

// Fetch total revenue for approved offers
$totalRevenueQuery = "SELECT SUM(price * quantity) AS totalRevenue FROM offers WHERE status = 'approved'";
$totalRevenueResult = $conn->query($totalRevenueQuery);

// Fetch total pending revenue
$totalPendingRevenueQuery = "SELECT SUM(price * quantity) AS totalPendingRevenue FROM offers WHERE status = 'pending'";
$totalPendingRevenueResult = $conn->query($totalPendingRevenueQuery);

// Fetch overdue invoices (if necessary)
$totalOverdueQuery = "SELECT COUNT(*) AS overdueInvoices FROM offers WHERE status = 'overdue'";
$totalOverdueResult = $conn->query($totalOverdueQuery);

// Fetch total number of registered users
$totalUsersQuery = "SELECT COUNT(*) AS totalUsers FROM users WHERE role='user'";
$totalUsersResult = $conn->query($totalUsersQuery);

// Fetch offers by status
$statusOffersQuery = "
    SELECT status, COUNT(*) AS count
    FROM offers
    GROUP BY status
";
$statusOffersResult = $conn->query($statusOffersQuery);

$offersByStatus = [
    'approved' => 0,
    'rejected' => 0,
    'pending' => 0
];

while ($row = $statusOffersResult->fetch_assoc()) {
    $status = $row['status'];
    $offersByStatus[$status] = $row['count'];
}

// Debugging: Check if the query ran successfully and if the result is correct
if (!$totalUsersResult) {
    echo json_encode(['success' => false, 'message' => 'Error in fetching users: ' . $conn->error]);
    exit();
}

// Initialize response
$response = ['success' => false];

if ($totalOffersResult && $totalRevenueResult && $totalPendingRevenueResult && $totalOverdueResult && $totalUsersResult && $statusOffersResult) {
    $totalOffersData = $totalOffersResult->fetch_assoc();
    $totalRevenueData = $totalRevenueResult->fetch_assoc();
    $totalPendingRevenueData = $totalPendingRevenueResult->fetch_assoc();
    $totalOverdueData = $totalOverdueResult->fetch_assoc();
    $totalUsersData = $totalUsersResult->fetch_assoc();

    // Fetch monthly revenue using offer_date
    $totalMonthlyRevenueQuery = "
        SELECT 
            MONTH(offer_date) AS month,
            SUM(price * quantity) AS monthlyRevenue
        FROM offers
        WHERE status = 'approved'
        GROUP BY MONTH(offer_date)
        ORDER BY MONTH(offer_date)
    ";
    $totalMonthlyRevenueResult = $conn->query($totalMonthlyRevenueQuery);

    $monthlyRevenueData = array_fill(0, 12, 0); // Default all months to 0
    while ($row = $totalMonthlyRevenueResult->fetch_assoc()) {
        $monthlyRevenueData[$row['month'] - 1] = $row['monthlyRevenue'] ?? 0;
    }

    $response['success'] = true;
    $response['stats'] = [
        'totalOffers' => $totalOffersData['totalOffers'] ?? 0,
        'totalRevenue' => $totalRevenueData['totalRevenue'] ?? 0,
        'pendingPayments' => $totalPendingRevenueData['totalPendingRevenue'] ?? 0,
        'overdueInvoices' => $totalOverdueData['overdueInvoices'] ?? 0,
        'totalUsers' => $totalUsersData['totalUsers'] ?? 0,
        'monthlyRevenue' => $monthlyRevenueData,  // Add monthly revenue data to response
        'offersByStatus' => $offersByStatus,      // Add offers by status data
    ];
} else {
    $response['message'] = 'Error fetching data: ' . $conn->error;
}

echo json_encode($response);
?>
