export const contact = {
  phone: '0114 793 610', phoneLink: '+254114793610', email: 'javimops@outlook.com',
  address: 'South C Shopping Centre, Nairobi',
};
export const whatsapp = (message = 'Hello Javim Medical, I would like to enquire about a laboratory test.') => `https://wa.me/254114793610?text=${encodeURIComponent(message)}`;
// Set the public Cal.com event URL for each appointment type when events are ready.
export const bookingTypes = [
  { id: 'visit', name: 'Visit the laboratory', description: 'Book a time to visit our lab for your test.', calUrl: import.meta.env?.VITE_CAL_LAB_VISIT_URL || '', message: 'Hello Javim Medical, I would like to book a laboratory visit.' },
  { id: 'dropoff', name: 'Drop off a sample', description: 'Arrange a time to bring your prepared specimen.', calUrl: import.meta.env?.VITE_CAL_SAMPLE_DROPOFF_URL || '', message: 'Hello Javim Medical, I would like to arrange a sample drop-off. Please confirm the preparation and transport requirements.' },
  { id: 'collection', name: 'Request sample collection', description: 'Prepared specimen pickup or a sample collection visit, in Nairobi and surrounding areas. Subject to confirmation.', calUrl: import.meta.env?.VITE_CAL_SAMPLE_COLLECTION_URL || '', message: 'Hello Javim Medical, I would like to request sample collection in Nairobi or the surrounding area. Please confirm coverage, availability and preparation requirements.' },
];
const test = (name, alias, description, sample = 'Blood') => ({name, alias, description, sample});
export const departments = [
  {id:'haematology', name:'Haematology', summary:'Blood counts, blood grouping and clotting studies.', tests:[
    test('Blood Grouping','ABO / Rhesus','Determines your ABO blood group and Rhesus type.'),
    test('Full Hemogram','FBC / CBC','Measures red cells, white cells and platelets.'),
    test('Coagulation Profile','PT / INR / APTT','Assesses blood clotting, including monitoring where prescribed.'),
    test('Erythrocyte Sedimentation Rate','ESR','A general marker of inflammation.'),
  ]},
  {id:'chemistry', name:'Clinical Chemistry', summary:'Kidney, liver, bone mineral and cholesterol profiles.', tests:[
    test('Urea, Electrolytes & Creatinine','UECs','Assesses kidney function and electrolyte balance.'),
    test('Bone Profile','Calcium / Magnesium / Phosphorus / Vitamin D3','Assesses bone mineral and related metabolic status.'),
    test('Liver Function Tests','LFTs','Measures liver enzymes, bilirubin and proteins.'),
    test('Lipid Profile','Cholesterol / Triglycerides','Measures cholesterol and triglycerides for cardiovascular assessment.'),
  ]},
  {id:'immunoassays', name:'Immunoassays & Hormones', summary:'Hormones, vitamins, autoimmune markers and more.', tests:[
    test('Anti-nuclear Antibody','ANA','An antibody test used in autoimmune assessment.'),
    test('Extractable Nuclear Antigen Profile','ENA Profile','Further antibody testing, often following an ANA result.'),
    test('Anti-CCP','Anti-cyclic citrullinated peptide','An antibody marker used in rheumatoid arthritis assessment.'),
    test('Vitamin D','25-OH Vit D','Measures vitamin D status.'),
    test('Vitamin B12','','Measures vitamin B12 status.'),
    test('C-Reactive Protein','CRP','Measures a marker of inflammation.'),
    test('Total IgE','','An antibody measurement used in allergy assessment.'),
    test('Free Testosterone','','Measures free testosterone.'),
    test('Estradiol','E2','A hormone measurement used in ovarian function and fertility assessment.'),
    test('Luteinizing Hormone','LH','A hormone measurement used in reproductive assessment.'),
    test('Thyroid Function Tests','TFTs / TSH / T3 / T4','Assesses thyroid function.'),
    test('Follicle Stimulating Hormone','FSH','A hormone measurement used in fertility and menopause assessment.'),
    test('Prostate Specific Antigen','PSA','Measures PSA for clinical assessment of prostate health.'),
    test('HbA1c','Glycated Haemoglobin','Reflects average blood glucose over approximately three months.'),
    test('Prolactin','','Measures prolactin for hormonal assessment.'),
    test('Cortisol (AM & PM)','','Measures cortisol at specified morning and evening collection times.'),
    test('Beta-hCG','β-hCG','Quantitative pregnancy-related hormone testing.'),
    test('Progesterone','','A hormone measurement used in ovulation and pregnancy assessment.'),
  ]},
  {id:'serology', name:'Serology', summary:'Antibody testing for clinical assessment.', tests:[
    test('Rheumatoid Factor','RF','An antibody measurement used in rheumatoid arthritis assessment.'),
    test('ASOT','Anti-streptolysin O','Tests for antibodies associated with streptococcal infection.'),
    test('ASOT Titre','','Quantifies the anti-streptolysin O antibody level.'),
  ]},
  {id:'microbiology', name:'Microbiology', summary:'Microscopy, culture, sensitivity and molecular testing.', tests:[
    test('Urine — Microscopy, Culture & Sensitivity','Urine M/C/S','Investigates urinary infection and antimicrobial sensitivity.','Urine'),
    test('High Vaginal Swab — Microscopy, Culture & Sensitivity','HVS M/C/S','Investigates infection using a vaginal swab.','Swab'),
    test('Pus Swab — Microscopy, Culture & Sensitivity','Pus M/C/S','Investigates organisms in wound or abscess specimens.','Swab'),
    test('Blood Culture','','Investigates bacteria or other organisms in the bloodstream.'),
    test('GeneXpert','TB PCR','Molecular testing for tuberculosis and rifampicin resistance.','Sputum'),
  ]},
  {id:'parasitology', name:'Parasitology', summary:'Stool investigations and selected infection tests.', tests:[
    test('Stool Analysis','Stool O/C','Microscopy for intestinal parasites, ova and cysts.','Stool'),
    test('Faecal Occult Blood','FOB','Detects blood in stool that may not be visible.','Stool'),
    test('Rapid Malaria Test','mRDT','Rapid testing for malaria.'),
    test('Typhoid Testing','Widal / Salmonella','Ask the laboratory to confirm the available method and appropriate specimen.'),
    test('H. pylori Test','','Testing for Helicobacter pylori. Ask the team about available methods.','Blood / Stool'),
    test('Vibrio cholerae Test','','Testing for cholera in an appropriate clinical context.','Stool'),
  ]},
  {id:'histology', name:'Histology & Cytology', summary:'Tissue investigations and cervical cytology.', tests:[
    test('Histology','Tissue biopsy','Processing and examination of biopsy or surgical specimens.','Tissue'),
    test('Pap Smear','Cervical cytology','Examination of cervical cells for screening.','Cervical smear'),
  ]},
];
export const systems = [
  {id:'blood', name:'Blood & circulation', description:'Explore blood counts, clotting studies and cardiovascular-related profiles.', tests:['Full Hemogram','Blood Grouping','Coagulation Profile','Lipid Profile']},
  {id:'thyroid', name:'Thyroid', description:'Explore tests used to assess thyroid function.', tests:['Thyroid Function Tests']},
  {id:'liver', name:'Liver', description:'Explore liver chemistry and related measurements.', tests:['Liver Function Tests']},
  {id:'kidneys', name:'Kidneys', description:'Explore kidney function, electrolytes and urine investigations.', tests:['Urea, Electrolytes & Creatinine','Urine — Microscopy, Culture & Sensitivity']},
  {id:'metabolic', name:'Metabolic health', description:'Explore longer-term blood glucose and vitamin measurements.', tests:['HbA1c','Vitamin D','Vitamin B12']},
];
export const allTests = departments.flatMap(d => d.tests.map(t => ({...t, department:d.id})));
export function matchesTest(t, query) {
  const text = `${t.name} ${t.alias} ${t.description} ${t.sample}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  return text.includes(query.toLowerCase().replace(/[^a-z0-9]/g, ''));
}
export function safeCalUrl(url) {
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && (parsed.hostname === 'cal.com' || parsed.hostname.endsWith('.cal.com')) ? parsed.href : ''; } catch { return ''; }
}
