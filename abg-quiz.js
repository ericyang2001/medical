'use strict';
// Questions follow the four original case explanations in chapter 17.
const abgQuizSteps = [
 [
  ['pH 7.32 屬於哪一種狀態？',['酸血症','鹼血症','正常範圍'],0],
  ['主要的酸鹼異常是什麼？',['呼吸性酸中毒','代謝性酸中毒','代謝性鹼中毒'],1],
  ['依 Winter’s formula，PaCO₂ 32 的代償是否適當？',['合併呼吸性酸中毒','合併呼吸性鹼中毒','預期 32 ± 2，代償適當'],2],
  ['AG 經白蛋白校正後是多少？',['12，正常 AG','17，高 AG','7，低 AG'],1],
  ['Δ/Δ 約 0.63 代表什麼？',['合併正常 AG 代謝性酸中毒（NAGMA）','合併代謝性鹼中毒','單純 HAGMA'],0],
  ['綜合資料，最終判讀是什麼？',['單純呼吸性酸中毒','單純高氯性 NAGMA','乳酸中毒（HAGMA）＋大量 NS 造成的高氯性 NAGMA'],2]
 ],
 [
  ['pH 7.28 屬於哪一種狀態？',['正常範圍','酸血症','鹼血症'],1],
  ['PaCO₂ 70 提示哪一種原發異常？',['呼吸性酸中毒','呼吸性鹼中毒','代謝性酸中毒'],0],
  ['HCO₃⁻ 32、pH 7.28 介於急性與慢性預期值之間，如何判讀？',['單純急性呼吸性酸中毒','單純慢性呼吸性酸中毒','慢性呼吸性酸中毒急性惡化'],2],
  ['依本題原文判讀，AG 與 Δ/Δ 應如何處理？',['必須用 Δ/Δ 確診 HAGMA','無代謝性酸中毒，不需 AG 分析，仍建議看電解質','直接判定高 AG'],1],
  ['綜合病例，最可能的病因是什麼？',['COPD 急性惡化','大量生理食鹽水造成高氯性酸中毒','嘔吐造成代謝性鹼中毒'],0],
  ['依原文，本題的氧合目標與通氣處置為何？',['只提高氧流量，不處理通氣','SpO₂ 88–92%，Bilevel NIV，1–2 小時後複查 ABG','只觀察，不需複查 ABG'],1]
 ],
 [
  ['pH 7.37 接近正常，下一步應如何判斷？',['已排除酸鹼異常','屬於鹼血症','HCO₃⁻ 不正常，仍須繼續判讀'],2],
  ['HCO₃⁻ 20 提示哪一種異常？',['代謝性酸中毒','代謝性鹼中毒','呼吸性酸中毒'],0],
  ['Winter’s formula 預期 PaCO₂ 38 ± 2；實際 36 代表什麼？',['合併呼吸性酸中毒','在預期代償範圍內','超出範圍，合併呼吸性鹼中毒'],1],
  ['AG = 140 − (90 + 20)，結果為何？',['12，正常 AG','20，高 AG','30，高 AG'],2],
  ['Δ/Δ = 18 ÷ 4 = 4.5，代表什麼？',['合併代謝性鹼中毒','合併 NAGMA','單純 HAGMA'],0],
  ['綜合資料，最終判讀是什麼？',['單純嘔吐造成的代謝性鹼中毒','酒精性酮酸中毒（HAGMA）＋嘔吐造成的代謝性鹼中毒','酸鹼狀態正常'],1]
 ],
 [
  ['pH 7.22 屬於哪一種狀態？',['酸血症','正常範圍','鹼血症'],0],
  ['PaCO₂ 65 提示哪一種原發異常？',['代謝性酸中毒','呼吸性酸中毒','呼吸性鹼中毒'],1],
  ['急性預期 HCO₃⁻ 約 26.5、pH 約 7.20，與實際值相比如何判讀？',['慢性呼吸性酸中毒','代謝性鹼中毒','符合急性呼吸性酸中毒'],2],
  ['PAO₂ ≈ 150 − 65/0.8 ≈ 69，A-a gradient 為何？',['約 9 mmHg，正常','約 60 mmHg，升高','約 69 mmHg，升高'],0],
  ['依本題正常的 A-a gradient，低血氧的機轉為何？',['肺內分流','單純通氣不足','擴散障礙'],1],
  ['結合昏睡、RR 6 與針尖狀瞳孔，最終判讀與原文處置為何？',['COPD 急性惡化，僅給支氣管擴張劑','單純低血氧，只需給氧','鴉片類中毒；支持呼吸（BVM）、naloxone，無效再評估插管'],2]
 ]
];
function mountABGQuiz(){
 const cards=document.querySelectorAll('.abg-practice-card');
 if(!cards.length)return;
 document.querySelector('.abg-practice-intro').textContent='每次選擇一個答案，確認後進入下一步；完成該案例全部題目後，才公布對答結果與原文完整詳解。';
 cards.forEach(card=>{
  const steps=abgQuizSteps[Number(card.dataset.practice)-1];
  const form=card.querySelector('.abg-practice-form');
  if(!steps||form.dataset.quizMounted)return;
  form.dataset.quizMounted='true';
  const solution=card.querySelector('.abg-practice-solution');
  let current=0,answers=[];
  function render(focus=false){
   solution.hidden=true;
   const [question,options]=steps[current];
   form.innerHTML='<p class="abg-quiz-progress">第 '+(current+1)+' / '+steps.length+' 步</p><fieldset><legend tabindex="-1">'+escapeHTML(question)+'</legend><div class="abg-quiz-options">'+options.map((option,i)=>'<label><input type="radio" name="choice" value="'+i+'" required><span>'+escapeHTML(option)+'</span></label>').join('')+'</div></fieldset><div class="abg-practice-actions"><button type="submit">'+(current===steps.length-1?'完成練習，公布詳解':'確認選擇，下一題')+'</button></div>';
   if(focus)form.querySelector('legend').focus({preventScroll:true});
  }
  form.addEventListener('submit',event=>{
   event.preventDefault();
   const selected=form.querySelector('input:checked');if(!selected)return;
   answers.push(Number(selected.value));
   current++;
   if(current<steps.length){render(true);return}
   const score=steps.filter((step,i)=>step[2]===answers[i]).length;
   form.innerHTML='<h4 tabindex="-1">完成練習：'+score+' / '+steps.length+' 題正確</h4><ol class="abg-quiz-review">'+steps.map(([question,options,correct],i)=>'<li><strong>'+escapeHTML(question)+'</strong><p>'+ (answers[i]===correct?'✓ 答對':'✗ 答錯')+'｜你的選擇：'+escapeHTML(options[answers[i]])+'</p>'+(answers[i]===correct?'':'<p>正確答案：'+escapeHTML(options[correct])+'</p>')+'</li>').join('')+'</ol><div class="abg-practice-actions"><button type="button" class="abg-quiz-reset">重新練習</button></div>';
   solution.hidden=false;
   form.querySelector('h4').focus({preventScroll:true});
  });
  form.addEventListener('click',event=>{
   if(!event.target.closest('.abg-quiz-reset'))return;
   current=0;answers=[];render(true);
  });
  render();
 });
}
