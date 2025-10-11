import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function initNotifications(db) {
  const bell = document.querySelector('.notif-bell');
  const panel = document.querySelector('.notif-panel');
  const badge = document.querySelector('.notif-badge');
  const list = document.querySelector('.notif-list');

  if (!bell || !panel || !badge || !list) return;

  bell.addEventListener('click', () => {
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !bell.contains(e.target)) {
      panel.setAttribute('hidden', '');
    }
  });

  await loadNotifications(db, { badge, list });
}

async function loadNotifications(db, { badge, list }) {
  list.innerHTML = "";
  const today = new Date().toISOString().split('T')[0];
  try {
    const snapshot = await getDocs(collection(db, 'technician'));
    let count = 0;
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const status = (d.status === 'Approved') ? 'Approved' : (d.status === 'Rejected' ? 'Rejected' : 'Pending');
      if (status === 'Pending' && d.registrationDate === today) {
        count++;
        const name = `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'New registration';
        const li = document.createElement('li');
        li.className = 'notif-item';
        const a = document.createElement('a');
        a.href = `register.html?id=${docSnap.id}`;
        a.textContent = name;
        li.appendChild(a);
        list.appendChild(li);
      }
    });
    if (count > 0) {
      badge.textContent = String(count);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  } catch (e) {
    console.error('Error loading notifications', e);
  }
}