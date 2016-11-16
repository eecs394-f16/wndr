var wndr = angular.module('wndr', [
  // Declare any module-specific AngularJS dependencies here
  'supersonic',
]);

wndr.constant('icons', {
    heart: {
        url: "/emojis/heavy-black-heart.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    angry: {
        url: "/emojis/Very_Angry_Emoji.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    sad: {
        url: "/emojis/Very_sad_emoji_icon_png.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    tongueOut: {
        url: "/emojis/Tongue_Out_Emoji_with_Winking_Eye.png",
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
        url: "/emojis/Thinking_Face_Emoji.png",
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    },
    smiling: {
        url: "/emojis/Smiling_Emoji_with_Eyes_Opened.png",
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
        url: "/emojis/Poop_Emoji.png",
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