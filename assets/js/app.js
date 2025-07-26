const grid   = document.getElementById('grid');
const search = document.getElementById('search');
const filters= document.getElementById('filters');

let data   = [];
let active = 'All';

/* 1. Get catalogue ------------------------------------------------------- */
fetch('data/apps.json')
    .then(r => r.json())
    .then(json => {
        data = json;
        buildFilterChips();
        render();
    });

/* 2. Build category chips ------------------------------------------------ */
function buildFilterChips(){
    const cats = ['All', ...new Set(data.map(i=>i.category)) ];
    cats.forEach(cat=>{
        const btn = document.createElement('button');
        btn.textContent=cat;
        if(cat==='All') btn.classList.add('active');
        btn.onclick = ()=>{active=cat;document.querySelector('.chips .active')?.classList.remove('active');btn.classList.add('active');render();}
        filters.append(btn);
    })
}

/* 3. Render cards -------------------------------------------------------- */
function render(){
    const q = search.value.toLowerCase();
    grid.innerHTML='';
    data
        .filter(i=>active==='All' ? true : i.category===active)
        .filter(i=> i.title.toLowerCase().includes(q) || i.tags?.some(t=>t.toLowerCase().includes(q)))
        .forEach(item=> grid.append(card(item)));
}
function card(item){
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML=`
        <img src="\${item.cover}" alt>
        <h3>\${item.title}</h3>
        <p>\${item.description}</p>
        <span class="tag">\${item.version || item.category}</span>`;
    el.onclick=()=>openModal(item);
    return el;
}

/* 4. Modal -------------------------------------------------------------- */
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
closeModal.onclick=()=>modal.classList.add('hidden');

function openModal(item){
    modal.querySelector('#modalCover').src=item.cover;
    modal.querySelector('#modalTitle').textContent=item.title;
    modal.querySelector('#modalDesc').textContent=item.description;
    modal.querySelector('#modalMeta').textContent=`${item.category}  •  ${item.version||''}`;
    modal.querySelector('#modalBtn').href=item.url;
    modal.classList.remove('hidden');
}

/* 5. Live search -------------------------------------------------------- */
search.addEventListener('input',render);