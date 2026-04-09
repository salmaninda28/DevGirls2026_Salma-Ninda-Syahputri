const labelMap = { pweb: 'Pemrograman Web', basisdata: 'Desain Basis Data', indonesia: 'Bahasa Indonesia' };
let tasks = [
    { id: 1, nama: 'Tugas Project Web',  tanggal: today(), kategori: 'pweb',     deskripsi: 'Membuat landing page dengan HTML & CSS.', status: 'done'     },
    { id: 2, nama: 'Belajar JavaScript', tanggal: today(), kategori: 'pweb',     deskripsi: 'Mempelajari konsep DOM manipulation.',     status: 'progress' },
];
let nextId = 3, activeFilter = null;

function today() { return new Date().toISOString().split('T')[0]; }

function badgeClass(s) { return s==='done'?'status-done':s==='progress'?'status-progress':'status-profres'; }
function badgeLabel(s) { return s==='done'?'Selesai':s==='progress'?'Progres':'Profres'; }

function renderTasks() {
    const list   = document.getElementById('taskList');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const kat    = document.getElementById('filterKategori').value;

    const filtered = tasks.filter(t => {
        const ok = t.nama.toLowerCase().includes(search) && (kat ? t.kategori===kat : true);
        if (activeFilter==='today')   return ok && t.tanggal===today() && t.status!=='done';
        if (activeFilter==='pending') return ok && t.status!=='done';
        if (activeFilter==='done')    return ok && t.status==='done';
        return ok;
    });

    list.innerHTML = '';
    document.getElementById('emptyState').style.display = filtered.length ? 'none' : 'block';

    filtered.forEach(t => {
        const div = document.createElement('div');
        div.className = 'task-item' + (t.status==='done' ? ' checked' : '');
        div.innerHTML = `
            <input type="checkbox" ${t.status==='done'?'checked':''} onchange="toggleDone(${t.id})">
            <span class="task-name" style="cursor:pointer" onclick="openModal(${t.id})">${t.nama}</span>
            <span class="task-deadline">${t.tanggal}</span>
            <span class="badge ${badgeClass(t.status)}">${badgeLabel(t.status)}</span>
            <button class="btn-delete" onclick="deleteTask(${t.id})">🗑️</button>`;
        list.appendChild(div);
    });

    document.getElementById('countToday').textContent   = tasks.filter(t=>t.tanggal===today()&&t.status!=='done').length;
    document.getElementById('countPending').textContent = tasks.filter(t=>t.status!=='done').length;
    document.getElementById('countDone').textContent    = tasks.filter(t=>t.status==='done').length;
}

function toggleDone(id) {
    const t = tasks.find(t=>t.id===id);
    if (t) { t.status = t.status==='done' ? 'progress' : 'done'; renderTasks(); }
}
function deleteTask(id) { tasks = tasks.filter(t=>t.id!==id); renderTasks(); }
function filterByStatus(type) { activeFilter = activeFilter===type ? null : type; document.getElementById('task').scrollIntoView({behavior:'smooth'}); renderTasks(); }

function addTask() {
    const nama     = document.getElementById('inputNama').value.trim();
    const tanggal  = document.getElementById('inputTanggal').value;
    const kategori = document.getElementById('inputKategori').value;
    const deskripsi= document.getElementById('inputDeskripsi').value.trim();
    if (!nama||!tanggal||!kategori) { alert('Nama tugas, deadline, dan kategori wajib diisi!'); return; }
    tasks.push({id:nextId++, nama, tanggal, kategori, deskripsi, status:'progress'});
    document.getElementById('inputNama').value = '';
    document.getElementById('inputTanggal').value = '';
    document.getElementById('inputKategori').value = '';
    document.getElementById('inputDeskripsi').value = '';
    activeFilter = null;
    renderTasks();
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 2800);
    document.getElementById('task').scrollIntoView({behavior:'smooth'});
}

function openModal(id) {
    const t = tasks.find(t=>t.id===id); if (!t) return;
    document.getElementById('modalDeadline').textContent = '📅 ' + t.tanggal;
    document.getElementById('modalTitle').textContent    = t.nama;
    document.getElementById('modalKategori').textContent = '🏷️ ' + (labelMap[t.kategori]||t.kategori);
    document.getElementById('modalDesc').textContent     = t.deskripsi || 'Tidak ada deskripsi.';
    document.getElementById('taskModal').classList.add('open');
}
function closeModal() { document.getElementById('taskModal').classList.remove('open'); }
document.getElementById('taskModal').addEventListener('click', e=>{ if(e.target===e.currentTarget) closeModal(); });

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    this.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterKategori').addEventListener('change', renderTasks);

window.addEventListener('scroll', ()=>{
    let cur = '';
    ['home','tugasebelumnya','task','taskentry'].forEach(id=>{
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop-100) cur = id;
    });
    document.querySelectorAll('.nav-links a').forEach(a=>{
        a.classList.toggle('active', a.getAttribute('href')==='#'+cur);
    });
});

renderTasks();
