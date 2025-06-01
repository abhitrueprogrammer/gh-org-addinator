// Octokit.js
// https://github.com/octokit/core.js#readme
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "YOUR_GITHUB_TOKEN", // Replace with your GitHub token
});

const users = []; // Replace with the list of usernames you want to invite
const org = "YOUR_ORG_NAME"; // Replace with your organization name

const already = [];
const notFound = [];
const successful = [];
for (const user of users) {
  let id = 0;
  try {
    const userData = await octokit.rest.users.getByUsername({
      username: user,
    });
    id = userData.data.id;
  } catch (error) {
    if (error.status === 404) {
      notFound.push(user);
    }
    continue;
  }

  try {
    const res = await octokit.request(`POST /orgs/${org}/invitations`, {
      org: "ORG",
      invitee_id: id,
      role: "direct_member",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (res.status === 201) {
      successful.push(user);
    }
  } catch (error) {
    if (
      error.status === 422 &&
      error.message.includes("Invitee is already a part of this organization")
    ) {
      already.push(user);
    }
  }
}
console.log("Invitations sent successfully!");
console.log("people already added:", already);
console.log("people not found:", notFound);
console.log("people added successfully:", successful);
