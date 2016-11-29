var wndr = angular.module('wndr', [
  // Declare any module-specific AngularJS dependencies here
  'supersonic',
]);

wndr.constant('icons', {
    heart: {
        url: "/emojis/2764.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    angry: {
        url: "/emojis/1f621.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    sad: {
        url: "/emojis/2639.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    tongueOut: {
        url: "/emojis/1f61c.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    happyTears: {
        url: "/emojis/Tears_of_Joy_Emoji.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    thinking: {
        url: "/emojis/1f914.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    smiling: {
        url: "/emojis/1f600.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    grinning: {
        url: "/emojis/Grinning_Emoji_with_Smiling_Eyes.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    },
    poop: {
        url: "/emojis/1f4a9.svg",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    },
    upside_down: {
        url: "/emojis/Upside-Down_Face_Emoji.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    },
    OMG: {
        url: "/emojis/OMG_Face_Emoji.png", // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    },
    unamused: {
        url: "/emojis/Unamused_Face_Emoji.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    },
    red_flag: {
        url: "/emojis/Red_Flag_Emoji.png",
        scaledSize: new google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    }
});