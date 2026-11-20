/* Cópias automáticas locais e arquivo opcional independente do site.
   O arquivo JSON contém informações pessoais em texto claro. */
(()=>{'use strict';
let activeUid=null,handle=null,available=false,dbPromise=null,pending=null,lastWrite=Promise.resolve(),timer=null;
const STORE='metas-backups-v5';
function openDB(){if(!('indexedDB' in window))return Promise.reject(Error('Este navegador não suporta backup local.'));if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(STORE,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('snapshots'))db.createObjectStore('snapshots',{keyPath:'key'});if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings')};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
async function dbPut(store,value,key){let db=await openDB();return new Promise((ok,fail)=>{let tx=db.transaction(store,'readwrite');if(store==='snapshots')tx.objectStore(store).put(value);else tx.objectStore(store).put(value,key);tx.oncomplete=ok;tx.onerror=()=>fail(tx.error)})}
async function dbGet(store,key){let db=await openDB();return new Promise((ok,fail)=>{let r=db.transaction(store,'readonly').objectStore(store).get(key);r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)})}
async function snapshots(){let db=await openDB();return new Promise((ok,fail)=>{let r=db.transaction('snapshots','readonly').objectStore('snapshots').getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>fail(r.error)})}
async function deleteKeys(keys){let db=await openDB();return new Promise((ok,fail)=>{let tx=db.transaction('snapshots','readwrite');for(const key of keys)tx.objectStore('snapshots').delete(key);tx.oncomplete=ok;tx.onerror=()=>fail(tx.error)})}
async function flushLocal(user,copy){try{let key=user+':'+Date.now();await dbPut('snapshots',{key,uid:user,at:new Date().toISOString(),payload:copy},key);let arr=(await snapshots()).filter(x=>x.uid===user).sort((a,b)=>b.at.localeCompare(a.at));if(arr.length>8)await deleteKeys(arr.slice(8).map(x=>x.key));}catch(e){console.warn('Não foi possível salvar cópia local:',e)}}
async function writeFile(copy){if(!handle||!available)return;lastWrite=lastWrite.catch(()=>{}).then(async()=>{if(!handle||!available)return;try{const w=await handle.createWritable();await w.write(JSON.stringify(copy,null,2));await w.close()}catch(e){available=false;console.warn('Permissão do arquivo de backup perdida:',e)}});await lastWrite}
function changed(copy){if(!activeUid)return;const user=activeUid;pending=JSON.parse(JSON.stringify(copy));clearTimeout(timer);timer=setTimeout(async()=>{if(user!==activeUid||!pending)return;let snap=pending;pending=null;await flushLocal(user,snap);if(activeUid===user)await writeFile(snap)},350)}
async function init(uid){activeUid=uid;handle=null;available=false;try{handle=await dbGet('settings','file:'+uid);if(handle&&typeof handle.queryPermission==='function')available=(await handle.queryPermission({mode:'readwrite'}))==='granted'}catch(e){console.warn('Backup independente indisponível:',e)}}
function end(){activeUid=null;handle=null;available=false;pending=null;clearTimeout(timer)}
async function enableAutoFile(copy){if(!window.showSaveFilePicker)throw Error('Use Chrome ou Edge no computador. No iPhone, use Baixar JSON.');if(!activeUid)throw Error('Entre na sua conta antes.');const user=activeUid;
// Abrir imediatamente ao clique do usuário (exigência do navegador).
const selected=await window.showSaveFilePicker({suggestedName:'backup-meus-sonhos-metas.json',types:[{description:'Backup em JSON',accept:{'application/json':['.json']}}]});if(activeUid!==user)throw Error('A conta mudou durante a operação.');handle=selected;available=true;try{await dbPut('settings',handle,'file:'+user)}catch(e){console.warn('Permissão não persistida:',e)}await writeFile(copy)}
async function listLocal(){if(!activeUid)return [];try{return (await snapshots()).filter(x=>x.uid===activeUid).sort((a,b)=>b.at.localeCompare(a.at)).slice(0,8)}catch{return []}}
function status(){return available?'Ativado neste navegador':handle?'Precisa de autorização novamente':'Não ativado'}
window.backupManager={init,end,changed,enableAutoFile,listLocal,status};
})();
