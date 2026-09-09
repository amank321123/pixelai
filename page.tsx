 "use client";
import {useEffect,useState} from "react";

type HistoryItem={id:string;type:"image"|"video";prompt:string;createdAt:string;src?:string;status:string};

export default function Home(){
 const [tab,setTab]=useState<"image"|"video">("image");
 const [prompt,setPrompt]=useState(""); const [img,setImg]=useState<string|null>(null);
 const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
 const [file,setFile]=useState<File|null>(null); const [motion,setMotion]=useState("");
 const [video,setVideo]=useState<string|null>(null);
 const [history,setHistory]=useState<HistoryItem[]>([]); const [credits,setCredits]=useState(100);

 useEffect(()=>{try{setHistory(JSON.parse(localStorage.getItem("pixelai_history")||"[]"))}catch{}},[]);
 function save(item:HistoryItem){setHistory(h=>{const n=[item,...h].slice(0,30);localStorage.setItem("pixelai_history",JSON.stringify(n));return n})}
 function clearHistory(){localStorage.removeItem("pixelai_history");setHistory([])}
 async function imageGen(){
  if(!prompt.trim())return setMsg("Enter a prompt first."); setBusy(true);setMsg("Generating real AI image…");setImg(null);
  try{const r=await fetch("/api/generate-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});const d=await r.json();if(!r.ok)throw Error(d.error||"Generation failed");setImg(d.image);save({id:crypto.randomUUID(),type:"image",prompt,createdAt:new Date().toISOString(),src:d.image,status:"completed"});setMsg("Image ready!")}
  catch(e:any){setMsg(e.message)}finally{setBusy(false)}
 }
 async function videoGen(){
  if(!file)return setMsg("Upload an image first.");if(!motion.trim())return setMsg("Describe the motion first.");
  setBusy(true);setVideo(null);setMsg("Creating video job…");
  try{const fd=new FormData();fd.append("image",file);fd.append("prompt",motion);fd.append("seconds","4");fd.append("size","720x1280");
   const r=await fetch("/api/generate-video",{method:"POST",body:fd});const d=await r.json();if(!r.ok)throw Error(d.error||"Video job failed");
   let id=d.id;setMsg("Video rendering…");
   for(let i=0;i<60;i++){await new Promise(x=>setTimeout(x,3000));const s=await fetch("/api/video-status?id="+encodeURIComponent(id));const j=await s.json();
    if(j.status==="completed"){const c=await fetch("/api/video-content?id="+encodeURIComponent(id));const blob=await c.blob();const url=URL.createObjectURL(blob);setVideo(url);save({id,type:"video",prompt:motion,createdAt:new Date().toISOString(),src:url,status:"completed"});setMsg("Video ready!");break}
    if(j.status==="failed")throw Error(j.error||"Video failed");setMsg("Video rendering… "+(j.progress??0)+"%")}
  }catch(e:any){setMsg(e.message)}finally{setBusy(false)}
 }
 function openItem(x:HistoryItem){if(x.type==="image"){setTab("image");setImg(x.src||null)}else{setTab("video");setVideo(x.src||null)}setMsg("Loaded from history.")}
 return <main>
  <nav><b>Pixel<span>AI</span></b><button onClick={()=>setTab("image")}>Text → Image</button><button onClick={()=>setTab("video")}>Image → Video</button><a href="/pricing">Pricing</a><a href="/gallery">Gallery</a><a href="/login">Login / Sign up</a></nav>
  <section className="hero"><small>REAL AI CREATOR STUDIO</small><h1>Create <i>without limits.</i></h1><p>Generate actual AI images and videos from your browser.</p></section>
  <section className="card">
   {tab==="image"?<><h2>🎨 Text → Image</h2><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="A cinematic Indian mountain village at sunrise…"/><button className="primary" disabled={busy} onClick={imageGen}>{busy?"Generating…":"Generate Image"}</button>{img&&<><img className="result" src={img}/><a className="download" href={img} download="pixelai-image.png">⬇ Download image</a></>}</>:
   <><h2>🎬 Image → Video</h2><input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}/><textarea value={motion} onChange={e=>setMotion(e.target.value)} placeholder="Camera slowly moves forward, clouds drift, natural motion…"/><button className="primary" disabled={busy} onClick={videoGen}>{busy?"Rendering…":"Generate Video"}</button>{video&&<><video className="result" controls src={video}/><a className="download" href={video} download="pixelai-video.mp4">⬇ Download video</a></>}</>}
   <p className="status">{msg}</p>
  </section>
  <section className="history">
   <div className="historyHead"><h2>Generation History</h2>{history.length>0&&<button onClick={clearHistory}>Clear history</button>}</div>
   {history.length===0?<div className="empty">No generations yet. Your completed images and videos will appear here.</div>:
    <div className="historyGrid">{history.map(x=><div className="historyCard" key={x.id} onClick={()=>openItem(x)}>
      {x.type==="image"&&x.src?<img src={x.src}/>:x.type==="video"&&x.src?<video src={x.src} muted/>:<div className="thumb">🎬</div>}
      <div><b>{x.type==="image"?"🎨 Image":"🎬 Video"}</b><p>{x.prompt}</p><small>{new Date(x.createdAt).toLocaleString()}</small></div>
    </div>)}</div>}
  </section>
  <footer>PixelAI • ⚡ {credits} demo credits • Browser history enabled. Production credits/history should be stored server-side.</footer>
 </main>
}