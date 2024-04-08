# Revealer's Image Handling System

This document outlines the basic components of Revealer’s image handling system implemented as of Feb 6th, 2024. 

Currently, images that need to be uploaded weekly are updated on MongoDB database using the following scripts:

addThemeScript.js : this script adds a theme to the database based on themeName and date provided. 

addImageScript.js  : this script adds an image to the database based on theme name provided. (note: if new theme is being added, make sure to run addThemeScript.js)

cleanupThemes.js : this script makes sure the image array in the theme schema doesn’t contain any references to deleted images.

assignDayOfWeek.js : this script randomly assign the days to the images added to a theme (prerequisite is that there are more than or equal to 7 images in a theme)


# Instructions

Above scripts need to be run from console:

Go to server folder in the code base

type 

`node src/services/assignDayOfWeek.js.`

 (replace the name of js file for other function)

Run the command and check the MongoDB database.

### NOTE: 

While running addImageScript.js, make sure to update the query value to get respective image.