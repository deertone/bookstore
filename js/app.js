$(function () {

    var divBooks = $('div#books');
    //pobieramy ksiazki po zaladowaniu strony
    $.ajax({
        url: 'api/books.php',
        dataType: 'json'
    }).done(function (bookList) {
        //bookList - tablica obiektow ksiazek w json
        bookList.forEach(function (singleBookJson) {
            var singleBook = JSON.parse(singleBookJson);
            //tworzymy element li z nową książk
            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><div class="bookDescription" style="margin-top:20px; font-weight: bold; color: blue; font-size: 13px;"></div></div><hr>');
            //dodajemy element do listy
            divBooks.append(newLi);
        });
    }).fail(function () {
        console.log('Error');
    });

    //dodajemy event na tytul książki

    //sposob na dodawanie eventow do elementow ladowanych dynamicznie
    //event zakladamy na dowolnego przodka NIE ZALADOWANEGO DYNAMICZNIE
    //jako drugi argument metody on() podajemy SELEKTOR (string) 
    //elementu dynamicznie ladowanego na jakim event nas interesuje
    //$(this) to element z drugiego argumentu
    divBooks.on('click', 'span.bookTitle', function () {
        //pobieramy id książki z datasetu
        var span = $(this);
        var bookId = span.parent().data('id');
        //pobieramy opis książki

        $.ajax({
            url: 'api/books.php?id=' + bookId,
            dataType: 'json'
        }).done(function (bookList) {
            //bookList - tablica obiektow ksiazek w json
            //w tym wypadku tablica 1 elementowa
            //poneiwaz pobieramy 1 ksiązke po id
            var singleBook = JSON.parse(bookList[0]);
            span.next().text(singleBook.description);
        }).fail(function () {
            console.log('Error');
        });
    });

    //DODAWANIE KSIĄŻKI

    var addBook = $('#addBook');
    addBook.on('click', function (e) {
        e.preventDefault();//KONIECZNE - poniewaz wysyłamy ajaxem
        //pobieramy sobie dane z formularza
        var form = $(this).parent();//zapisuje do zmiennej formularz

        var author = form.find('input[name=author]').val();
        var title = form.find('input[name=title]').val();
        var description = form.find('textarea[name=description]').val();

        //tworzymy obiekt z danymi do wysłania
        var sendObj = {};
        sendObj.author = author;
        sendObj.title = title;
        sendObj.description = description;
        //wysylamy żądanie ajax o dodanie książki
        $.ajax({
            url: 'api/books.php', //adres na jaki wysyłamy
            dataType: 'json', //typ danych ZWRACANYCH
            data: sendObj, //obiekt z danymi
            type: 'POST'//dodajemy więc POST (REST)
        }).done(function (bookList) {
            var singleBook = JSON.parse(bookList[0]);
            //tworzymy element li z nową książk
            var newLi = $('<div data-id="' + singleBook.id + '"><span class="bookTitle">' + singleBook.title + '</span><div class="bookDescription" style="margin-top:20px; font-weight: bold; color: blue; font-size: 13px;"></div></div><hr>');
            //dodajemy element do listy
            divBooks.append(newLi);
        }).fail(function () {

        });
    });
    
    //AKTUALIZACJA KSIĄŻEK (PUT)
    //1) do każdego diva z opisem (lub dodatkowego pod nim) dodajemy formularz edycji książki

    // var newForm = $('<form data-id="' + singleBook.id + '"><input type="text" value="' + singleBook.title + '"></form>');
    // divBooks.append(newForm);
    //
    // //2) formualrz jest ukryty domyslnie i zaladowany danymi ksiazki val('wartosc')
    // //3) dodajemy przycisk do edycji analogicznie jak w DELETE
    // //4) zakladamy event na przycisk (pamietamy ze jest ladowany dynamicznie)
    // //5) po kliknieciu pokazujemy formualarz
    // //6) po klikeniciu w submit formularza pobieramy z niego dane (podobnie jak POST)
    // //7) tworzymy obiekt do wyslania (jak w POST) - dodać ID!!!!
    // //8) wysylamy ajaxem metodą PUT przekazujac obiekt (PAMIĘTAMY o dodaniu ID
    // //9) pobieramy z bazy obiekt książki na backendzie z aktualnymi danymi
    // //10) aktualizujemy seterami dane w obiekcie
    // //11) wywołujemy metodę update()
    // //12) jak się uda to w drzewie dom aktualizujemy tytul i opis elementu
    //
    // //USUWANIE KSIĄŻEK (DELETE)
    // var deleteButton = $('#deleteButton');
    // deleteButton.one('click', 'dynamicznie', function () {

    });
    //1) dodajemy przycisk obok tytułu z usuwaniem podczas tworzenia ksiazki
    //pamietamy zeby dodac przycisk jak ladujemy przy ladowaniu strony i dodaniu (POST)
    //2) zakladamy event na przycisk (pamietamy ze on jest ladowany dynamicznie)
    //po kliknieciu pobieramy id ksiazki (rodzic) i wysylamy do ajaxa za pomocą
    //metody DELETE (bardzo podobnie jak GET)
    //3) pobieracie ksiązkę z bazy odpowiednią metoda po id (filtrujemy na int)
    //4) mając obiekt ksiązki wywołujemy metodę delete()
    //5) jeśli się uda to usuwamy książkę z drzewa DOM

    //--------------------------------------------------------------------------
    // Deleting book
    divBooks.on('click', 'button.delete', function (e) {
        e.preventDefault();
        var button = $(this); //delete button object
        var bookId = button.parent().data('id'); //id of book, from it div
        // AJAX request
        $.ajax({
            url: 'api/books.php',
            dataType: 'json',
            data: 'id=' + bookId,
            type: 'DELETE'
        }).done(function (deletedBookArray) { //deletedBookarray is array with object of deleted book with id -1 or nothing
            if (deletedBookArray) {
                button.parent().remove();
            }
        }).fail(function () {
            console.log('Error');
        });
    });

    //--------------------------------------------------------------------------
    //Editing book
    divBooks.on('click', 'button.edit', function (e) {
        e.preventDefault();
        //get id from book div we are in
        var id = $(this).parent().parent().data('id');
        //get elements with book information
        var title = $(this).parent().siblings('span.bookTitle');
        var author = $(this).siblings('span.author');
        var description = $(this).siblings('span.description');

        //--------------------------------
        //Create form, set id of book
        var editForm = $('<div class="edit" data-id="' + id + '"><form>Autor:<br><input type="text" name="author" value=""/><br>Tytuł:<br><input type="text" name="title" value=""/><br>Opis:<br><textarea name="description" value=""></textarea><br><button class="editBook">Edytuj książkę</button></form></div>');
        //get inputs from form
        var formTitle = editForm.find('input[name=title]');
        var formAuthor = editForm.find('input[name=author]');
        var formDescription = editForm.find('textarea[name=description]');
        //set values in form
        formTitle.val(title.text());
        formAuthor.val(author.text());
        formDescription.val(description.text());
        //---------------------------------

        //Add event on button from edit form
        editForm.on('click', 'button.editBook', function (e) {
            e.preventDefault();

            //get current values, and insert them to object
            var editObj = {};
            editObj.id = id;
            editObj.title = formTitle.val();
            editObj.author = formAuthor.val();
            editObj.description = formDescription.val();

            //AJAX request
            $.ajax({
                url: 'api/books.php',
                dataType: 'json',
                data: editObj,
                type: 'PUT'
            }).done(function (editBookArray) { //editBookArray is an array with object of edited book, or nothing
                editBook = editBookArray[0]; //server returns array
                //update values on page
                title.text(editBook.title);
                author.text(editBook.author);
                description.text(editBook.description);
            }).fail(function () {
                console.log('Error');
            });

        });

        // Append form
        if ($(this).siblings('div.edit').length) {
            $(this).siblings('div.edit').toggle();
        } else {
            editForm.insertAfter($(this));
        }

    });

});
});