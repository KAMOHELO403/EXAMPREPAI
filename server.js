const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// FIX: Don't auto-serve index.html, we control routes manually
app.use(express.static(__dirname, { index: false }));

const QUESTION_MODEL_ANSWERS = {
  1: "Bread contains starch, which begins digestion in the mouth with salivary amylase. In the small intestine, pancreatic amylase continues starch digestion, producing maltose and short oligosaccharides; brush-border enzymes such as maltase then release glucose. Egg protein is denatured by stomach acid and digestion begins with pepsin. Pancreatic proteases and intestinal peptidases break peptides down into amino acids and small peptides. Avocado triglycerides are emulsified by bile salts, then pancreatic lipase digests them mainly into fatty acids and monoglycerides. Glucose and amino acids are absorbed into intestinal capillaries and travel to the liver through the hepatic portal vein. Long-chain lipid products enter enterocytes, are reassembled into triglycerides and packaged into chylomicrons, which enter lacteals, pass through lymph and then reach systemic circulation.",
  2: "Normal pancreatic amylase still digests starch, but without enough maltase in the brush border, maltose is not converted efficiently into glucose. This leaves less glucose available for absorption and reduces the supply of glucose to tissues, so blood glucose after a meal would be lower and ATP production from carbohydrate would be reduced.",
  3: "Reduced pancreatic lipase would impair triglyceride digestion, so fewer fatty acids and monoglycerides would be released. Fat absorption would fall, chylomicron formation would be reduced, and the athlete would have less fat-derived energy available during prolonged exercise.",
  4: "Bile salts emulsify large fat droplets into smaller droplets, increasing the surface area that pancreatic lipase can act on. If insufficient bile reaches the duodenum, lipid digestion is reduced, fat absorption is poorer and the body has less access to stored energy from dietary fat.",
  5: "Glucose is absorbed mainly by sodium-dependent cotransport through SGLT1, fructose uses GLUT5-mediated facilitated diffusion, and dietary lipids are digested to fatty acids and monoglycerides, absorbed into enterocytes, reassembled into triglycerides and packaged into chylomicrons. Glucose and fructose reach the liver via the portal blood, while lipids travel through lacteals and lymph before entering the bloodstream.",
  6: "Damage to the villi and brush border reduces both digestive enzyme activity and absorptive surface area. Carbohydrate and protein digestion would be less efficient, and the absorption of glucose and amino acids would fall, which could reduce exercise performance by limiting energy supply and recovery.",
  7: "The stomach begins protein digestion because acid denatures proteins and pepsin breaks peptide bonds. However, the stomach is not the major site of absorption because it lacks the large absorptive surface area and specialised transport systems of the small intestine.",
  8: "A high-carbohydrate meal is digested in the mouth and small intestine, where amylase breaks starch into sugars. Glucose is absorbed into the blood, blood glucose rises, insulin is secreted, and glucose is taken up by muscle and liver cells for storage or use in glycolysis to produce ATP during the race.",
  9: "Carbohydrate is digested to glucose, which is absorbed rapidly and reaches the blood quickly for immediate energy. Fat requires bile emulsification and lipase digestion before absorption into enterocytes and packaging into chylomicrons for transport through lymph. Carbohydrate is therefore more rapidly available for ATP production, while fat provides a slower but more sustained energy source.",
  10: "Long-chain fatty acids and monoglycerides enter enterocytes, where they are reassembled into triglycerides. Because triglycerides are hydrophobic, they are packaged into chylomicrons for transport. Chylomicrons enter lacteals, move through lymphatic vessels and then drain into systemic blood so dietary lipids can reach tissues.",
  11: "After a meal, rising blood glucose is detected by beta cells in the pancreas. These cells release insulin, which increases glucose uptake into muscle and liver cells and stimulates glycogen synthesis, helping lower blood glucose and restore homeostasis.",
  12: "During prolonged exercise, falling blood glucose reduces insulin secretion and increases glucagon secretion. Lower insulin allows more liver glucose release, while rising glucagon stimulates glycogenolysis and gluconeogenesis, preserving blood glucose and energy supply for muscle and the brain.",
  13: "If muscle cells respond poorly to insulin, GLUT4 translocation is reduced and glucose uptake into skeletal muscle falls. This reduces glycogen storage and ATP production during exercise, so performance is impaired.",
  14: "Insulin promotes storage and anabolism after feeding by increasing glucose uptake and glycogen synthesis, while glucagon promotes mobilisation and catabolism by encouraging hepatic glucose release. Both hormones cannot be maximally active at the same time because they would oppose each other and prevent effective regulation of blood glucose.",
  15: "Low T3 and T4 reduce basal metabolic rate and heat production, so the person may feel cold and have lower energy expenditure. Exercise performance may be impaired because thyroid hormones normally support metabolism, thermoregulation and efficient aerobic energy use.",
  16: "If TSH secretion from the pituitary is very low, the thyroid receives less stimulation and produces less T3 and T4. This reduces metabolic rate and heat production, causing a lower overall metabolic response.",
  17: "Growth hormone supports protein synthesis, tissue repair and growth in muscle and bone. After exercise, it can help with adaptation and recovery by promoting muscle and skeletal tissue maintenance.",
  18: "ACTH stimulates cortisol release, which helps mobilise glucose and fatty acids during stress. This is important during demanding exercise because the body needs energy support and the stress response helps maintain blood pressure and metabolic readiness.",
  19: "The pituitary is called the master gland because it controls other endocrine glands through hormones such as TSH, ACTH and gonadotrophins. For example, TSH stimulates the thyroid and ACTH stimulates the adrenal cortex, so the pituitary regulates major metabolic and stress responses.",
  20: "Testosterone and oestrogen are steroid hormones that diffuse into cells and bind intracellular nuclear receptors, altering gene transcription. This contrasts with hormones that bind cell-surface receptors and use second messengers. Reproductive hormones influence muscle protein synthesis and bone mineralisation.",
  21: "After a carbohydrate-rich meal, digestion releases glucose, which is absorbed into the blood. Blood glucose rises and stimulates insulin secretion, allowing muscle to take up glucose and use it for ATP production during exercise. As exercise continues, the hormonal response shifts to maintain blood glucose and fuel demand.",
  22: "Absorption into the blood does not guarantee glucose reaches muscle cells because cells also need insulin-sensitive transport. Insulin promotes glucose uptake into muscle and liver cells, so without proper insulin action, muscles cannot efficiently use the absorbed glucose.",
  23: "Before a marathon, carbohydrate digestion provides glucose that is absorbed and stored as glycogen. insulin helps store glucose after eating, while later glucagon rises to stimulate glycogen breakdown and gluconeogenesis as the event continues. These endocrine actions help maintain glucose supply for ATP production.",
  24: "Even if nutrients are absorbed, the endocrine pancreas is still needed to regulate how they are used. If pancreatic endocrine function is impaired, insulin and glucagon secretion may be abnormal, so blood glucose and energy availability cannot be controlled properly despite successful digestion and absorption.",
  25: "Normal endocrine function cannot replace nutrients that never enter the body. If intestinal malabsorption is severe, too little glucose, amino acids and fatty acids enter the circulation, so tissues cannot be adequately supplied even with normal hormone regulation.",
  26: "Carbohydrate ingestion is followed by amylase digestion of starch to glucose. Glucose is absorbed into the blood, raising blood glucose and stimulating insulin release. Insulin promotes muscle glucose uptake and glycogen storage, and the glucose is then used in glycolysis and cellular respiration to produce ATP.",
  27: "Dietary triglycerides are emulsified by bile salts and digested by pancreatic lipase to fatty acids and monoglycerides. These are absorbed into enterocytes, reassembled into triglycerides and packaged into chylomicrons. Chylomicrons enter lacteals, move through lymph and then reach systemic circulation.",
  28: "The statement is incomplete because digestion, absorption, transport, hormonal regulation and cellular ATP production are separate steps. Digestion breaks food down, absorption moves nutrients into the body, transport carries them to tissues, hormones regulate their use, and ATP generation occurs inside cells. Muscles need absorbed nutrients and metabolic processing, not digestion alone.",
  29: "The pancreas integrates digestion and endocrine regulation because it has exocrine and endocrine functions. Its exocrine cells secrete digestive enzymes into the small intestine, while its endocrine cells release insulin and glucagon into the blood to control glucose metabolism.",
  30: "Before exercise, a carbohydrate meal is digested and glucose is absorbed into the blood. The pancreas releases insulin to help regulate blood glucose and the liver stores glycogen for later use, while skeletal muscle takes up glucose and uses it to create ATP during exercise.",
  31: "After a large carbohydrate meal, starch is digested by amylase and glucose is absorbed from the small intestine into the bloodstream. This raises blood glucose and stimulates insulin secretion, increasing glucose uptake by muscle. As exercise continues and glucose falls, insulin falls and glucagon rises to promote glycogenolysis and maintain energy supply.",
  32: "Reduced bile release prevents effective emulsification of dietary fat, so pancreatic lipase has less surface area to work on. Fat absorption is reduced, chylomicron formation falls and lipid transport from the intestine to the body is compromised, reducing energy availability.",
  33: "Reduced thyroid hormone secretion lowers metabolic rate, reduces heat production and can impair exercise capacity. T3 and T4 normally support metabolism, thermoregulation and efficient aerobic performance, so a lower thyroid output can reduce endurance and energy use.",
  34: "Protein digestion begins in the stomach, where pepsin and acid break proteins into smaller peptides. In the small intestine, pancreatic enzymes and brush border peptidases continue digestion to amino acids, which are absorbed into the blood. These amino acids are necessary for muscle repair and tissue synthesis because the body cannot use whole proteins directly.",
  35: "After a long training session, the body needs to restore glycogen, fluids and damaged tissues. The digestive system provides glucose, amino acids and fatty acids, while hormones such as insulin, glucagon, cortisol and growth hormone coordinate storage, recovery and homeostasis. Together, these systems restore balance and support adaptation after exercise."
};

