# BigLab 2 - Class: 2021 WA1

## Team name: wagroup_63

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

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

POST /sessions/current

    request body: email, password
    response body:  user
    response cookie: user_id
    Error responses: err

DELETE /sessions/current

    request body: -
    response body: -
    response cookie: user_id
    Error responses: -

GET /sessions/current

    request body: email, password
    response body: user
    response cookie: user_id
    Error responses: 401 "Unauthenticated User"

GET /tasks/?filter

    request body: -
    response body: tasks
    Error responses: 500 (database error)

POST /tasks

    request body: task
    response body: task_id
    Error responses: 550 (database error)

PUT /tasks/:id

    request body: task
    response body: task_id
    Error responses: 503 (PUT Error)

DELETE /tasks/:id

    request body: task_id
    response body: null
    Error responses: 550 (DELETE ERROR)




## Login instructions
To test the application, login with the following credentials


| Username           | Passoword |
|--------------------|-----------|
| John.doe@polito.it | password  |
| mhh@polito.it      | password  |

