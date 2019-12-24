import Model from "./model.js";

export default class User extends Model {
    static baseRoute() {
        return "users";
    }

    static index(parameters, completion) {
        return Model.index(User.baseRoute(), parameters, completion);
    }

    constructor(name, password, bio_text, profile_image_path, email, email_verified_at, remember_token) {
        super(User.baseRoute());
        this.name = name;
        this.password = password;
        this.bio_text = bio_text;
        this.profile_image_path = profile_image_path;
        this.email = email;
        this.email_verified_at = email_verified_at;
        this.remember_token = remember_token;
    }

    parameters() {
        return {
            name: this.name,
            password: this.password,
            bio_text: this.bio_text,
            profile_image_path: this.profile_image_path,
            email: this.email,
            email_verified_at: this.email_verified_at,
            remember_token: this.remember_token,
        };
    }
}
