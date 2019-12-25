import Model from "./model.js";

export default class Follower extends Model {
    static baseRoute() {
        return "followers";
    }

    static index(parameters, completion) {
        return Model.index(Follower.baseRoute(), parameters, completion);
    }

    constructor(followerUserId, followingUserId) {
        super(Follower.baseRoute());
        this.followerUserId = followerUserId;
        this.followingUserId = followingUserId;
    }

    parameters() {
        return {
            "follower_user_id": this.followerUserId,
            "following_user_id": this.followingUserId
        }
    }
}
