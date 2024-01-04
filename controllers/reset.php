<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        require_once "db.php";

        $query = "DELETE FROM tasks;";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        $pdo = null;
        $stmt = null;
        die();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
} else {
    header("Location: ../");
}
