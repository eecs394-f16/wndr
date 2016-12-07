# wndr
wndr is a phone app that allows users to read and post wndrs.

# Getting started
You will need
To have:

- the AppGyver Supersonic Framework (install the Steroids Command-Line Interface at https://academy.appgyver.com/installwizard/)
- a phone with the AppGyver Scanner app (https://itunes.apple.com/us/app/appgyver-scanner/id575076515?mt=8 for iOS and https://play.google.com/store/apps/details?id=com.appgyver.freshandroid&hl=en for Android)
- the directory pulled from this repository 
- npm https://www.npmjs.com/
- a Firebase project

To configure the Firebase API key:

1. Follow [this guide](https://firebase.google.com/docs/ios/setup) to obtain your API key, auth Domain, database URL, etc.
2. Go to '../app/common/views/layout.html'
3. Replace with the details from Step 1:
```javascript
var config = {
  apiKey: YOURAPIKEY,
  authDomain: YOURAUTHDOMAIN
  databaseURL: YOURURL,
  storageBucket: YOURSTORAGEBUCKET,
  messagingSenderId: YOURID
};
```
To configure Google Maps API:

1. Sign up to be a Google Developer
2. Optain the Google Maps API key
3. Go to '../app/common/views/layout.html'
4. Replace API key in this:
```javascript
<script src="http://maps.google.com/maps/api/js?key=YOUR API KEY"></script>
```

To run the app:

1. Open your Command Line
2. Navigate to the location of the pulled directory
3. Run `steroids connect` in the Command Line (If you run into missing dependencies, install them manually with `npm`)
4. Scan the resulting QR code

Description of code is described as comments in the code.
....
Tasks remaining:
Include delete Wndr Function.
Include Center map function for google maps api.
Link up facebook api after app is released into store.
