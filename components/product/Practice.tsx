"use client";
import { useState } from "react";
import { questions, topics, type TopicId } from "@/lib/product/curriculum";
import { Icon } from "./Brand";
import { Modal, type Mutate } from "./Shared";

export function Practice({ topicId, mutate, onClose }: { topicId: TopicId; mutate: Mutate; onClose: () => void }) {
  const topic=topics.find(t=>t.id===topicId)!;const set=questions.filter(q=>q.topic===topicId);
  const [index,setIndex]=useState(0);const [answer,setAnswer]=useState("");const [hints,setHints]=useState(0);
  const [result,setResult]=useState<"right"|"retry"|null>(null);const [busy,setBusy]=useState(false);const [correct,setCorrect]=useState(0);const [tries,setTries]=useState(0);
  const [finished,setFinished]=useState(false);const q=set[index];
  async function check(e: React.FormEvent) { e.preventDefault();if(busy||result==="right")return;setBusy(true);const response=await mutate({action:"attempt",id:crypto.randomUUID(),questionId:q.id,answer,hints});if(response){setResult(response.correct?"right":"retry");if(response.correct&&tries===0)setCorrect(c=>c+1);setTries(t=>t+1);}setBusy(false); }
  function next(){if(index===set.length-1){setFinished(true);return;}setIndex(i=>i+1);setAnswer("");setHints(0);setResult(null);setTries(0);}
  return <Modal title={finished?"A little further than before.":topic.name} onClose={onClose} wide>{finished?<div className="practice-finish"><span className="finish-emblem"><Icon name="leaf" size={48}/></span><span className="eyebrow">Practice complete</span><h3>You showed up.<br/>Your understanding grew.</h3><p>You worked through {set.length} questions, with {correct} correct on your first try. Every attempt helps your teacher see your next step.</p><button onClick={onClose} className="btn btn-dark">Back to my journey <Icon name="arrow" size={18}/></button></div>:<div className="practice-body"><div className="practice-meta"><span>Question {index+1} of {set.length}</span><span>{topic.standard} · Grade 4</span></div><div className="session-progress">{set.map((item,i)=><span key={item.id} className={i<=index?"filled":""}/>)}</div><h3>{q.prompt}</h3>
    {q.visual==="fraction"&&<div className="fraction-model"><div><span className="garden-bed halves"><i/><i/></span><span>1 out of 2 equal parts</span></div><span className="model-equals">=</span><div><span className="garden-bed fourths"><i/><i/><i/><i/></span><span>? out of 4 equal parts</span></div></div>}
    {q.visual==="groups"&&<div className="groups-model" aria-label="Six equal rows of seedlings">{Array.from({length:6},(_,i)=><div key={i}>{Array.from({length:14},(_,j)=><i key={j}/>)}</div>)}</div>}
    {q.visual==="angle"&&<svg className="angle-model" viewBox="0 0 200 120" role="img" aria-label="A right angle"><path d="M60 15v80h110M60 75h20v20" fill="none" stroke="currentColor" strokeWidth="3"/><text x="93" y="65" fill="currentColor" fontSize="25">?</text></svg>}
    <form onSubmit={check}><label htmlFor="practice-answer">Your answer</label><div className="answer-row"><input id="practice-answer" autoFocus inputMode="decimal" value={answer} onChange={e=>{setAnswer(e.target.value);if(result==="retry")setResult(null);}} placeholder="Type a number…" required maxLength={100} disabled={result==="right"||busy}/><button className="btn btn-dark" disabled={busy||result==="right"||!answer.trim()}>{busy?"Checking…":"Check answer"}<Icon name="arrow" size={16}/></button></div></form>
    <div aria-live="polite">{result==="retry"&&<div className="answer-feedback retry"><strong>Not quite yet. You’re still learning.</strong><p>Take another look, or open a hint to try a different approach.</p></div>}{result==="right"&&<div className="answer-feedback right"><strong><Icon name="check" size={18}/> You’ve got it.</strong><p>{q.explanation}</p><button className="text-link" onClick={next}>{index===set.length-1?"Finish practice":"Next question"}<Icon name="arrow" size={17}/></button></div>}</div>
    {result!=="right"&&<div className="hint-section">{hints>0&&<div className="hint-copy"><span className="eyebrow">A nudge in the right direction</span><p>{q.hints[hints-1]}</p></div>}<button className="text-link" onClick={()=>setHints(h=>Math.min(3,h+1))} disabled={hints>=3}><Icon name="sun" size={18}/>{hints===0?"I could use a hint":hints<3?"Another small hint":"All hints are open"}</button><span>{hints} / 3 hints</span></div>}
  </div>}</Modal>;
}
