var GitHubApi = require("node-github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});

var token;

github.authenticate({
    type: "oauth",
    token: token
});

// Can get token with
// https://github.com/login/oauth/authorize?client_id=d955547d16b4c81efcb0&scope=repo

github.user.getFollowingFromUser({
    user: "eob"
}, function(err, res) {
    console.log(JSON.stringify(res));
});
