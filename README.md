# wndr
Read/Share what others/you are thinking

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
