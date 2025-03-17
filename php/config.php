<?php

$host = "localhost";
$dbname = "bio_boost_db";
$username = "bio_boost"; // Pas aan indien nodig
$password = "Bio_boost!"; // Pas aan indien nodig

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Databaseverbinding mislukt: " . $e->getMessage());
}
?>