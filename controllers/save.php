<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        require_once "db.php";

        $data = file_get_contents("php://input");
        $list = json_decode($data, true);

        $query = "DELETE FROM tasks;";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        $id = "default";
        foreach ($list as $task) {
            $query = "INSERT INTO tasks VALUES(:id, :task);";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(":task", $task);
            $stmt->execute();
        }

        $pdo = null;
        $stmt = null;
        die();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
} else {
    header("Location: ../");
}
