import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function initNotifications(db) {
  const bell = document.querySelector('.notif-bell');
  const panel = document.querySelector('.notif-panel');
  const badge = document.querySelector('.notif-badge');
  const list = document.querySelector('.notif-list');

  if (!bell || !panel || !badge || !list) return;

  // Toggle dropdown and mark as read
  bell.addEventListener("click", async () => {
    const isHidden = panel.hasAttribute("hidden");
    panel.toggleAttribute("hidden");

    if (isHidden) {
      // Mark all unread notifications as read
      const notifRef = collection(db, "notifications");
      const snapshot = await getDocs(notifRef);

      for (const n of snapshot.docs) {
        const d = n.data();
        if (d.read === false) {
          await updateDoc(doc(db, "notifications", n.id), { read: true });
        }
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !bell.contains(e.target)) {
      panel.setAttribute("hidden", "");
    }
  });

  // Listen to notifications
  const notifRef = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(notifRef, (snapshot) => {
    list.innerHTML = "";
    let count = 0;

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.read === false) count++;

      const li = document.createElement("li");
      li.className = "notif-item";
      li.innerHTML = `
        <div class="notif-title">${d.title}</div>
        <div class="notif-msg">${d.message}</div>
        <small class="notif-time">${new Date(d.createdAt.toDate()).toLocaleString()}</small>
      `;
      list.appendChild(li);
    });

    // Badge update
    if (count > 0) {
      badge.textContent = count;
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  });
}
