import {whatsapp} from './data.js';

// General education only. Operational instructions must be confirmed with Javim.
const bloodDuring='Usually a small blood sample is taken from a vein. Tell the collector if you tend to faint or bruise easily.';
const bloodAfter='Apply pressure as directed after collection. Review the result with your clinician alongside your symptoms and other tests.';
const entries={
 'Blood Grouping':['Bring any previous blood-group record if available. Ask whether additional tests are needed for your clinical purpose.'],
 'Full Hemogram':['Fasting is generally not needed for this test alone. Other tests booked with it may have different preparation.'],
 'Coagulation Profile':['Tell the team about blood-thinning medicines and your last dose. Do not change your dose without your prescribing clinician’s advice.'],
 'Erythrocyte Sedimentation Rate':['Tell your clinician about recent illness and medicines. Ask whether other tests in your request need preparation.'],
 'Urea, Electrolytes & Creatinine':['Discuss medicines and any fluid restrictions with your clinician. Ask the team whether your combined test request needs fasting.'],
 'Bone Profile':['Share the exact request and any calcium or vitamin supplements you use. Confirm which measurements are included and any preparation.'],
 'Liver Function Tests':['Tell your clinician about medicines, supplements and recent alcohol intake. Confirm preparation for the full set of tests requested.'],
 'Lipid Profile':['Ask whether a fasting or non-fasting sample is appropriate for your request. If fasting is required, confirm the duration and what you may drink.'],
 'Anti-nuclear Antibody':['Bring the clinical request and any previous autoimmune test results. No special preparation is usually needed for this test alone.'],
 'Extractable Nuclear Antigen Profile':['Bring any previous ANA result and your clinician’s request. Confirm which antibodies are included in the available profile.'],
 'Anti-CCP':['Bring your clinician’s request and relevant previous joint or autoimmune investigations. Confirm preparation if other tests are being collected.'],
 'Vitamin D':['Tell the team about vitamin D supplements and their dose. Ask how these should be recorded when interpreting the result.'],
 'Vitamin B12':['Tell your clinician about B12 tablets or injections and when you last used them. Ask whether any preparation is needed; do not stop treatment yourself.'],
 'C-Reactive Protein':['Mention recent illness, injury or surgery to your clinician. Ask about preparation for any other tests booked alongside this one.'],
 'Total IgE':['Share relevant allergy symptoms and your clinician’s request. Ask whether additional, allergen-specific testing is needed.'],
 'Free Testosterone':['Confirm the appropriate collection time with your clinician and the lab. Share hormone medicines and supplements you use.'],
 'Estradiol':['Confirm the requested menstrual-cycle day, if relevant. Tell the team about pregnancy, menopause or hormone medicines.'],
 'Luteinizing Hormone':['Check whether your clinician wants collection on a specific cycle day. Record the date of your last period if relevant.'],
 'Thyroid Function Tests':['Mention thyroid medicines and supplements, especially biotin. Ask your clinician or the lab about collection timing; do not stop medicines yourself.'],
 'Follicle Stimulating Hormone':['Confirm any requested cycle day and share relevant hormone treatment. The reason for testing affects when a sample is most useful.'],
 'Prostate Specific Antigen':['Tell your clinician about urinary infection or recent prostate procedures. Ask about activity-related preparation and the appropriate timing of this test.'],
 'HbA1c':['Fasting is generally not needed for HbA1c alone. Tell your clinician about recent transfusion, pregnancy or conditions affecting red blood cells.'],
 'Prolactin':['Ask about the collection time and whether a rest period is needed. Tell the team about medicines and recent strenuous activity.'],
 'Cortisol (AM & PM)':['Confirm the exact morning or evening collection time before booking. Tell your clinician about steroid medicines; never stop them without advice.'],
 'Beta-hCG':['Share the timing of your last period or relevant fertility treatment with your clinician. Confirm whether repeat measurements have been requested.'],
 'Progesterone':['Confirm the collection day with your clinician; it depends on your cycle and the reason for testing. There is no single correct day for everyone.'],
 'Rheumatoid Factor':['Bring your clinician’s request and any previous joint or autoimmune investigations. Confirm preparation for tests booked alongside it.'],
 'ASOT':['Mention the timing of any recent throat or skin infection to your clinician. Ask whether a follow-up sample may be needed.'],
 'ASOT Titre':['Bring any earlier ASOT result and the dates of symptoms. Your clinician can advise whether paired measurements are useful.'],
 'Urine — Microscopy, Culture & Sensitivity':['Ask for the correct container and clean-catch instructions before collection. Tell the team about antibiotics; do not delay prescribed treatment.', 'You may be asked for a midstream urine specimen. Follow the laboratory’s collection instructions to reduce contamination.', 'Confirm delivery timing and storage with the lab before collecting. Do not assume any household container or storage method is suitable.'],
 'High Vaginal Swab — Microscopy, Culture & Sensitivity':['Ask about timing, vaginal products and any current treatment before your appointment. Tell the collector about pregnancy or symptoms.', 'A swab is collected from the vagina, usually by a trained professional. Ask what the procedure involves and discuss consent or comfort needs.', 'Ask when to expect results and how to follow up. Do not change or delay prescribed treatment without clinical advice.'],
 'Pus Swab — Microscopy, Culture & Sensitivity':['Contact the team about the wound and any dressings or antibiotics. Do not disturb the wound to obtain a sample yourself.', 'A trained collector samples an appropriate area of the wound or discharge. The collection method depends on the site.', 'Follow your clinician’s wound-care advice. Confirm result timing and follow-up with the team.'],
 'Blood Culture':['Tell the team about fever and current or recent antibiotics. Do not delay urgent care or prescribed antibiotics to arrange testing.', 'Blood is collected using careful skin cleaning, sometimes into more than one culture bottle. The collector confirms the required samples.', 'Culture results may take longer than routine blood tests. Confirm follow-up arrangements and seek care promptly if symptoms worsen.'],
 'GeneXpert':['Confirm the specimen required and where it should be collected before visiting. Ask the team about infection-control arrangements.', 'For sputum testing, the team explains how to provide material coughed from the chest rather than saliva.', 'Follow the laboratory’s instructions for the container and transport. Discuss the result and next steps with your treating clinician.'],
 'Stool Analysis':['Get an appropriate specimen container and collection instructions before collecting.', 'A stool specimen is provided in the container supplied or approved by the lab. Avoid contamination with urine or toilet water.', 'Ask the lab about delivery timing and storage before collecting. Your clinician may request further specimens depending on the findings.'],
 'Faecal Occult Blood':['Confirm the available method first: dietary and medicine-related preparation depends on the test. Do not stop prescribed medicines yourself.', 'A small stool specimen is collected using the kit or container specified by the lab.', 'Follow kit instructions and confirm delivery timing. A positive result needs clinical follow-up and does not identify a cause on its own.'],
 'Rapid Malaria Test':['Tell the team about fever, recent travel and malaria treatment. Testing should not delay assessment if you are unwell.', 'A small blood specimen is collected; confirm whether finger-prick or venous collection is used.', 'Discuss the result with a clinician. Persistent symptoms may need further assessment even after a negative test.'],
 'Typhoid Testing':['Ask which method is offered, what sample is needed and whether it suits your symptoms. Mention any antibiotic treatment.', 'The sample and collection procedure depend on the method confirmed by the laboratory.', 'Ask your clinician to interpret the result in context. Some methods have limitations and may need further testing.'],
 'H. pylori Test':['Confirm the method before booking. Acid-suppressing medicines, antibiotics and bismuth may affect some methods; ask your clinician about preparation.', 'Depending on the method offered, a blood or stool specimen may be required. The team confirms the collection instructions.', 'Ask whether the chosen method is suitable for diagnosis or checking treatment response. Do not stop medication without clinical advice.'],
 'Vibrio cholerae Test':['Contact the team before collecting a stool specimen. Severe diarrhoea or dehydration needs urgent medical attention; do not wait for a test.', 'The laboratory confirms the appropriate specimen, container and collection arrangements.', 'Follow the agreed transport instructions. Continue clinical care and hydration advice without waiting for laboratory results.'],
 'Histology':['Coordinate with the clinician taking the biopsy and the receiving laboratory. Confirm container, fixative and paperwork before the procedure.', 'Tissue is taken during a separate clinical procedure, then processed and examined. This listing does not mean a biopsy procedure is provided at the lab.', 'Follow the procedural clinician’s aftercare. Confirm reporting time and who will explain the findings; do not transfer tissue into another container yourself.'],
 'Pap Smear':['Ask about timing around menstruation, vaginal products and recent treatment. Mention pregnancy and any previous cervical screening results.', 'A trained professional uses a speculum and a small collection device to obtain cervical cells. Discuss consent, comfort and any concerns beforehand.', 'Light spotting can occur. Ask the collector about aftercare and contact a clinician for heavy bleeding, significant pain or other concerning symptoms.'],
};
export function guidanceFor(test){
 const entry=entries[test.name];
 if(!entry)throw new Error(`Missing test guidance: ${test.name}`);
 return {before:entry[0],during:entry[1]||bloodDuring,after:entry[2]||bloodAfter};
}
export function renderGuidance(test){
 const g=guidanceFor(test);
 return `<details class="test-guide" name="test-guidance"><summary>Before your test <span aria-hidden="true">+</span></summary><div class="test-guide-card"><span class="eyebrow">YOUR TEST, EXPLAINED</span><div class="test-guide-columns">${['before','during','after'].map(key=>`<section><h4>${key[0].toUpperCase()+key.slice(1)}</h4><p>${g[key]}</p></section>`).join('')}</div><p class="test-guide-note">General guidance. Confirm your preparation, specimen instructions, price, timing and any external testing with Javim before proceeding.</p><a class="text-link whatsapp-link" href="${whatsapp(`Hello Javim Medical, I would like guidance for ${test.name}. Please confirm preparation, sample arrangements, pricing, expected timing and whether external testing is needed.`)}" target="_blank" rel="noopener noreferrer">Ask about this test <span aria-hidden="true">→</span></a></div></details>`;
}
export function initGuidance(){
 const root=document.querySelector('#catalogue-results');if(!root)return;
 function open(guide){root.querySelectorAll('.test-guide[open]').forEach(other=>{if(other!==guide){other.open=false;delete other.dataset.pinned;}});guide.open=true;}
 root.addEventListener('pointerover',event=>{if(event.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;const guide=event.target.closest('.test-guide');if(guide&&!guide.dataset.dismissed)open(guide);});
 root.addEventListener('pointerout',event=>{const guide=event.target.closest('.test-guide');if(guide&&!guide.contains(event.relatedTarget)){delete guide.dataset.dismissed;if(!guide.dataset.pinned&&!guide.contains(document.activeElement))guide.open=false;}});
 root.addEventListener('focusin',event=>{const guide=event.target.closest('.test-guide');if(guide&&!guide.dataset.dismissed)open(guide);});
 root.addEventListener('focusout',event=>{const guide=event.target.closest('.test-guide');if(guide&&!guide.contains(event.relatedTarget)&&!guide.dataset.pinned&&!guide.matches(':hover'))guide.open=false;});
 root.addEventListener('click',event=>{const summary=event.target.closest('.test-guide>summary');if(!summary)return;event.preventDefault();const guide=summary.parentElement;if(guide.dataset.pinned){guide.open=false;delete guide.dataset.pinned;guide.dataset.dismissed='true';}else{delete guide.dataset.dismissed;open(guide);guide.dataset.pinned='true';}});
 root.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const guide=event.target.closest('.test-guide');if(guide){event.preventDefault();guide.querySelector('summary').focus();guide.open=false;delete guide.dataset.pinned;guide.dataset.dismissed='true';}});
}
