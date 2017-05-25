<?php
//load all neccesary file
require_once(__DIR__ . '/src/db.php');
require_once(__DIR__ . '/src/Book.php');
//check what kinf of request if from Ajax
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $books = [];
    //checking for Id
    if (isset($_GET['id'])) {
        //changing value of id on intiger value
        $id = intval($_GET['id']);
        //load one book
        $books = Book::loadFromDb($conn, $id);
    } else {
        //pobieramy wszystkie książki
        $books = Book::loadAllFromDb($conn);
    }
    //returning json
    echo json_encode($books);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //creating new object
    $newBook = new Book();
    $newBook->setAuthor($_POST['author']);
    $newBook->setTitle($_POST['title']);
    $newBook->setDescription($_POST['description']);
    $addedBookArray = $newBook->create($conn);
    //creating new json object one elements object
    echo json_encode($addedBookArray);
} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    parse_str(file_get_contents("php://input"), $put_vars);
    $id = intval($put_vars['id']);
    //loading object from DB
    $updateBook = Book::loadFromDb($conn, $id);
    $updateBook->setAuthor($put_vars['author']);
    $updateBook->setTitle($put_vars['title']);
    $updateBook->setDescription($put_vars['description']);
    //Updating object in database
    $result = $updateBook->update($conn);
    echo json_encode($result);
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    $id = intval($del_vars['id']);
    //loading book from DB
    $book = Book::loadFromDb($conn, $id);
    //deleteing this book
    $result = $book->delete($conn);
    //returning final result
    echo json_encode($result);
}