const STOP_WORDS = new Set(["about","after","again","against","all","also","always","am","an","and","any","are","as","at","be","because","been","before","being","between","both","but","by","can","could","did","do","does","doing","down","during","each","few","for","from","further","had","has","have","having","he","her","here","hers","herself","him","himself","his","how","i","if","in","into","is","it","its","itself","just","me","more","most","my","myself","no","nor","not","off","on","once","only","or","other","our","ours","ourselves","out","over","own","same","she","should","so","some","such","than","that","the","their","theirs","them","themselves","then","there","these","they","this","those","through","to","too","under","until","up","very","was","we","were","what","when","where","which","while","who","whom","why","will","with","you","your","yours","yourself","yourselves"]);

function normalise(text = "") {
  return String(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function scoreAnswer(questionNumber, answer = "") {
  const cleaned = String(answer).trim();
  const modelAnswer = QUESTION_MODEL_ANSWERS[Number(questionNumber)] || "";
  if (!cleaned) return { score: 0, feedback: "Please write an answer before submitting it for marking.", correctAnswer: modelAnswer };
  const normalizedAnswer = normalise(cleaned);
  const normalizedModel = normalise(modelAnswer);
  const answerWords = new Set(normalizedAnswer.split(/\s+/).filter(word => word.length > 3 && !STOP_WORDS.has(word)));
  const modelWords = [...new Set(normalizedModel.split(/\s+/).filter(word => word.length > 3 && !STOP_WORDS.has(word)))];
  const overlap = modelWords.filter(word => answerWords.has(word)).length;
  const coreConcepts = Number(questionNumber) === 1 ? [ /starch|carbohydrat/i.test(cleaned) && /amylase/i.test(cleaned), /protein/i.test(cleaned) && /pepsin/i.test(cleaned) && /stomach|gastric|acid/i.test(cleaned), /protein/i.test(cleaned) && /amino acid|peptide/i.test(cleaned) && /pancreatic|protease|peptidase|trypsin/i.test(cleaned), /bile/i.test(cleaned) && /emulsif|droplet/i.test(cleaned), /lipase/i.test(cleaned) && /fatty acid|monoglyceride/i.test(cleaned), /glucose|amino acid/i.test(cleaned) && /portal|capillar/i.test(cleaned), /chylomicron/i.test(cleaned) && /lymph|lacteal/i.test(cleaned) ] : null;
  const coverage = coreConcepts ? coreConcepts.filter(Boolean).length / coreConcepts.length : (modelWords.length ? overlap / modelWords.length : 0);
  const wordCount = normalizedAnswer.split(/\s+/).filter(Boolean).length;
  const meaningfulWordCount = answerWords.size;
  const hasCausalReasoning = /\b(because|therefore|so that|as a result|which causes|which means|leading to|results in)\b/i.test(cleaned);
  let score = Math.round(coverage * 80 + (hasCausalReasoning ? 10 : 0) + Math.min(10, Math.max(0, (wordCount - 8) / 4)));
  if (meaningfulWordCount <= 2) score = Math.min(score, 5);
  else if (wordCount < 8) score = Math.min(score, 15);
  else if (wordCount < 15) score = Math.min(score, 30);
  else if (wordCount < 25) score = Math.min(score, 50);
  score = Math.max(0, Math.min(100, score));
  let feedback;
  if (wordCount < 4 || meaningfulWordCount <= 2) feedback = "This is too brief to demonstrate understanding. Write a complete explanation using the relevant physiological steps. The model answer below shows what to include.";
  else if (score >= 85) feedback = "Strong response. You covered most of the key concepts and connected them clearly.";
  else if (score >= 70) feedback = "Good understanding. Check the model answer below for important steps or details you may have missed.";
  else if (score >= 45) feedback = "Part of your answer is relevant, but several key concepts or links are missing. Compare it with the model answer below.";
  else feedback = "Your answer does not yet demonstrate enough of the required concepts. Review the model answer and try again in your own words.";
  return { score, feedback, correctAnswer: modelAnswer };
}

app.post("/mark", (req, res) => {
  const payload = req.body || {};
  const questionNumber = Number(payload.questionNumber ?? payload.questionId ?? 1);
  const answer = payload.answer;
  if (!answer || typeof answer !== "string") return res.status(400).json({ error: "Answer is required" });
  res.json(scoreAnswer(questionNumber, answer));
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "exam-prep-marking-server" });
});

// LOGIN ROUTES - MUST BE BEFORE CATCH-ALL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/exam", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
  console.log(`Login: http://localhost:${PORT}/`);
  console.log(`Exam: http://localhost:${PORT}/exam`);
});
