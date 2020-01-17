# EPSI Schedule API


### About
Simple API to get EPSI Schedule.


### Install
````
npm install
````


### Start
````
npm start
````

The API runs on port ````3000```` by default, and the root can be accessed by navigating to ````http://localhost:3000/{endPoint}```` in your browser.


### EndPoints
- ````http://localhost:3000/schedule/day```` => get the schedule of one day based on particular date.
    - parameters : date, name, lastName
    - ex : ````http://localhost:3000/schedule/day?date=2020-01-17&name=jean&lastName=dupont````

- ````http://localhost:3000/schedule/weekDate```` => get the schedule of one week based on particular date.
    - parameters : date, name, lastName
    - ex : ````http://localhost:3000/schedule/weekDate?date=2020-01-17&name=jean&lastName=dupont````

- ````http://localhost:3000/schedule/week```` => get the schedule of the current week.
    - parameters : name, lastName
    - ex : ````http://localhost:3000/schedule/week?name=jean&lastName=dupont````

- ````http://localhost:3000/schedule/nextweek```` => get the schedule of the next week based on current date.
    - parameters : name, lastName
    - ex : ````http://localhost:3000/schedule/nextweek?name=jean&lastName=dupont````

- ````http://localhost:3000/schedule/today```` => get today schedule.
    - parameters : name, lastName
    - ex : ````http://localhost:3000/schedule/today?name=jean&lastName=dupont````

- ````http://localhost:3000/schedule/tomorrow```` => get tomorrow schedule.
    - parameters : name, lastName
    - ex : ````http://localhost:3000/schedule/tomorrow?name=jean&lastName=dupont````


### License
Under the MIT License