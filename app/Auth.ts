import passport from "passport";
import passportDiscord from "passport-discord";
import { getMinecraftUUID } from "./Database";
var DiscordStrategy = passportDiscord.Strategy;

var scopes = ["identify"];

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/auth/discord/callback",
      scope: scopes,
    },
    function (accessToken, refreshToken, profile, done) {
      getMinecraftUUID(profile.id).then((minecraftUUID) => {
        process.nextTick(function () {
          profile["minecraftUUID"] = minecraftUUID;
          return done(null, profile);
        });
      });
    }
  )
);
