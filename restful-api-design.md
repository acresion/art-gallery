### List all the libraries
GET: /libraries

response: 
```json
{
    "entries": [
        {
            "libraryId": 123,
            "name": "Bobby Smith"
        },
        {
            "libraryId" : 111,
            "name": "Martin Brodeur"
        }
        ]
}
```
### List all the books in a library
GET /libraries/{libraryId}/books
For this purposes of this exersise, assume that the server code will process the request and gather the information possible

response: 


```json 
{
    "entries": [
        {
            "bookId" : 1,
            "title" : "Updated Title",
            "author" : "sergiu adam"
        }
    ]
}
```
### List book details 

`GET: /libraries/{libraryId}/books/{bookId}`

response:
```json 
 {
    "bookId" : 1,
    "title" : "Updated Title",
    "author" : "sergiu adam",
    "publisher": "random publishers",
    "Print Year" : 2015,
    "status" : Bookstatus

}
```
### Add book to library
POST: /libraries/{libraryId}/books

Payload

```json 
 {
    "title" : "Updated Title",
    "author" : "sergiu adam",
    "publisher": "random publishers",
    "Print Year" : 2015
}
```

Bookstatus
enum
```json
{
    "avaliable" | "checked-out" | "returned" | "in-repairs" 
}
```

return: status 

- 201, (successful response, means the object was created)
- 404 (couldn't find library ID)

response:
```json 
 {
    "bookId" : 2,
    "title" : "Updated Title",
    "author" : "sergiu adam",
    "publisher": "random publishers",
    "Print Year" : 2015,
    "status" : Bookstatus

 }
 ```

### Check out a book from a library

PUT /libraries/{libraryId}/books/{bookId}/checkout

status code:
200(successful checkout)
409(someone else checked out the book)
404(library or book not found)

response:
```json 
 {
    "bookId" : bookId,
    "title" : "Updated Title",
    "author" : "sergiu adam",
    "publisher": "random publishers",
    "Print Year" : 2015,
    "status" : "checked-out"

 }
```

### Return a book back to the library

PUT /libraries/{libraryId}/books/{bookId}/return

status codes:
200 (successful return)
404 (library or book not found)

### Remove a book from the library

DELETE /libraries/{libraryId}/books/{bookId}

status codes:
200 (book successfully deleted)
404  (book or library ID doesn't exist)



