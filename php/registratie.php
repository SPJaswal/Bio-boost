<?php
include 'config.php';

// Stel, deze gegevens komen uit een registratieformulier
$email = $_POST['email'];
$password = $_POST['password'];
$naam = $_POST['naam'];
$leeftijd = $_POST['leeftijd'];
$geslacht = $_POST['geslacht'];
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // 1. Voeg de user toe aan de Users-tabel
    $stmt = $pdo->prepare("INSERT INTO Users (email, password_hash) VALUES (?, ?)");
    $stmt->execute([$email, $password_hash]);
    $user_id = $pdo->lastInsertId();

    // 2. Voeg Gebruiker toe met ingevulde gegevens
    $bloeddruk = rand(100, 140) . "/" . rand(60, 90);
    $hartslag = rand(60, 100);
    $temperatuur = round(rand(360, 380) / 10, 1);

    $stmt = $pdo->prepare("INSERT INTO Gebruiker (naam, leeftijd, geslacht, bloeddruk, hartslag, temperatuur) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$naam, $leeftijd, $geslacht, $bloeddruk, $hartslag, $temperatuur]);
    $gebruiker_id = $pdo->lastInsertId();

    // 3. Koppel gebruiker aan UserDetails
    $stmt = $pdo->prepare("INSERT INTO UserDetails (user_id, gebruiker_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $gebruiker_id]);

    // 4. Vul Bloedwaarden in
    $bloedtypes = ['A', 'B', 'AB', 'O'];
    $bloedtype = $bloedtypes[array_rand($bloedtypes)];
    $ijzer = round(rand(500, 1500) / 100, 2);
    $vitamineD = round(rand(200, 1000) / 100, 2);
    $stmt = $pdo->prepare("INSERT INTO Bloedwaarden (gebruiker_id, bloedtype, ijzergehalte, vitamined) VALUES (?, ?, ?, ?)");
    $stmt->execute([$gebruiker_id, $bloedtype, $ijzer, $vitamineD]);

    // 5. Vul OrgaanGezondheid in
    $allergieen = ['pollen', 'noten', 'geen', 'gluten'];
    $chronisch = ['diabetes', 'astma', 'geen', 'hoge bloeddruk'];
    $stmt = $pdo->prepare("INSERT INTO OrgaanGezondheid (gebruiker_id, allergie, chronisch) VALUES (?, ?, ?)");
    $stmt->execute([$gebruiker_id, $allergieen[array_rand($allergieen)], $chronisch[array_rand($chronisch)]]);

    // 6. Vul Voeding in
    $teveelsuiker = rand(0, 1);
    $genoegvoeding = rand(0, 1);
    $tekorten = ['ijzer', 'vitamine D', 'calcium', 'geen'];
    $stmt = $pdo->prepare("INSERT INTO Voeding (gebruiker_id, teveelsuiker, genoegvoeding, tekorten) VALUES (?, ?, ?, ?)");
    $stmt->execute([$gebruiker_id, $teveelsuiker, $genoegvoeding, $tekorten[array_rand($tekorten)]]);

    // 7. Vul Mentaal in
    $stresslevel = rand(0, 10);
    $stemmingen = ['blij', 'neutraal', 'gestrest', 'verdrietig', 'energiek'];
    $stmt = $pdo->prepare("INSERT INTO Mentaal (gebruiker_id, stresslevel, stemming) VALUES (?, ?, ?)");
    $stmt->execute([$gebruiker_id, $stresslevel, $stemmingen[array_rand($stemmingen)]]);

    echo "Registratie en profiel succesvol aangemaakt.";
} catch (PDOException $e) {
    echo "Fout: " . $e->getMessage();
}
