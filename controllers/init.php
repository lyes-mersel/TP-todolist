<?php

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        require_once "db.php";

        $query = "SELECT txt FROM tasks;";
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo(json_encode($result));

        $pdo = null;
        $stmt = null;
        die();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
} else {
    header("Location: ../");
}
