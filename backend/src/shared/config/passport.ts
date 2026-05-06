import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { AuthService } from "../../modules/auth/auth.service";
import dotenv from "dotenv";

dotenv.config();

const authService = new AuthService();

// 1. Cấu hình Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.CALLBACK_URL_HOST || "http://localhost:5000"}/api/auth/google/callback`,
            },
            async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error("Google account has no email"), undefined);
                }

                const user = await authService.upsertSocialUser({
                    email,
                    name: profile.displayName,
                    avatar: profile.photos?.[0].value,
                    provider: "google",
                    providerAccountId: profile.id,
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                return done(null, user);
            } catch (error) {
                return done(error as Error, undefined);
            }
            }
        )
    );
} else {
    console.warn("Google OAuth credentials missing. Google login will be disabled.");
}

// 2. Cấu hình Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: `${process.env.CALLBACK_URL_HOST || "http://localhost:5000"}/api/auth/facebook/callback`,
                profileFields: ["id", "displayName", "photos", "email"],
            },
            async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
                try {
                    const email = profile.emails?.[0].value;
                    if (!email) {
                        // Facebook đôi khi không trả về email nếu user đăng ký bằng SĐT
                        return done(new Error("Facebook account has no email. Please register with email."), undefined);
                    }

                    const user = await authService.upsertSocialUser({
                        email,
                        name: profile.displayName,
                        avatar: profile.photos?.[0].value,
                        provider: "facebook",
                        providerAccountId: profile.id,
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
} else {
    console.warn("Facebook OAuth credentials missing. Facebook login will be disabled.");
}

// Passport serialize/deserialize (Dùng cho Session, nếu bạn dùng JWT hoàn toàn thì có thể bỏ qua nhưng vẫn nên define cơ bản)
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await authService.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
