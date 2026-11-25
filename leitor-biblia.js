/* Leitor de Bíblia: texto carregado de uma API pública de traduções livres.
   O texto integral NÃO é copiado para o GitHub; apenas capítulos já abertos são
   guardados temporariamente no navegador para leitura com conectividade instável.
   Fonte: https://api.midvash.com/docs */
(function(){
'use strict';
const raw=`Gênesis|genesis|50;Êxodo|exodus|40;Levítico|leviticus|27;Números|numbers|36;Deuteronômio|deuteronomy|34;Josué|joshua|24;Juízes|judges|21;Rute|ruth|4;1 Samuel|1-samuel|31;2 Samuel|2-samuel|24;1 Reis|1-kings|22;2 Reis|2-kings|25;1 Crônicas|1-chronicles|29;2 Crônicas|2-chronicles|36;Esdras|ezra|10;Neemias|nehemiah|13;Ester|esther|10;Jó|job|42;Salmos|psalms|150;Provérbios|proverbs|31;Eclesiastes|ecclesiastes|12;Cânticos|song-of-solomon|8;Isaías|isaiah|66;Jeremias|jeremiah|52;Lamentações|lamentations|5;Ezequiel|ezekiel|48;Daniel|daniel|12;Oseias|hosea|14;Joel|joel|3;Amós|amos|9;Obadias|obadiah|1;Jonas|jonah|4;Miqueias|micah|7;Naum|nahum|3;Habacuque|habakkuk|3;Sofonias|zephaniah|3;Ageu|haggai|2;Zacarias|zechariah|14;Malaquias|malachi|4;Mateus|matthew|28;Marcos|mark|16;Lucas|luke|24;João|john|21;Atos|acts|28;Romanos|romans|16;1 Coríntios|1-corinthians|16;2 Coríntios|2-corinthians|13;Gálatas|galatians|6;Efésios|ephesians|6;Filipenses|philippians|4;Colossenses|colossians|4;1 Tessalonicenses|1-thessalonians|5;2 Tessalonicenses|2-thessalonians|3;1 Timóteo|1-timothy|6;2 Timóteo|2-timothy|4;Tito|titus|3;Filemom|philemon|1;Hebreus|hebrews|13;Tiago|james|5;1 Pedro|1-peter|5;2 Pedro|2-peter|3;1 João|1-john|5;2 João|2-john|1;3 João|3-john|1;Judas|jude|1;Apocalipse|revelation|22`;
let books=raw.split(';').map((x,i)=>{const [name,slug,chapters]=x.split('|');return {name,slug,chapters:+chapters,testament:i<39?'Antigo Testamento':'Novo Testamento'}});
let api=null,bookIndex=42,chapter=3,version='alm1911',data=null,error='',pending=false,catalogPending=false,catalogReady=false;
let activeRequest=0;
const CACHE_PREFIX='meus-sonhos-public-bible-v8-';
function key(){return CACHE_PREFIX+version+'/'+bookIndex+'/'+chapter}
function safe(s){return api?.esc?api.esc(s):String(s??'').replace(/</g,'&lt;')}
function refresh(){if(api?.render){api.render()}}
function cacheGet(){try{const x=JSON.parse(localStorage.getItem(key())||'null');return x?.verses?.length?x:null}catch{return null}}
function cachePut(payload){try{localStorage.setItem(key(),JSON.stringify(payload))}catch{ /* Cheio: Bíblia continua online */ }}
async function catalog(){if(catalogPending||catalogReady)return;catalogPending=true;
 try{const res=await fetch('https://api.midvash.com/v1/books');if(!res.ok)throw Error('Catálogo indisponível');const j=await res.json();if(Array.isArray(j.data)&&j.data.length===66){
  books=books.map((b,i)=>({...b,slug:j.data[i]?.slug?.en||b.slug,chapters:j.data[i]?.chapters||b.chapters}));catalogReady=true;
 }}catch(e){/* use 66 book fallbacks */}
 finally{catalogPending=false;refresh()}
}
async function read(){const sequence=++activeRequest;const found=cacheGet();if(found){data=found;error='';pending=false;refresh();return}
 data=null;error='';pending=true;refresh();
 try{const link=`https://api.midvash.com/v1/${encodeURIComponent(version)}/${encodeURIComponent(books[bookIndex].slug)}/${chapter}?locale=pt-br`;
  const response=await fetch(link);if(!response.ok)throw Error('Não foi possível carregar este capítulo.');
  const json=await response.json();if(!Array.isArray(json?.data?.verses)||!json.data.verses.length)throw Error('O capítulo veio sem versículos.');
  if(sequence!==activeRequest)return;data={verses:json.data.verses,bookName:json.data.bookName||books[bookIndex].name,credit:String(json.meta?.copyright||'Fonte: Midvash API. Almeida 1911 em domínio público.')};cachePut(data);
 }catch(e){if(sequence!==activeRequest)return;error=e.message+' Confira sua conexão com a internet ou tente outro capítulo.'}
 finally{if(sequence===activeRequest){pending=false;refresh()}}
}
function setBook(i){if(!Number.isInteger(i)||i<0||i>=books.length)return;bookIndex=i;chapter=1;read()}
function setChapter(n){const last=books[bookIndex].chapters;n=Math.trunc(Number(n));if(!Number.isFinite(n)||n<1||n>last)return;chapter=n;read()}
function view(){if(!catalogReady&&!catalogPending)catalog();if(!data&&!pending&&!error)read();
 const b=books[bookIndex],desc=version==='alm1911'?'Almeida Revista e Corrigida de 1911 — texto histórico, sem atualização ortográfica.':'Bíblia Livre — tradução livre em português; diferente da Almeida 1911.';
 return `<div class="reader-layout"><div class="top"><div><div class="eyebrow">MINHA BÍBLIA</div><h1 class="page-title">Ler a Bíblia 📖</h1><p class="subtle">Escolha um dos 66 livros, abra um capítulo e leia sem sair do aplicativo.</p></div></div><div class="reader-card"><div class="form-field"><label for="readerVersion">Tradução disponível</label><select id="readerVersion" style="padding:12px;border:1px solid #dce9dd;border-radius:12px;background:#fafdf9;width:100%"><option value="alm1911" ${version==='alm1911'?'selected':''}>Almeida 1911 (texto original em domínio público)</option><option value="almeida-livre" ${version==='almeida-livre'?'selected':''}>Bíblia Livre (português de leitura mais atual)</option></select></div><p class="subtle" style="font-size:12px">${desc}</p><div class="reader-fields"><div class="form-field"><label for="readerBook">Livro da Bíblia</label><select id="readerBook">${books.map((x,i)=>`<option value="${i}" ${i===bookIndex?'selected':''}>${x.name}</option>`).join('')}</select></div><div class="form-field"><label for="readerChapter">Capítulo (1 a ${b.chapters})</label><input type="number" id="readerChapter" min="1" max="${b.chapters}" value="${chapter}"></div></div><div class="reader-nav"><button class="btn secondary" data-reader="previous" ${bookIndex===0&&chapter===1?'disabled':''}>← Anterior</button><button class="btn secondary" data-reader="next" ${bookIndex===books.length-1&&chapter===b.chapters?'disabled':''}>Próximo →</button></div><h2 class="section-title" style="margin:14px 0">${b.name} ${chapter}</h2><div class="reader-verses" aria-live="polite">${pending?'<p class="reader-loading">Carregando o capítulo…</p>':error?`<p class="reader-error">${safe(error)} <button class="btn secondary sm" data-reader="retry">Tentar novamente</button></p>`:data?data.verses.map((verse,i)=>`<p><sup>${i+1}</sup>${safe(verse)}</p>`).join(''):'<p>Escolha o livro e o capítulo acima para começar.</p>'}</div><div class="reader-foot">${safe(data?.credit||'Texto disponibilizado pela Midvash API. Para carregar capítulos novos, é necessária internet. Capítulos já abertos podem ficar disponíveis no cache deste navegador.')}</div><div class="meta-study-actions"><button class="btn primary" data-page="caderno">✍ Abrir meu caderno bíblico</button><button class="btn ghost" data-page="biblia">📅 Meu plano de leitura</button></div></div><p style="font-size:12px;color:#7c867b;margin:14px 2px">A edição Almeida 1911 com ortografia modernizada que você escolheu ainda depende de uma fonte digital reutilizável confirmada. Esta versão oferece o texto original de 1911 e uma alternativa de leitura livre. Não é leitura offline completa.</p></div>`;
}
document.addEventListener('change',e=>{if(e.target.id==='readerBook'){setBook(Number(e.target.value))}else if(e.target.id==='readerChapter'){setChapter(e.target.value)}else if(e.target.id==='readerVersion'){version=e.target.value==='almeida-livre'?'almeida-livre':'alm1911';read()}});
document.addEventListener('click',e=>{const btn=e.target.closest('[data-reader]');if(!btn)return;const action=btn.dataset.reader;
 if(action==='previous'){if(chapter>1)setChapter(chapter-1);else if(bookIndex>0){bookIndex--;chapter=books[bookIndex].chapters;read()}}
 if(action==='next'){if(chapter<books[bookIndex].chapters)setChapter(chapter+1);else if(bookIndex<65){bookIndex++;chapter=1;read()}}
 if(action==='retry')read();
});
window.ReaderBible={bookName:i=>books[i].name,open(i,c){bookIndex=i;chapter=c;read()},setup(x){api=x},view,_debug:{getState:()=>({bookIndex,chapter,version,pending,error}),setBook,setChapter}};
})();
