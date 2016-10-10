# Widgets Single Page App Demo
This is a simple multi-page HTML site. It hits an API for showing/listing user and widget information.


## Features


### Dashboard page
- Loads "id" and "name" information of all users and widgets. Also shows their quantities.
- Use the input fields to search through users or widgets. It searchs from all data, except from the user "gravatar" url and widget "melts" information.
- Click on any table row to get detailed information from users or widgets. Click again to close it.


### Users page
- Loads a list containing all users information.
- Use the input field to search through users data (except from "gravatar" url).


### Widgets page
- Loads a list containing all widgets information.
- Click on "+ Create" button (top right) to add a new widget. You will be redirected to the end of the page where you can fill its data. Click on "Create" button to add it.
- Click on any table row to edit any widget information. You will be redirected to the end of the page where you can change it. Click on "Edit" button to apply it.


# Requirements
It´s not necessary any extra requirement.


## How to run
Simply open the main page (index.html) in the browser and navigate through the pages from the left menu.


## Tested browser
Google Chrome.


# API Documentation
There's an API available at `http://spa.tglrw.com:4000` for retrieving the data used to make this app. The hard-coded data in the existing HTML is only a placeholder for style. The API returns and expects to receive JSON-encoded data.


## The endpoints are as follows:
- GET `/users` [http://spa.tglrw.com:4000/users](http://spa.tglrw.com:4000/users)
- GET `/users/:id` [http://spa.tglrw.com:4000/users/:id](http://spa.tglrw.com:4000/users/:id)
- GET `/widgets` [http://spa.tglrw.com:4000/widgets](http://spa.tglrw.com:4000/widgets)
- GET `/widgets/:id` [http://spa.tglrw.com:4000/widgets/:id](http://spa.tglrw.com:4000/widgets/:id)
- POST `/widgets` for creating new widgets [http://spa.tglrw.com:4000/widgets](http://spa.tglrw.com:4000/widgets)
- PUT `/widgets/:id` for updating existing widgets [http://spa.tglrw.com:4000/widgets/:id](http://spa.tglrw.com:4000/widgets/:id)
