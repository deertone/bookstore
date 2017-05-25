$(function () {
    //loading all books from database
    var divBooks = $('div#books');

    $.ajax({
        url: 'api/books.php',
        dataType: 'json'
    }).done(function (bookList) {

        bookList.forEach(function (singleBookJson) {
            var singleBook = JSON.parse(singleBookJson);
            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><button class="btn remove btn-danger pull-right">Usuń</button><div class="bookDescription" style="margin-top:20px; font-weight: bold; font-size: 15px;"></div><hr></hdiv>');
            divBooks.append(newLi);
        });
    }).fail(function () {
        console.log('Error');
    });

    divBooks.on('click', 'span.bookTitle', function () {
        //id from dataset
        var span = $(this);
        var bookId = span.parent().data('id');
        //description book
        var spanDescription = span.siblings('.bookDescription');
        if (spanDescription.children().length) {
            spanDescription.toggle();
        }

        $.ajax({
            url: 'api/books.php?id=' + bookId,
            dataType: 'json'
        }).done(function (bookList) {
            //bookList - table full of JSON OBJECT in this case just one object inside
            var singleBook = bookList;
            span.next().next().html('<span class="author">' + singleBook.author + '</span><br>' + '<span class="description">' + singleBook.description + '</span><hr><button class="btn edit btn-primary">Edytuj</button>');
        }).fail(function () {
            console.log('Error');
        });
    });

    //ADD
    var addBook = $('#addBook');
    addBook.on('click', function (e) {

        e.preventDefault();

        var form = $(this).parent();//save from to variable

        var author = form.find('input[name=author]').val();
        var title = form.find('input[name=title]').val();
        var description = form.find('textarea[name=description]').val();

        //new object to send
        var sendObj = {};
        sendObj.author = author;
        sendObj.title = title;
        sendObj.description = description;
        $.ajax({
            url: 'api/books.php', //adres to send
            dataType: 'json', //type of returning data
            data: sendObj, //object with data
            type: 'POST'// set POST because of (REST)
        }).done(function (bookList) {
            var singleBook = JSON.parse(bookList[0]);


            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><button type="button" class="remove btn btn-danger pull-right">Usuń</button><div class="bookDescription" style="margin-top:20px; font-weight: bold; font-size: 13px;"></div></div><hr>');
            divBooks.append(newLi);
        }).fail(function () {

        });
    });
    //EDIT
    //to edit book i need to set event on edit button, but this button doesn't exist so i need to set event on him existing parent
    divBooks.on('click', 'button.edit', function (e) {
        e.preventDefault();
        // looking for some specific data of existing element
        var id = $(this).parent().parent().data('id');
        var title = $(this).parent().siblings('span.bookTitle');
        var author = $(this).siblings('span.author');
        var description = $(this).siblings('span.description');

        //adding form to edit choosen book
        var formToEdit = $('<hr><div class="editForm form-group" data-id"' + id + '"><form>Autor:<br><input type="text" class="form-control" name="author"/><hr>Tytuł:<br><input type="text" name="title" class="form-control"/><hr>Opis:<br><textarea name="description" class="form-control"></textarea><hr><button type="button" class="btn editBook btn-primary">Zatwierdź zmiany</button></form></div>');
        // after showed edit form, looking for input
        var formTitle = formToEdit.find('input[name=title]');
        var formAuthor = formToEdit.find('input[name=author]');
        var formDescription = formToEdit.find('textarea[name=description]');
        // fill this input by currently existing data from major div with description
        formTitle.val(title.text());
        formAuthor.val(author.text());
        formDescription.val(description.text());
        //form can appear and disappear
        if ($(this).siblings('div.editForm').length) {
            $(this).siblings('div.editForm').toggle();
        } else {
            formToEdit.insertAfter($(this));
        }
        //this event is on the submit button
        formToEdit.on('click', 'button.editBook', function (e) {
            e.preventDefault();
            //creating object with data provided from input form and sending by Ajax to database
            var editObj = {};
            editObj.id = id;
            editObj.title = formTitle.val();
            editObj.author = formAuthor.val();
            editObj.description = formDescription.val();
            //use Ajax from with JSON format of data
            $.ajax({
                url: 'api/books.php',
                dataType: 'json',
                data: editObj,
                type: 'PUT'
            }).done(function (editBook) {
                editBook = JSON.parse(editBook[0]);
                //if success put new value in the existing span with all description
                title.text(editBook.title);
                author.text(editBook.author);
                description.text(editBook.description);

            }).fail(function () {
                console.log('Error');
            });

        });
    });
    //DELETE
    //event is on the div id books because button doesn't exist onload page
    divBooks.on('click', 'button.remove', function (e) {
        //prevent default because this is button
        e.preventDefault();
        var button = $(this);
        // search value of data-id
        var bookId = button.parent().data('id');
        //create variable for sending to php
        var info = 'id=' + bookId;
        //using Ajax to delete
        $.ajax({
            url: 'api/books.php',
            dataType: 'json',
            data: info,
            type: 'DELETE'
        }).done(function (success) {
            if (success) {
                //remove div with all books description
                button.parent().remove();
            }
        }).fail(function () {
            console.log('Something went wrong');
        });
    });

});