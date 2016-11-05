# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css


   #rootView:
   #  title: "Index"
   #  id: "index"
   #  location: "wndr#index" 

  tabs: [
    {
      title: "Home"
      id: "index"
      location: "wndr#index"
    }
    {
      title: "My Profile"
      id: "person"
      location: "example#learn-more"
    }
  ]
  preloads: [
    {
      id: "learn-more"
      location: "example#learn-more"
    }
    {
      id: "using-the-scanner"
      location: "example#using-the-scanner"
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
  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
