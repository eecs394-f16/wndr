# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css


  initialView:
    id: "loginView"
    location: "wndr#login" 

  tabs: [
    {
      title: "Home"
      id: "index"
      location: "wndr#index"
    }
    {
      title: "Share"
      id: "newThought"
      location: "wndr#newThought"
    }
  ]
  preloads: [
    {
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
