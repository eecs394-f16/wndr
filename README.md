# wndr
wndr is a phone app that allows users to read and post wndrs.

# Getting started
You will need:
- the AppGyver Supersonic Framework (install the Steroids Command-Line Interface at https://academy.appgyver.com/installwizard/)
- a phone with the AppGyver Scanner app (https://itunes.apple.com/us/app/appgyver-scanner/id575076515?mt=8 for iOS and https://play.google.com/store/apps/details?id=com.appgyver.freshandroid&hl=en for Android)
- the directory pulled from this repository
- npm https://www.npmjs.com/

To run the app:
1. Open your Command Line
2. Navigate to the location of the pulled directory
3. Run npm install
4. Run `steroids connect` in the Command Line
5. Scan the resulting QR code

Configuring FireBase Api Key:

  follow the guide below to obtain a Firebase developer's key and app key
  https://firebase.google.com/docs/ios/setup

  update the app configuration at common/views/layout.html.
  change the script code:
   var config = {
      apiKey: YOUR API KEY,
      authDomain: YOUR AUTHDOMAIN
      databaseURL: YOUR URL,
      storageBucket: YOUR STORAGE BUCKET,
      messagingSenderId: YOUR ID
    };
    firebase.initializeApp(config);
...
Configuring Google Maps api:
 Sign up to be google developer and obtain the google maps api key
 update this line in common/views/layout.html
 <script src="http://maps.google.com/maps/api/js?key=your Api Key"></script>
...

Description of code is described as comments in the code.
....
Tasks remaining:
Include delete Wndr Function.
Include Center map function for google maps api.
Link up facebook api after app is released into store.
