# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css


  rootView:
    id: "loginView"
    location: "wndr#login" 

  preloads: [
    {
      id: "signupView"
      location: "wndr#signup"
    }
    {
      id: "index"
      location: "wndr#index"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
