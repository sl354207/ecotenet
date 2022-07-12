export async function updateUser(profile, endpoint) {
  const res = await fetch(`/api/${endpoint}/users/${profile.name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  return res;
}
export async function deleteUser(name, endpoint) {
  const res = await fetch(`/api/${endpoint}/users/${name}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(name),
  });

  return res;
}

export async function deleteUserMedia(name, endpoint) {
  const res = await fetch(`/api/${endpoint}/media/${name}`);

  return res;
}
export async function createNotification(notification) {
  const res = await fetch("/api/admin/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  });

  return res;
}
export async function updateNotification(notification) {
  const res = await fetch(`/api/dashboard/notifications/${notification.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification),
  });

  return res;
}
export async function createPost(post) {
  const res = await fetch("/api/dashboard/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  return res;
}
export async function updatePost(post, endpoint) {
  const res = await fetch(`/api/${endpoint}/posts/${post._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  return res;
}
export async function deletePost(post, endpoint) {
  const res = await fetch(`/api/${endpoint}/posts/${post._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  return res;
}
export async function deletePostMedia(name, postId, endpoint) {
  const res = await fetch(`/api/${endpoint}/media/${name}?post_id=${postId}`);

  return res;
}
export async function createComment(comment) {
  const res = await fetch("/api/dashboard/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  return res;
}
export async function updateComment(comment, endpoint) {
  const res = await fetch(`/api/${endpoint}/comments/${comment.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  return res;
}
export async function deleteComment(comment, endpoint) {
  const res = await fetch(`/api/${endpoint}/comments/${comment.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });

  return res;
}

export async function createFlag(flag) {
  const res = await fetch("/api/dashboard/flags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flag),
  });

  return res;
}
export async function updateFlag(flag) {
  const res = await fetch(`/api/admin/flags/${flag.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flag),
  });

  return res;
}
