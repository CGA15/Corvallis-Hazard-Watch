Corvallis-Hazard-Watch-Project-CS-Group ReadMe
(Temporary name till we get a better one)

In order to runt the page, you must first run "npm run build"
this will compile the public folder and the src folder into a dist folder.

any images you want should be put into the public folder under assets



In order to deploy to the server remove these three commands in the package.json file

"build": "vite build",
"build1": "npm run build",
"prestart": "npm run build1"