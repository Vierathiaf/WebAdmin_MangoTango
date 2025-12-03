import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function initNotifications(db) {
  const bell = document.querySelector('.notif-bell');
  const panel = document.querySelector('.notif-panel');
  const badge = document.querySelector('.notif-badge');
  const list = document.querySelector('.notif-list');

  if (!bell || !panel || !badge || !list) return;

  // Toggle dropdown
  bell.addEventListener("click", () => {
    panel.toggleAttribute("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !bell.contains(e.target)) {
      panel.setAttribute("hidden", "");
    }
  });

  // Listen to Firestore notifications
  const notifRef = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(
    notifRef,
    (snapshot) => {
      list.innerHTML = "";
      let unseenCount = 0;

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();

        // Skip invalid notifications
        if (!d || !d.type) return;

        // Count unread
        if (d.read === false) unseenCount++;

        // Build list item
        const li = document.createElement("li");
        li.className = "notif-item";

        li.innerHTML = `
          <div class="notif-title">${d.title || "New Notification"}</div>
          <div class="notif-msg">${d.message || ""}</div>
          <small class="notif-time">${formatTime(d.createdAt)}</small>
        `;

        list.appendChild(li);
      });

      // Badge update
      if (unseenCount > 0) {
        badge.textContent = unseenCount;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    },
    (error) => {
      console.error("Notification listener error:", error);
    }
  );
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  try {
    const date = timestamp.toDate();
    return date.toLocaleString();
  } catch {
    return "";
  }
}
