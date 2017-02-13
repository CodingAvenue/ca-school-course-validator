# ca-school-course-validator

Validator for CA School Courses.

## Requirements

 - [NodeJS v7](https://nodejs.org/)

## Installation

 - `npm install CodingAvenue/ca-school-course-validator --save`

## Usage

```javascript
 const courseValidator = require('course-validator')

 courseValidator('/path/to/my/awesome/course', function( error, result ) {
     if ( error ) throw error

     if ( result.status === 'Success' ) {
         console.log("My Course is valid!!!")
     }
     else {
         result.messages.forEach( function( message ) {
             console.log(message)
         })
     }
 })
```

## Running on the console

 - cd to the bin directory then do

`nodejs validate-course.js /path/to/my/awesome/course`
