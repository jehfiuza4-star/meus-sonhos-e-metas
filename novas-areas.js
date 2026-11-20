/* Meus Sonhos & Metas - módulos extras v7; dados privados no Firestore do usuário */
(()=>{'use strict';
let api=null;
let records={agenda:[],habitos:[],diario:[],caderno:[],mural:[]};
let loadedKeys=new Set(),agendaDate='',habitId='',habitMonth=new Date().getMonth(),journalYear=new Date().getFullYear(),muralYear=new Date().getFullYear();
const kinds=['agenda','habitos','diario','caderno','mural'];
const dateKey=()=>new Date().toLocaleDateString('en-CA');
const today=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const id=()=>crypto.randomUUID?crypto.randomUUID():'item-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const enc=s=>api?api.esc(s):String(s);
const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d))&&!Number.isNaN(new Date(String(d)+'T12:00:00').getTime());
const number=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
const fmt=d=>api.fmt(d);
const toDay=d=>new Date(String(d)+'T12:00:00');
const shift=(d,n)=>{const a=toDay(d);a.setDate(a.getDate()+n);return api.localISO(a)};
const weekdays=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const rawImg=x=>typeof x==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]{0,52000}$/.test(x)?x:'';
const head=(title,subtitle,extra='')=>api.top(title,subtitle)+extra;
const tip=(text)=>`<p class="x-help">${text}</p>`;
const empty=(emoji,label,desc)=>`<div class="x-empty"><div class="x-empty-icon">${emoji}</div><h3>${label}</h3><p>${desc}</p></div>`;
const str=(x,max=3000)=>String(x??'').slice(0,max);
const hiddenFile=`<input type="file" accept="image/*" name="photo" class="x-photo-input">`;
const blank=()=>({agenda:[],habitos:[],diario:[],caderno:[],mural:[]});
function setup(ref){api=ref;agendaDate=today();}
function reset(){records=blank();loadedKeys=new Set();agendaDate=today();habitId='';}
function keyFor(kind,day){if(kind==='habitos')return 'habitos';if(kind==='mural')return 'mural-'+String(day).slice(0,4);return ({agenda:'agenda-',diario:'diario-',caderno:'caderno-'})[kind]+String(day).slice(0,7)}
function hydrate(documents){reset();if(!documents||typeof documents!=='object')return;for(const [key,data] of Object.entries(documents)){
 let kind=key==='habitos'?'habitos':key.startsWith('agenda-')?'agenda':key.startsWith('diario-')?'diario':key.startsWith('caderno-')?'caderno':key.startsWith('mural-')?'mural':null;
 if(!kind||!Array.isArray(data?.items))continue;loadedKeys.add(key);records[kind].push(...data.items.filter(v=>v&&typeof v==='object').slice(0,420));
 }records.habitos=records.habitos.slice(0,80);
}
function backup(){return JSON.parse(JSON.stringify(records))}
function getDocumentItems(key){const kind=key==='habitos'?'habitos':key.startsWith('agenda-')?'agenda':key.startsWith('diario-')?'diario':key.startsWith('caderno-')?'caderno':key.startsWith('mural-')?'mural':null;if(!kind)return [];
 if(kind==='habitos')return records.habitos;
 return records[kind].filter(a=>keyFor(kind,kind==='mural'?a.year+'-01-01':a.date)===key);
}
function saveKey(key){if(!api?.hasUser())return;loadedKeys.add(key);const items=getDocumentItems(key);const payload={items};if(new Blob([JSON.stringify(payload)]).size>780000){api.notify('Este mês contém muitos dados. Exclua uma fotografia grande ou reduza os registros.');return false;}window.firebaseGateway?.saveExtra(key,payload);window.backupManager?.changed(window.appApi.backupPayload());return true}
function saveMany(keys){for(const key of new Set(keys))saveKey(key)}
function restore(data){if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Backup de páginas adicionais inválido.');let next=blank();for(const kind of kinds){const arr=data[kind];if(!Array.isArray(arr)||arr.length>15000)throw Error('Lista inválida para '+kind);next[kind]=arr.map(a=>{
 const b={id:str(a.id||id(),100),title:str(a.title,120),date:validDate(a.date)?a.date:today(),year:number(a.year,2020,2100),text:str(a.text,4000),notes:str(a.notes,2000),mood:str(a.mood,30),reference:str(a.reference,160),category:str(a.category,80),time:str(a.time,8),done:!!a.done,image:rawImg(a.image),schedule:api.normalSchedule(a.schedule),doneDates:api.cleanDates(a.doneDates)};
 return b;
 }).filter(a=>a.title);}
 const oldKeys=[...loadedKeys];records=next;
 const newKeys=new Set(['habitos']);for(const kind of kinds)for(const item of records[kind])newKeys.add(keyFor(kind,kind==='mural'?item.year+'-01-01':item.date));
 saveMany([...oldKeys,...newKeys]);return true;
}
function modal(html){document.getElementById('modal').innerHTML=html;document.getElementById('overlay').hidden=false;}
function close(){document.getElementById('overlay').hidden=true;}
function render(){api.render();}
function setView(page){close();api.setPage(page);}
function dateField(name,value){return `<div class="form-field"><label>Data</label><input name="${name}" type="date" required value="${enc(value)}"></div>`}
function photoField(){return `<div class="form-field"><label>Fotografia (opcional)</label>${hiddenFile}<small class="subtle">A imagem será reduzida e ficará na sua conta, não no GitHub público.</small></div>`}
async function resizePhoto(file){if(!file)return '';
 if(file.size>8*1024*1024)throw Error('Imagem muito grande. Escolha uma foto de até 8 MB.');
 const src=URL.createObjectURL(file);try{const img=new Image();img.src=src;await img.decode();let w=img.width,h=img.height,scale=Math.min(1,360/Math.max(w,h));let canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
 for(const quality of [.72,.58,.44,.32]){let out=canvas.toDataURL('image/jpeg',quality);if(out.length<41000)return out;}
 throw Error('Não foi possível reduzir a foto. Escolha uma imagem menor.');}finally{URL.revokeObjectURL(src)}
}
function agenda(){const d=agendaDate||today();const todos=records.agenda.filter(a=>a.date===d).sort((a,b)=>(a.time||'99').localeCompare(b.time||'99'));
 const goals=api.goals().filter(g=>api.planned(g.schedule,d)&&Number(g.year)===Number(d.slice(0,4)));
 const routines=api.routines().filter(r=>api.dueRoutine(r,d));
 const bday=window.BiblePlan.make(Number(d.slice(0,4))).find(x=>api.localISO(x.date)===d);
 const state=api.readingByYear()[d.slice(0,4)]||{done:{}};
 let checked=todos.filter(x=>x.done).length+goals.filter(g=>g.doneDates?.[d]).length+routines.filter(r=>r.doneDates?.[d]).length+(state.done?.[bday?.index]?1:0);
 const total=todos.length+goals.length+routines.length+(bday?1:0);
 return head('Agenda de hoje ☀️','Reúna suas atividades e marque cada pequena conquista.')+`<div class="x-hero"><div><div class="eyebrow">MINHA AGENDA</div><h2>${fmt(d)} · ${weekdays[toDay(d).getDay()]}</h2><p>${checked} de ${total} atividades concluídas</p></div><span class="x-percent">${total?Math.round(checked*100/total):0}%</span></div>
 <div class="x-toolbar"><button class="btn ghost sm" data-x="agenda-prev">← Dia anterior</button><input class="x-date" type="date" data-x-input="agenda-date" value="${d}"><button class="btn ghost sm" data-x="agenda-next">Próximo dia →</button><button class="btn primary" data-x="agenda-new">＋ Nova tarefa</button></div>
 <div class="x-two"><section class="fullbox"><h2 class="section-title">Minhas tarefas</h2>${todos.length?todos.map(t=>`<div class="x-list-row"><label class="x-check"><input type="checkbox" data-x-input="agenda-done" data-id="${enc(t.id)}" ${t.done?'checked':''}><span class="x-check-title">${enc(t.title)} <small>${enc(t.time||'')}</small></span></label><button class="x-icon-btn" aria-label="Editar tarefa" data-x="agenda-edit" data-id="${enc(t.id)}">✎</button></div>`).join(''):empty('🌼','Nada agendado','Acrescente uma atividade para este dia.')}</section>
 <section class="fullbox"><h2 class="section-title">Do seu planejamento</h2>
 ${goals.map(g=>`<div class="x-list-row"><label class="x-check"><input type="checkbox" data-x-input="goal-done" data-id="${enc(g.id)}" ${g.doneDates?.[d]?'checked':''}><span class="x-check-title">🎯 ${enc(g.title)}</span></label></div>`).join('')}
 ${routines.map(t=>`<div class="x-list-row"><label class="x-check"><input type="checkbox" data-x-input="routine-done" data-id="${enc(t.id)}" ${t.doneDates?.[d]?'checked':''}><span class="x-check-title">☀️ ${enc(t.title)}</span></label></div>`).join('')}
 ${bday?`<div class="x-list-row"><label class="x-check"><input type="checkbox" data-x-input="bible-done" data-id="${bday.index}" ${state.done?.[bday.index]?'checked':''}><span class="x-check-title">📖 ${enc(bday.reference)}</span></label><button class="x-icon-btn" data-page="biblia" title="Abrir plano">↗</button></div>`:''}
 ${goals.length+routines.length+(bday?1:0)===0?empty('🌿','Dia livre','Não há metas programadas para esta data.'):''}</section></div>`;
}
function editAgenda(item){modal(`<div class="modal-header"><h2>${item?'Editar tarefa':'Nova tarefa da agenda'}</h2><button class="x" data-action="close">×</button></div><form data-x-form="agenda" data-id="${enc(item?.id||'')}"><div class="form-field"><label>O que você quer fazer?</label><input name="title" required maxlength="120" value="${enc(item?.title||'')}" placeholder="Ex.: Revisar português"></div><div class="form-grid">${dateField('date',item?.date||agendaDate)}<div class="form-field"><label>Horário (opcional)</label><input name="time" type="time" value="${enc(item?.time||'')}"></div></div><div class="form-field"><label>Observações</label><textarea name="notes" maxlength="2000">${enc(item?.notes||'')}</textarea></div><div class="x-form-actions"><button class="btn primary" type="submit">Salvar tarefa</button>${item?`<button class="btn danger" type="button" data-x="agenda-delete" data-id="${enc(item.id)}">Excluir</button>`:''}</div></form>`)}
function habitos(){const y=api.year(),list=records.habitos;let current=list.find(h=>h.id===habitId)||list[0];if(current&&!habitId)habitId=current.id;
 const m=habitMonth,first=new Date(y,m,1),last=new Date(y,m+1,0).getDate();const blanks=Array(first.getDay()).fill('<span class="x-cal-empty"></span>');
 let monthlyDone=current?Object.keys(current.doneDates||{}).filter(d=>d.startsWith(`${y}-${String(m+1).padStart(2,'0')}-`)&&current.doneDates[d]).length:0;
 const cells=current?Array.from({length:last},(_,i)=>{const date=api.localISO(new Date(y,m,i+1));const marked=!!current.doneDates?.[date],on=api.planned(current.schedule,date);return `<button class="x-cal-day ${marked?'is-done':on?'is-planned':''}" data-x="habit-day" data-date="${date}" aria-label="${fmt(date)}, ${marked?'realizado':'não realizado'}"><span>${i+1}</span><small>${marked?'✓':on?'·':''}</small></button>`}):[];
 return head('Calendário de hábitos 🌿','Registre sua frequência sem precisar criar uma meta nova a cada dia.')+`<div class="x-toolbar"><button class="btn primary" data-x="habit-new">＋ Criar hábito</button>${current?`<button class="btn ghost" data-x="habit-edit" data-id="${enc(current.id)}">Editar este hábito</button>`:''}</div><div class="x-two"><section class="fullbox"><h2 class="section-title">Meus hábitos</h2>${list.length?list.map(h=>`<button class="x-habit-row ${h.id===current?.id?'selected':''}" data-x="habit-select" data-id="${enc(h.id)}"><span>🌱 ${enc(h.title)}</span><small>${enc(api.scheduleName(h.schedule))}</small></button>`).join(''):empty('🌱','Comece um hábito','Ex.: Ler, caminhar ou estudar três vezes na semana.')}</section><section class="fullbox"><div class="x-month-head"><button class="x-icon-btn" data-x="habit-prev" aria-label="Mês anterior">←</button><h2 class="section-title">${months[m]} de ${y}</h2><button class="x-icon-btn" data-x="habit-next" aria-label="Próximo mês">→</button></div>${current?`<p class="subtle">${enc(current.title)} · ${monthlyDone} dias realizados neste mês</p><div class="x-weekday">${weekdays.map(d=>`<span>${d}</span>`).join('')}</div><div class="x-cal-grid">${blanks.join('')+cells.join('')}</div><p class="x-help">Toque no dia para marcar ou desmarcar. Dias verdes = realizados.</p>`:empty('📅','Seu calendário','Crie o primeiro hábito para começar.')}</section></div>`;
}
function editHabit(h){modal(`<div class="modal-header"><h2>${h?'Editar hábito':'Meu novo hábito'}</h2><button class="x" data-action="close">×</button></div><form data-x-form="habit" data-id="${enc(h?.id||'')}"><div class="form-field"><label>Nome do hábito</label><input required name="title" maxlength="120" placeholder="Ex.: Estudar inglês" value="${enc(h?.title||'')}"></div>${api.cadenceFields(h?.schedule||{mode:'weekdays',weekdays:[1,3,5]},'xHabit')}<div class="x-form-actions"><button class="btn primary">Salvar hábito</button>${h?`<button type="button" class="btn danger" data-x="habit-delete" data-id="${enc(h.id)}">Excluir</button>`:''}</div></form>`)}
function diario(){const data=records.diario.filter(e=>Number(e.date.slice(0,4))===journalYear).sort((a,b)=>b.date.localeCompare(a.date));const moods={'Feliz':'😊','Tranquila':'🌿','Cansada':'🌙','Grata':'💚','Pensativa':'💭'};return head('Meu diário pessoal 🌷','Registre seus dias em um espaço particular.')+`<div class="x-toolbar"><button class="btn primary" data-x="diary-new">＋ Escrever no diário</button><label class="x-filter">Ano <input data-x-input="diary-year" type="number" min="2020" max="2100" value="${journalYear}"></label></div><section class="x-cards">${data.length?data.map(e=>`<article class="x-note"><div class="x-note-meta">${moods[e.mood]||'🌷'} ${fmt(e.date)} · ${enc(e.mood||'Meu dia')}</div>${e.image?`<img loading="lazy" src="${enc(e.image)}" class="x-note-image" alt="Foto do meu diário">`:''}<h3>${enc(e.title)}</h3><p>${enc(e.text||'')}</p><button class="btn ghost sm" data-x="diary-edit" data-id="${enc(e.id)}">Editar registro</button></article>`).join(''):empty('📓','Seu diário começa aqui','Escreva sobre seu primeiro dia ou aprendizado.')}</section>`}
function diaryForm(e){modal(`<div class="modal-header"><h2>${e?'Editar registro':'Escrever no meu diário'}</h2><button class="x" data-action="close">×</button></div><form data-x-form="diary" data-id="${enc(e?.id||'')}"><div class="form-grid">${dateField('date',e?.date||today())}<div class="form-field"><label>Como me senti?</label><select name="mood">${['Feliz','Tranquila','Cansada','Grata','Pensativa'].map(x=>`<option ${e?.mood===x?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="form-field"><label>Título</label><input required name="title" maxlength="120" value="${enc(e?.title||'')}" placeholder="Meu dia especial"></div><div class="form-field"><label>Meu registro</label><textarea required name="text" maxlength="4000" rows="6">${enc(e?.text||'')}</textarea></div>${photoField()}${e?.image?`<label class="x-check"><input type="checkbox" name="removeImage"> Remover foto atual</label>`:''}<div class="x-form-actions"><button class="btn primary" type="submit">Salvar registro</button>${e?`<button class="btn danger" type="button" data-x="diary-delete" data-id="${enc(e.id)}">Excluir</button>`:''}</div></form>`)}
function caderno(){const notes=records.caderno.filter(x=>Number(x.date.slice(0,4))===api.year()).sort((a,b)=>b.date.localeCompare(a.date));return head('Caderno bíblico 📖','Guarde reflexões, versículos e aprendizados em sua conta.')+`<div class="x-banner"><div><div class="eyebrow">ESTUDO DA PALAVRA</div><h2>O que a leitura ensinou hoje?</h2><p>Anote o livro e a passagem bíblica, e escreva suas reflexões.</p></div><button class="btn primary" data-x="note-new">＋ Nova reflexão</button></div><section class="x-cards">${notes.length?notes.map(n=>`<article class="x-note"><div class="x-note-meta">📖 ${fmt(n.date)} · ${enc(n.reference||'Reflexão')}</div><h3>${enc(n.title)}</h3><p>${enc(n.text)}</p><button class="btn ghost sm" data-x="note-edit" data-id="${enc(n.id)}">Editar estudo</button></article>`).join(''):empty('📖','Nenhum estudo registrado','Crie um caderno particular para o que estiver aprendendo com a Bíblia.')}</section>`;}
function noteForm(e){modal(`<div class="modal-header"><h2>${e?'Editar estudo bíblico':'Nova reflexão bíblica'}</h2><button class="x" data-action="close">×</button></div><form data-x-form="note" data-id="${enc(e?.id||'')}"><div class="form-grid">${dateField('date',e?.date||today())}<div class="form-field"><label>Referência bíblica</label><input name="reference" maxlength="160" value="${enc(e?.reference||'')}" placeholder="Ex.: João 3:16"></div></div><div class="form-field"><label>Título do estudo</label><input required name="title" maxlength="120" value="${enc(e?.title||'')}" placeholder="Ex.: O amor de Deus"></div><div class="form-field"><label>Minhas anotações e aplicações</label><textarea required name="text" maxlength="4000" rows="7">${enc(e?.text||'')}</textarea></div><div class="x-form-actions"><button class="btn primary">Salvar estudo</button>${e?`<button type="button" class="btn danger" data-x="note-delete" data-id="${enc(e.id)}">Excluir</button>`:''}</div></form>`)}
function mural(){const items=records.mural.filter(x=>Number(x.year)===muralYear);return head('Mural dos sonhos ✨','Um lugar para visualizar o futuro que você deseja construir.')+`<div class="x-toolbar"><button class="btn primary" data-x="vision-new">＋ Adicionar sonho</button><label class="x-filter">Ano <input type="number" data-x-input="mural-year" min="2020" max="2100" value="${muralYear}"></label></div><section class="x-vision-grid">${items.length?items.map(x=>`<article class="x-vision ${x.done?'x-vision-done':''}"><div class="x-vision-photo">${x.image?`<img src="${enc(x.image)}" loading="lazy" alt="Imagem do sonho ${enc(x.title)}">`:'<span>🌸</span>'}</div><div class="x-vision-copy"><small>${enc(x.category||'Meu sonho')} ${x.done?'· Realizado ✨':''}</small><h3>${enc(x.title)}</h3><p>${enc(x.notes)}</p><button class="btn ghost sm" data-x="vision-edit" data-id="${enc(x.id)}">Abrir sonho →</button></div></article>`).join(''):empty('🌸','Seu primeiro sonho','Monte um mural com suas fotografias e objetivos.')}</section>`;}
function visionForm(e){modal(`<div class="modal-header"><h2>${e?'Editar meu sonho':'Adicionar ao mural'}</h2><button class="x" data-action="close">×</button></div><form data-x-form="vision" data-id="${enc(e?.id||'')}"><div class="form-field"><label>Meu sonho</label><input name="title" maxlength="120" required value="${enc(e?.title||'')}" placeholder="Ex.: Conhecer um lugar especial"></div><div class="form-grid"><div class="form-field"><label>Categoria</label><select name="category">${['Estudos','Espiritualidade','Saúde','Carreira','Viagens','Família','Casa','Pessoal'].map(v=>`<option ${e?.category===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="form-field"><label>Ano</label><input type="number" name="year" min="2020" max="2100" value="${e?.year||muralYear}"></div></div><div class="form-field"><label>Por que quero realizar?</label><textarea name="notes" maxlength="2000">${enc(e?.notes||'')}</textarea></div>${photoField()}${e?.image?`<label class="x-check"><input type="checkbox" name="removeImage"> Remover fotografia atual</label>`:''}<label class="x-check"><input type="checkbox" name="done" ${e?.done?'checked':''}> Já realizei esse sonho</label><div class="x-form-actions"><button class="btn primary">Salvar sonho</button>${e?`<button type="button" class="btn danger" data-x="vision-delete" data-id="${enc(e.id)}">Excluir</button>`:''}</div></form>`)}
function relatorios(){const y=api.year();let goals=api.goals().filter(g=>Number(g.year)===y),finished=goals.filter(g=>g.status==='Concluída').length;
 const sessions=goals.flatMap(g=>g.studySessions||[]).filter(s=>(s.date||'').startsWith(String(y))),mins=Math.floor(sessions.reduce((a,s)=>a+(Number(s.seconds)||0),0)/60);
 const now=today(),ym=now.slice(0,7),nowmonth=Number(now.slice(0,4))===y?ym:`${y}-01`,routineCount=api.routines().reduce((a,t)=>a+Object.keys(t.doneDates||{}).filter(d=>d.startsWith(nowmonth)&&t.doneDates[d]).length,0);
 const habitCount=records.habitos.reduce((a,t)=>a+Object.keys(t.doneDates||{}).filter(d=>d.startsWith(String(y))&&t.doneDates[d]).length,0);
 const reading=api.readingByYear()[String(y)]||{done:{}},bibleDone=Object.values(reading.done||{}).filter(Boolean).length,yearNotes=records.caderno.filter(x=>x.date.startsWith(String(y))).length;
 const categoryTotals=api.cats().map(([name,emoji])=>({name,emoji,num:goals.filter(g=>g.category===name).length,done:goals.filter(g=>g.category===name&&g.status==='Concluída').length})).filter(x=>x.num);
 return head('Relatórios de progresso 📊','Acompanhe seus avanços sem cobranças nem comparações.')+`<div class="x-report-grid">${[['🎯','Metas realizadas',`${finished}/${goals.length}`],['⏳','Tempo estudado',mins+' min'],['📖','Dias de leitura bíblica',bibleDone],['🌿','Hábitos marcados no ano',habitCount],['☀️','Rotinas feitas no mês',routineCount],['✍️','Reflexões bíblicas',yearNotes]].map(c=>`<div class="x-report-tile"><span>${c[0]}</span><strong>${c[2]}</strong><small>${c[1]}</small></div>`).join('')}</div><section class="fullbox" style="margin-top:16px"><h2 class="section-title">Minhas metas por categoria</h2>${categoryTotals.length?categoryTotals.map(c=>`<div class="x-report-bar"><div class="x-report-label"><span>${c.emoji} ${enc(c.name)}</span><strong>${c.done} de ${c.num}</strong></div><div class="progressline"><span style="width:${Math.round(c.done/c.num*100)}%"></span></div></div>`).join(''):empty('📊','Sem metas por categoria','Quando você cadastrar metas, o relatório aparecerá aqui.')}</section><p class="x-help">Os relatórios são calculados a partir dos registros da sua conta; não compartilhamos seus resultados em páginas públicas.</p>`;
}
function homeCards(){const d=today(),agenda=records.agenda.filter(x=>x.date===d),habits=records.habitos.filter(x=>api.planned(x.schedule,d));const done=agenda.filter(x=>x.done).length+habits.filter(x=>x.doneDates?.[d]).length;const total=agenda.length+habits.length;
 const cards=[['agenda','☀️','Agenda de hoje','Tarefas e compromissos'],['habitos','🌱','Meus hábitos','Calendário e constância'],['diario','✍️','Meu diário','Registrar aprendizados'],['caderno','📖','Caderno bíblico','Reflexões e versículos'],['mural','🌸','Mural dos sonhos','Fotos e inspirações'],['relatorios','📊','Relatórios','Minha evolução']];
 return `<section class="x-home-section"><div class="section-header"><h2 class="section-title">Meu espaço pessoal</h2><small class="subtle">${total?done+' de '+total+' registros do dia feitos':'Organize seus dias do seu jeito'}</small></div><div class="x-home-grid">${cards.map(([page,emoji,title,sub])=>`<button class="x-home-card" data-page="${page}"><span class="x-home-emoji">${emoji}</span><span><strong>${title}</strong><small>${sub}</small></span><span class="x-home-arrow">↗</span></button>`).join('')}</div></section>`;
}
function view(page){return ({agenda,habitos,diario,caderno,mural,relatorios})[page]?.()||agenda()}
function navMore(){modal(`<div class="modal-header"><h2>Explorar meu aplicativo</h2><button class="x" data-action="close">×</button></div><div class="x-nav-sheet">${api.pages().map(p=>`<button data-x="mobile-page" data-id="${p[0]}"><span>${p[2]}</span>${enc(p[1])}<span>→</span></button>`).join('')}</div>`)}
function actionClick(target){let code=target.dataset.x,idd=target.dataset.id||'';
 switch(code){
 case 'mobile-more':navMore();break;
 case 'mobile-page':setView(idd);break;
 case 'agenda-prev':agendaDate=shift(agendaDate,-1);render();break;
 case 'agenda-next':agendaDate=shift(agendaDate,1);render();break;
 case 'agenda-new':editAgenda();break;
 case 'agenda-edit':editAgenda(records.agenda.find(x=>x.id===idd));break;
 case 'agenda-delete':{const e=records.agenda.find(x=>x.id===idd);if(e&&confirm('Excluir esta tarefa?')){records.agenda=records.agenda.filter(x=>x.id!==idd);saveKey(keyFor('agenda',e.date));close();render();}break;}
 case 'habit-new':editHabit();break;
 case 'habit-edit':editHabit(records.habitos.find(x=>x.id===idd));break;
 case 'habit-select':habitId=idd;render();break;
 case 'habit-prev':habitMonth=(habitMonth+11)%12; if(habitMonth===11) api.setYear(api.year()-1);render();break;
 case 'habit-next':habitMonth=(habitMonth+1)%12; if(habitMonth===0) api.setYear(api.year()+1);render();break;
 case 'habit-day':{let h=records.habitos.find(x=>x.id===habitId);if(h){h.doneDates||={};if(h.doneDates[target.dataset.date])delete h.doneDates[target.dataset.date];else h.doneDates[target.dataset.date]=true;saveKey('habitos');render();}break;}
 case 'habit-delete':if(confirm('Excluir este hábito e o histórico dele?')){records.habitos=records.habitos.filter(x=>x.id!==idd);habitId='';saveKey('habitos');close();render();}break;
 case 'diary-new':diaryForm();break;
 case 'diary-edit':diaryForm(records.diario.find(x=>x.id===idd));break;
 case 'diary-delete':if(confirm('Excluir esta página do diário?')){let a=records.diario.find(x=>x.id===idd);if(a){records.diario=records.diario.filter(x=>x.id!==idd);saveKey(keyFor('diario',a.date));close();render();}}break;
 case 'note-new':noteForm();break;
 case 'note-edit':noteForm(records.caderno.find(x=>x.id===idd));break;
 case 'note-delete':if(confirm('Excluir este estudo bíblico?')){let a=records.caderno.find(x=>x.id===idd);if(a){records.caderno=records.caderno.filter(x=>x.id!==idd);saveKey(keyFor('caderno',a.date));close();render();}}break;
 case 'vision-new':visionForm();break;
 case 'vision-edit':visionForm(records.mural.find(x=>x.id===idd));break;
 case 'vision-delete':if(confirm('Excluir este sonho do mural?')){let a=records.mural.find(x=>x.id===idd);if(a){records.mural=records.mural.filter(x=>x.id!==idd);saveKey(keyFor('mural',a.year+'-01-01'));close();render();}}break;
 }
}
async function submit(form){const type=form.dataset.xForm,formData=new FormData(form),oldId=form.dataset.id;const name=str(formData.get('title'),120).trim();if(!name){api.notify('Digite um título.');return;}
 const kind=type==='habit'?'habitos':type==='note'?'caderno':type==='vision'?'mural':type==='diary'?'diario':'agenda';
 const old=records[kind].find(x=>x.id===oldId),date=validDate(formData.get('date'))?str(formData.get('date')):today();
 const image=(type==='diary'||type==='vision')&&formData.get('photo')?.size?await resizePhoto(formData.get('photo')):(formData.has('removeImage')?'':old?.image||'');
 let item={...old,id:old?.id||id(),title:name,date,year:type==='vision'?number(formData.get('year'),2020,2100):Number(date.slice(0,4)),text:str(formData.get('text'),4000),notes:str(formData.get('notes'),2000),reference:str(formData.get('reference'),160),mood:str(formData.get('mood'),30),category:str(formData.get('category'),80),time:str(formData.get('time'),8),image,done:formData.has('done')||!!old?.done};
 if(type==='habit'){item.schedule=api.readCadence(formData,'xHabit');item.doneDates=old?.doneDates||{};item.date=today();}
 if(type==='agenda')item.done=old?.done||false;
 if(type==='vision')item.done=formData.has('done');
 if(!old&&records[kind].length>=(kind==='habitos'?80:kind==='mural'?180:3000)){api.notify('Limite desta seção atingido; exporte um backup antes de arquivar registros.');return;}
 const keys=[];if(old){keys.push(keyFor(kind,kind==='mural'?old.year+'-01-01':old.date));records[kind]=records[kind].map(x=>x.id===item.id?item:x)}else records[kind].push(item);
 keys.push(keyFor(kind,kind==='mural'?item.year+'-01-01':item.date));saveMany(keys);if(type==='vision')muralYear=item.year;if(type==='diary')journalYear=item.year;if(type==='habit')habitId=item.id;
 close();render();api.notify('Salvo na sua conta ☁️');
}
function inputChange(target){const code=target.dataset.xInput;if(!code)return;
 switch(code){case 'agenda-date':if(validDate(target.value)){agendaDate=target.value;render();}break;
 case 'diary-year':journalYear=number(target.value,2020,2100);render();break;
 case 'mural-year':muralYear=number(target.value,2020,2100);render();break;
 case 'agenda-done':{let a=records.agenda.find(x=>x.id===target.dataset.id);if(a){a.done=target.checked;saveKey(keyFor('agenda',a.date));render();}break;}
 case 'goal-done':api.setGoalDate(target.dataset.id,agendaDate,target.checked);render();break;
 case 'routine-done':api.setRoutineDate(target.dataset.id,agendaDate,target.checked);render();break;
 case 'bible-done':api.setBibleDate(agendaDate,Number(target.dataset.id),target.checked);render();break;
 }
}
// Registrados na captura para não interferir nos controles originais do aplicativo.
document.addEventListener('click',e=>{let b=e.target.closest('[data-x]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();actionClick(b)},true);
document.addEventListener('submit',async e=>{let form=e.target.closest('[data-x-form]');if(!form)return;e.preventDefault();e.stopImmediatePropagation();let b=form.querySelector('button[type="submit"],button:not([type])');if(b)b.disabled=true;try{await submit(form)}catch(err){api.notify('Não foi possível salvar: '+(err?.message||'erro'));if(b)b.disabled=false}},true);
document.addEventListener('change',e=>{if(e.target.matches('[data-x-input]')){e.stopImmediatePropagation();inputChange(e.target)}else if(e.target.matches('[data-cadence="xHabit"]')){ // mostra os dias e a quantidade sem atrapalhar o cadastro original
 const v=e.target.value;document.querySelectorAll('[data-for="xHabit"].cadence-days').forEach(x=>x.hidden=v!=='weekdays');document.querySelectorAll('[data-for="xHabit"].cadence-quota').forEach(x=>x.hidden=v!=='weekly');
 }},true);
window.MetasExtras={setup,reset,hydrate,backup,restore,homeCards,view};
})();
