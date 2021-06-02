# BigLab 2 - Class: 2021 WA1

## Team name: WAGroup63

Team members:
* s287646 Pronesti Massimiliano
* s287802 Tekam Lapa Luc-Gabin
* s286584 Hobballah Yasser
* s289417 Alashram Amr

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Here's a description of the REST API offered by the server 

* POST `/sessions`
  - request body: an object representing a user (Content-Type: `application/json`)
  ```
  {
      "email": "johndoe@polito.it",
      "passowrd": "password"
  }
  ```
  - response body:  user

* DELETE `/sessions/current`
  - request body: None
  - response body: None

* GET `/sessions/current`
  -  request body: None
  -  response body: user
  -  Error responses: `401 (Unauthenticated User)`

* GET `/tasks/?filter`
  - request body: None
  - response body: an array of objects describing the tasks (Content-Type: `application/json`)
  ```
  [{
      "id": 7,
      "description": "Study for the exam",
      "important": 1,
      "private": 1,
      "deadline": "2021-06-02 00:00",
      "completed": 1,
      "user": 1
   }, {
      "id": 11,
      "description": "foo",
      "important": 0,
      "private": 0,
      "deadline": NULL,
      "completed": 1,
      "user": 1
   },
   ...
  ]
  ```
  - Error responses: `500 (database error)`

* POST `/tasks`
  -  request body: an object representing a task (Content-Type: `application/json`)
  ```
  {
    "id": 11,
      "description": "foo",
      "important": 0,
      "private": 0,
      "deadline": NULL,
      "completed": 1,
      "user": 1
   }
  ```
  -  Error responses: `550 (database error)`

* PUT `/tasks/:id`
  -  request body: an object representing a task (Content-Type: `application/json`)
  ```
  {
      "id": 11,
      "description": "foo",
      "important": 0,
      "private": 0,
      "deadline": NULL,
      "completed": 1,
      "user": 1
   }

  ```
  -  Error responses: `503 (PUT Error)`

* DELETE `/tasks/:id`
  -  request body: None
  -  response body: None
  -  Error responses: `550 (DELETE ERROR)`




## Login instructions
To test the application, login with the following credentials


| Username           | Passoword |
|--------------------|-----------|
| john.doe@polito.it | password  |
| mhh@polito.it      | password  |



