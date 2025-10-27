//lab B mk55784
const STORAGE_KEY = 'labB1';

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function formatISOToDDMMYYYY(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d)) return '';
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  return dd + '.' + mm + '.' + d.getFullYear();
}
function dateInputValueFromISO(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d)) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}
function isoFromDateInput(value){ return value ? value : ''; }

let tasks = [];

function loadTasks(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      tasks = JSON.parse(raw);
    } else {
      tasks = [
        { id: uid(), title: "zadanie", date: "2025-10-16", done:false },
        { id: uid(), title: "pójść na spacer", date: "2025-10-16", done:false },
        { id: uid(), title: "zadanie 1", date: "2025-10-24", done:false },
      ];
      saveTasks();
    }
  } catch(e){
    console.error('load error', e);
    tasks = [];
  }
}
function saveTasks(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const tasksListEl = document.getElementById('tasks');
const searchEl = document.getElementById('search');
const addBtn = document.getElementById('addBtn');
const newTitleEl = document.getElementById('newTitle');
const newDateEl = document.getElementById('newDate');

newDateEl.min = new Date().toISOString().split('T')[0]; 

function render(filter=''){
  tasksListEl.innerHTML = '';
  const q = filter.trim().toLowerCase();

  const visible = tasks
    .filter(t => {
      if(!q) return true;
      if(q.length < 2) return true; 
      return t.title.toLowerCase().includes(q);
    })
    .sort((a,b)=>{
      if(!a.date && !b.date) return a.title.localeCompare(b.title);
      if(!a.date) return 1;
      if(!b.date) return -1;
      return a.date.localeCompare(b.date) || a.title.localeCompare(b.title);
    });

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';
    li.dataset.id = task.id;

    const cbWrap = document.createElement('div');
    cbWrap.style.display='flex'; cbWrap.style.alignItems='center';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = !!task.done; cb.setAttribute('aria-label','Zadanie ukończone');
    cb.addEventListener('change', ()=>{ task.done = cb.checked; saveTasks(); render(searchEl.value); });
    cbWrap.appendChild(cb);

    const titleEl = document.createElement('div');
    titleEl.className = 'title' + (task.done ? ' done' : '');
    titleEl.tabIndex = 0;
    titleEl.title = 'Kliknij, aby edytować nazwę';
    if(q && q.length >= 2){
      const idx = task.title.toLowerCase().indexOf(q);
      if(idx !== -1){
        const before = task.title.slice(0, idx);
        const match = task.title.slice(idx, idx+q.length);
        const after = task.title.slice(idx+q.length);
        titleEl.innerHTML = escapeHtml(before) + '<span class="mark">' + escapeHtml(match) + '</span>' + escapeHtml(after);
      } else {
        titleEl.textContent = task.title;
      }
    } else {
      titleEl.textContent = task.title;
    }
    titleEl.addEventListener('click', ()=> ZmienTytul(task, titleEl));
    titleEl.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') ZmienTytul(task, titleEl); });

    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.title = 'Kliknij, aby edytować datę';
    dateEl.tabIndex = 0;
    dateEl.textContent = task.date ? formatISOToDDMMYYYY(task.date) : 'dd.mm.rrrr';
    dateEl.addEventListener('click', ()=> startEditDate(task, dateEl));
    dateEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') startEditDate(task, dateEl); });

    const btnWrap = document.createElement('div');
    btnWrap.style.textAlign='right';
    const del = document.createElement('button');
    del.className = 'small-btn'; del.type = 'button'; del.textContent = 'Delete';
    del.addEventListener('click', ()=>{
      if(confirm('Usunąć to zadanie?')) {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        render(searchEl.value);
      }
    });
    btnWrap.appendChild(del);

    li.appendChild(cbWrap);
    li.appendChild(titleEl);
    li.appendChild(dateEl);
    li.appendChild(btnWrap);
    tasksListEl.appendChild(li);
  });

  if(visible.length === 0){
    const empty = document.createElement('div');
    empty.style.padding='18px';
    empty.style.color='var(--muted)';
    empty.textContent = 'Brak zadań do wyświetlenia.';
    tasksListEl.appendChild(empty);
  }
}

function ZmienTytul(task, titleEl){
  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.title || '';
  input.className = 'edit-input';
  input.setAttribute('aria-label','Edycja nazwy zadania');
  titleEl.replaceWith(input);
  input.focus();
  input.selectionStart = input.selectionEnd = input.value.length;

  function zapisz(save){
    const newTitle = input.value.trim();
    if(save){
      if(newTitle.length < 3){
        alert('Nazwa musi miec co najmniej 3 znaki.');
        input.focus();
        return;
      }
      if(newTitle.length > 255){
        return;
      }
      task.title = newTitle;
    }
    saveTasks();
    render(searchEl.value);
  }

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') zapisz(true);
    if(e.key === 'Escape') zapisz(false);
  });
  input.addEventListener('blur', ()=> zapisz(true));
}

function startEditDate(task, dateEl){
  const input = document.createElement('input');
  input.type = 'date';
  input.className = 'edit-input';
  input.setAttribute('aria-label','Edycja daty zadania');
  input.value = dateInputValueFromISO(task.date);
  input.min = new Date().toISOString().split('T')[0];
  dateEl.replaceWith(input);
  input.focus();

  function zapisz(save){
    if(save){
      const val = input.value;
      if(val){
        const chosen = new Date(val);
        const today = new Date();
        chosen.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        if(chosen < today){
          alert('Data musi być dzisiaj lub pozniej');
          input.focus();
          return;
        }
        task.date = isoFromDateInput(val);
      } else {
        task.date = '';
      }
    }
    saveTasks();
    render(searchEl.value);
  }

  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') zapisz(true);
    if(e.key === 'Escape') zapisz(false);
  });
  input.addEventListener('blur', ()=> zapisz(true));
}

function dodajNowe(){
  const title = newTitleEl.value.trim();
  const dateVal = newDateEl.value;

  if(title.length < 3){
    alert('Nazwa zadania musi miec minimum 3 znaki');
    newTitleEl.focus();
    return;
  }
  if(title.length > 255){
    newTitleEl.focus();
    return;
  }
  if(dateVal){
    const chosen = new Date(dateVal);
    const today = new Date();
    chosen.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    if(chosen < today){
      alert('Data musi byc dzisiaj lub pozniej');
      newDateEl.focus();
      return;
    }
  }

  const t = { id: uid(), title, date: dateVal ? isoFromDateInput(dateVal) : '', done:false };
  tasks.push(t);
  saveTasks();
  newTitleEl.value = '';
  newDateEl.value = '';
  render(searchEl.value);
  newTitleEl.focus();
}

addBtn.addEventListener('click', dodajNowe);
newTitleEl.addEventListener('keydown', (e)=> { if(e.key === 'Enter') dodajNowe(); });
searchEl.addEventListener('input', ()=> render(searchEl.value));

function escapeHtml(s){
  return s.replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}
loadTasks();
render();
