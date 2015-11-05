## Neighborhood Map Project

My challenge was to develop a single page application featuring a map of a neighborhood I would like to visit.

### Getting started

There are two directories: development and production.
"development" directory consists of files for development goals, "production" - for website optimization.

Download this repository to your computer or any other device, like smartphone or tablet, choose the "production" directory and open index.html in any browser.

### What libraries were using

- Bootstrap
- jQuery
- KnockoutJS

### What have done

- Created View using Bootstrap for responsive design
- Used the Google Map API to add map to my application
- Used Wikipedia API to add additional information about places on the map
- Added following functionalities such as:
  - markers on the map
  - list of places which depends on the markers (when you click on the marker on the map or on the item in the list, the marker is bouncing, the infowindow with Wikipedia link opens)
  - search bar (you can input text in it, and list of markers and markers by theirselves will be filtering by your query)
  - error message handling (if the Google Map or Wikipedia resources are not available you will receive user-friendly message about that)
- Minified the index.html and app.js to affect high speed of opening the webpage using Sublime Minifier


