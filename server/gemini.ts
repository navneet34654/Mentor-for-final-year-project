import { GoogleGenAI, Type } from '@google/genai';
import type { ProjectIdea, ProjectGenerationRequest, MentorMessage } from '../src/types.js';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateProjectIdeasWithGemini(
  req: ProjectGenerationRequest
): Promise<ProjectIdea[]> {
  const ai = getAiClient();

  const prompt = `
You are a distinguished Senior Computer Science Professor and Capstone Project Committee Head.
Generate exactly 4 highly practical, academically rigorous, and impressive Final-Year Project Ideas tailored for a university student with these criteria:

- Academic Domain: ${req.domain || 'Computer Science & Engineering'}
- Student Skills: ${req.skills || 'Python, JavaScript, SQL'}
- Specific Interests / Passions: ${req.interests || 'Applied AI, system building'}
- Preferred Technologies: ${req.preferredTech || 'Modern full stack or ML'}
- Target Difficulty Level: ${req.difficulty || 'Intermediate'}
- Expected Timeframe: ${req.timeframe || '12-16 weeks'}
- Team Size: ${req.teamSize || 'Individual or 2-3 members'}

Provide the response strictly as a JSON array of 4 objects adhering to this schema:
[
  {
    "id": "unique string id",
    "title": "Clear, professional academic project title",
    "tagline": "Compelling one-sentence summary of the innovation",
    "domain": "${req.domain}",
    "difficulty": "${req.difficulty || 'Intermediate'}",
    "estimatedTime": "${req.timeframe || '12-14 weeks'}",
    "problemStatement": "Detailed paragraph explaining the real-world gap, user pain points, and why this is a worthy capstone research/engineering effort.",
    "keyFeatures": [
      "Feature 1 with clear technical boundary",
      "Feature 2 with real-time or processing capability",
      "Feature 3 with user-facing interface",
      "Feature 4 with security, analytics, or export capability"
    ],
    "recommendedTechStack": {
      "frontend": ["Tech 1", "Tech 2"],
      "backend": ["Tech 1", "Tech 2"],
      "database": ["DB 1", "DB 2"],
      "aiMl": ["Model/Framework 1", "Model/Framework 2"],
      "devOps": ["Docker", "Cloud platform / Hosting"]
    },
    "developmentRoadmap": [
      {
        "phase": "Phase 1: Problem Definition & SRS",
        "duration": "Weeks 1-3",
        "milestones": ["Milestone A", "Milestone B"],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      },
      {
        "phase": "Phase 2: Core Architecture & Data Pipeline",
        "duration": "Weeks 4-7",
        "milestones": ["Milestone A", "Milestone B"],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      },
      {
        "phase": "Phase 3: Integration & User Interface",
        "duration": "Weeks 8-11",
        "milestones": ["Milestone A", "Milestone B"],
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      },
      {
        "phase": "Phase 4: Evaluation, Thesis & Viva Defense",
        "duration": "Weeks 12-14",
        "milestones": ["Benchmark metrics", "Slide deck & report"],
        "deliverables": ["Final Dissertation", "Recorded Demo"]
      }
    ],
    "aiMlIntegration": {
      "overview": "Explanation of how AI/ML provides non-trivial value (not just wrapper)",
      "algorithmsOrModels": ["Model/Architecture 1", "Model/Architecture 2"],
      "datasetSuggestions": ["Open dataset 1 (e.g. Kaggle/HuggingFace)", "Open dataset 2"],
      "evaluationMetrics": ["Metric 1 (e.g. F1-score, Precision)", "Metric 2 (e.g. Inference latency < 200ms)"]
    },
    "futureImprovements": [
      "Potential research extension 1",
      "Potential research extension 2"
    ],
    "academicEvaluationTips": [
      "Specific tip for viva defense and impress external examiner",
      "Architecture diagram or benchmarking recommendation"
    ],
    "vivaDefenseQuestions": [
      {
        "question": "Expected examiner theoretical or architectural question",
        "sampleAnswerHint": "How the student should articulate the answer with technical clarity"
      },
      {
        "question": "Expected question about limitations or evaluation",
        "sampleAnswerHint": "Nuanced, honest answer showing deep understanding"
      }
    ]
  }
]
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...item,
            id: item.id || `proj_gen_${Date.now()}_${idx}`,
            difficulty: (['Beginner', 'Intermediate', 'Advanced'].includes(item.difficulty)
              ? item.difficulty
              : req.difficulty || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
          }));
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to curated generator:', err);
    }
  }

  // Fallback curated project ideas based on request
  return generateCuratedFallbackIdeas(req);
}

export async function askAiMentor(params: {
  userMessage: string;
  projectContext?: ProjectIdea | null;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  userProfile?: { name?: string; degree?: string; college?: string };
}): Promise<{ reply: string; suggestedActions: string[] }> {
  const ai = getAiClient();

  const contextPrompt = params.projectContext
    ? `
Active Final-Year Project Context:
- Title: ${params.projectContext.title}
- Tagline: ${params.projectContext.tagline}
- Domain: ${params.projectContext.domain}
- Difficulty: ${params.projectContext.difficulty}
- Problem Statement: ${params.projectContext.problemStatement}
- Recommended Tech Stack: Frontend: ${params.projectContext.recommendedTechStack.frontend.join(', ')} | Backend: ${params.projectContext.recommendedTechStack.backend.join(', ')} | DB: ${params.projectContext.recommendedTechStack.database.join(', ')} | AI/ML: ${params.projectContext.recommendedTechStack.aiMl.join(', ')}
- AI/ML Overview: ${params.projectContext.aiMlIntegration.overview}
- Development Phases: ${params.projectContext.developmentRoadmap.map(p => `${p.phase} (${p.duration})`).join(' -> ')}
`
    : 'No specific project attached. Provide general final-year project guidance.';

  const systemInstruction = `
You are Professor Alistair Vance, a supportive, highly technical, and pragmatic Academic Advisor & Senior Final-Year Project Mentor.
Your mission is to help university students succeed in their final-year / capstone project, excel in their viva voce defense, build production-grade architectures, write stellar thesis chapters, and overcome coding bottlenecks.

Tone: Professional, encouraging, academic yet industry-grounded.
Guidelines:
1. Provide actionable, structured advice using clean Markdown formatting (bold headers, bullet points, clean code snippets if relevant).
2. If asked about Viva defense questions, give realistic examiner questions and explain the exact technical logic the student should articulate.
3. If asked about architecture or datasets, name exact concrete libraries, open repositories (e.g. Hugging Face, Kaggle, UCI ML Repository, Papers With Code), and architectural patterns.
4. Keep answers concise, high-value, and direct. Avoid fluffy filler text.
`;

  const conversationHistory = params.history
    .slice(-6)
    .map(h => `${h.role === 'user' ? 'Student' : 'Professor Vance'}: ${h.content}`)
    .join('\n\n');

  const fullPrompt = `
${contextPrompt}

Recent Conversation History:
${conversationHistory}

Current Student Query:
"${params.userMessage}"

Respond as Professor Vance. Also, after your response, suggest 3 concise follow-up actions or queries the student might want to explore next, formatted on the last line as:
SUGGESTIONS: ["First action", "Second action", "Third action"]
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const raw = response.text || '';
      let reply = raw;
      let suggestedActions = [
        'Predict 3 difficult viva defense questions',
        'Review database ER diagram & schema design',
        'Draft Section 1: Problem Statement for my report',
      ];

      const match = raw.match(/SUGGESTIONS:\s*(\[.*?\])/s);
      if (match) {
        try {
          const parsedSuggestions = JSON.parse(match[1]);
          if (Array.isArray(parsedSuggestions)) {
            suggestedActions = parsedSuggestions;
          }
          reply = raw.replace(/SUGGESTIONS:\s*\[.*?\]/s, '').trim();
        } catch {
          // ignore parse error
        }
      }

      return { reply, suggestedActions };
    } catch (err) {
      console.warn('Gemini chat call failed, returning smart fallback response:', err);
    }
  }

  // Fallback response if API key is not configured
  return getFallbackMentorResponse(params.userMessage, params.projectContext);
}

function generateCuratedFallbackIdeas(req: ProjectGenerationRequest): ProjectIdea[] {
  const domain = req.domain || 'Artificial Intelligence & Machine Learning';
  const diff = (req.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Intermediate';
  const timeframe = req.timeframe || '12-14 weeks';

  return [
    {
      id: `curated_${Date.now()}_1`,
      title: 'AutoAudit: LLM-Assisted Smart Contract Vulnerability Detector',
      tagline: 'Automated static analysis combined with AST graph neural networks to detect reentrancy and integer overflow in Solidity',
      domain,
      difficulty: diff,
      estimatedTime: timeframe,
      problemStatement: 'Decentralized applications suffer billions in annual exploit losses due to subtle logic and reentrancy bugs in deployed smart contracts. Traditional static analyzers suffer from high false-positive rates, whereas manual auditing is prohibitively expensive for student and startup projects.',
      keyFeatures: [
        'AST & Control Flow Graph (CFG) extraction from Solidity code',
        'Dual-head classifier combining Slither static rules with fine-tuned CodeLlama / Gemini code analysis',
        'Interactive Exploit Demonstration generator showing synthetic attack payloads',
        'Automated Patch Synthesizer proposing secure pull requests',
        'Comprehensive audit PDF report generator following CertiK standards'
      ],
      recommendedTechStack: {
        frontend: ['React 19', 'Tailwind CSS', 'Monaco Code Editor'],
        backend: ['FastAPI (Python)', 'Node.js'],
        database: ['PostgreSQL', 'Redis Cache'],
        aiMl: ['Gemini 3.8 Flash', 'PyTorch Geometric (GNN on CFG)', 'Slither / Mythril'],
        devOps: ['Docker', 'GitHub Actions CI']
      },
      developmentRoadmap: [
        {
          phase: 'Phase 1: Dataset & AST Parser',
          duration: 'Weeks 1-3',
          milestones: ['Collect 5,000 verified smart contracts with known CVEs (SmartBugs dataset)', 'Build AST and CFG extractor in Python'],
          deliverables: ['Preprocessed dataset pipeline', 'System Architecture Document']
        },
        {
          phase: 'Phase 2: Hybrid Detection Engine',
          duration: 'Weeks 4-7',
          milestones: ['Integrate rule-based analyzer with LLM verification prompt chain', 'Achieve >90% recall on Reentrancy & Access Control vulnerabilities'],
          deliverables: ['Core vulnerability detection engine with REST API']
        },
        {
          phase: 'Phase 3: Web Workbench & Remediation',
          duration: 'Weeks 8-11',
          milestones: ['Build interactive web IDE with syntax highlighting and bug annotations', 'Add automated diff patch generator and audit report export'],
          deliverables: ['Full-stack web application with demo contract suite']
        },
        {
          phase: 'Phase 4: Benchmarking & Defense',
          duration: 'Weeks 12-14',
          milestones: ['Benchmark against Slither and Mythril on accuracy and false positive rates', 'Finalize dissertation and viva rehearsal'],
          deliverables: ['Dissertation Report', 'Research Paper draft for student conference']
        }
      ],
      aiMlIntegration: {
        overview: 'Uses Graph Neural Networks on Abstract Syntax Trees combined with Gemini LLM reasoning to filter out false alarms produced by classical static analyzers.',
        algorithmsOrModels: ['Graph Convolutional Networks (GCN) on CFGs', 'Gemini 3.8 Flash for contextual vulnerability explanation', 'Heuristic rule engine'],
        datasetSuggestions: ['SmartBugs Wild Dataset', 'SWC Registry (Smart Contract Weakness Classification)', 'Etherscan verified contract repository'],
        evaluationMetrics: ['Precision, Recall, F1-Score on SWC-107 (Reentrancy)', 'Scan time per contract (< 3 seconds)']
      },
      futureImprovements: [
        'Support for Rust / Solana Anchor smart contracts',
        'Fuzzing engine integration with Foundry'
      ],
      academicEvaluationTips: [
        'Highlight your false-positive reduction compared to standalone static analysis tools.',
        'Demonstrate with a live vulnerable contract (e.g. The DAO reentrancy demo).'
      ],
      vivaDefenseQuestions: [
        {
          question: 'How does your solution distinguish between a benign recursive call and a malicious reentrancy exploit?',
          sampleAnswerHint: 'Explain checks-effects-interactions pattern violation: the state update occurs after external call in reentrancy, which the CFG state graph detects.'
        },
        {
          question: 'Why not rely solely on an LLM without AST graph parsing?',
          sampleAnswerHint: 'Raw LLMs hallucinate syntax and struggle with large contract dependencies; combining deterministic AST parsing with LLM semantic reasoning guarantees precision.'
        }
      ]
    },
    {
      id: `curated_${Date.now()}_2`,
      title: 'NeuroVision: Edge-Optimized Real-Time Sign Language Translator',
      tagline: 'Low-latency bidirectional translation between American Sign Language (ASL) gestures and synthesized speech on commodity webcams',
      domain,
      difficulty: diff,
      estimatedTime: timeframe,
      problemStatement: 'Over 70 million deaf individuals globally experience persistent communication barriers in healthcare, public transit, and academic lectures. Existing translation solutions require cumbersome sensor gloves or expensive multi-camera depth hardware.',
      keyFeatures: [
        'Real-time hand and body keypoint landmark tracking using MediaPipe Hands & Pose',
        'Temporal Transformer / Bi-LSTM network for continuous dynamic sentence-level gesture recognition',
        'Reverse Mode: Speech-to-Sign Avatar that animates 3D skeletal gestures from spoken words',
        'Low-resource edge inference running at 30+ FPS directly in browser via ONNX Runtime Web',
        'Personalized gesture calibration wizard for individual hand anatomy variations'
      ],
      recommendedTechStack: {
        frontend: ['React 19', 'Tailwind CSS', 'Three.js / WebGL for 3D Avatar', 'WebRTC / MediaDevices'],
        backend: ['FastAPI (Python)', 'WebSockets'],
        database: ['SQLite / IndexedDB for local offline dictionary'],
        aiMl: ['MediaPipe Hands & Holistic', 'ONNX Runtime Web (Edge ML)', 'Bi-LSTM / Temporal Convolutional Network', 'Web Speech API'],
        devOps: ['Docker', 'Vercel / Cloud Run']
      },
      developmentRoadmap: [
        {
          phase: 'Phase 1: Gesture Data Acquisition & Normalization',
          duration: 'Weeks 1-3',
          milestones: ['Collect 30 key conversational ASL gestures from WLASL dataset', 'Implement 3D coordinate normalization relative to wrist point'],
          deliverables: ['Clean normalized dataset of temporal landmark sequences']
        },
        {
          phase: 'Phase 2: Temporal Sequence Modeling',
          duration: 'Weeks 4-7',
          milestones: ['Train Bi-LSTM with Attention mechanism on gesture sequences', 'Convert trained PyTorch model to ONNX format with FP16 quantization'],
          deliverables: ['Model achieving >92% top-1 accuracy on target gesture lexicon']
        },
        {
          phase: 'Phase 3: Browser Pipeline & 3D Avatar',
          duration: 'Weeks 8-11',
          milestones: ['Integrate ONNX Runtime Web in React canvas', 'Implement real-time text-to-speech feedback and reverse 3D animation'],
          deliverables: ['End-to-end interactive translator web app']
        },
        {
          phase: 'Phase 4: User Trials & Viva Preparation',
          duration: 'Weeks 12-14',
          milestones: ['Test with 10 test participants under diverse lighting conditions', 'Compile thesis with confusion matrices and latency graphs'],
          deliverables: ['Dissertation Report and Live Demonstration Setup']
        }
      ],
      aiMlIntegration: {
        overview: 'Processes spatial-temporal keypoint coordinates rather than raw video pixels, reducing computational complexity by 98% and preserving user visual privacy.',
        algorithmsOrModels: ['MediaPipe Holistic Keypoint Extractor', 'Bi-directional LSTM with Self-Attention', 'ONNX Quantized Inference Engine'],
        datasetSuggestions: ['WLASL (World-Level American Sign Language)', 'In-house synthetic landmark capture via webcam'],
        evaluationMetrics: ['Word Error Rate (WER)', 'Inference latency (< 33ms for 30 FPS)', 'Top-1 and Top-3 Categorical Accuracy']
      },
      futureImprovements: [
        'Continuous finger-spelling for rare proper nouns and medical terminology',
        'Mobile deployment on Android via Flutter and TFLite'
      ],
      academicEvaluationTips: [
        'Stress privacy: since only landmark coordinates leave the camera (not raw pixels), explain GDPR compliance.',
        'Show a confusion matrix during viva explaining which similar hand-shapes were disambiguated.'
      ],
      vivaDefenseQuestions: [
        {
          question: 'Why extract MediaPipe landmarks instead of running a 3D-CNN directly on the video frames?',
          sampleAnswerHint: 'Landmark extraction strips lighting, skin tone, and background bias while reducing input dimensions from 1920x1080 pixels to 21 coordinate triplets, enabling 30 FPS client-side execution.'
        },
        {
          question: 'How does your model handle varying gesture speeds between different speakers?',
          sampleAnswerHint: 'We utilize Dynamic Time Warping (DTW) and temporal interpolation to resample all gesture sequences to a fixed temporal window before feeding into the sequence model.'
        }
      ]
    },
    {
      id: `curated_${Date.now()}_3`,
      title: 'GreenCloud: AI-Driven Cloud Carbon Footprint & FinOps Optimizer',
      tagline: 'Multi-cloud telemetry collector that predicts workload energy consumption and recommends Kubernetes pod autoscaling',
      domain,
      difficulty: diff,
      estimatedTime: timeframe,
      problemStatement: 'Data centers consume over 2% of global electricity. Modern engineering organizations struggle to balance cloud infrastructure operational costs with emerging ESG carbon emission compliance requirements without throttling service-level objectives (SLOs).',
      keyFeatures: [
        'Real-time Prometheus telemetry agent tracking CPU frequency, memory, and network throughput',
        'Carbon intensity mapping based on geographic server grid data (Electricity Maps API)',
        'Predictive Workload Forecasting using Temporal Fusion Transformers (TFT)',
        'Autonomous Kubernetes Horizontal Pod Autoscaler (HPA) policy synthesizer',
        'Executive FinOps & GreenOps interactive dashboard with simulated cost savings'
      ],
      recommendedTechStack: {
        frontend: ['React 19', 'Tailwind CSS', 'Recharts / D3.js', 'Lucide React'],
        backend: ['Go / Node.js Express', 'Python ML Microservice'],
        database: ['TimescaleDB (PostgreSQL Time-Series)', 'Redis'],
        aiMl: ['Scikit-learn', 'LightGBM / Prophet for Time Series Forecasting', 'Electricity Maps API'],
        devOps: ['Kubernetes (k8s / Minikube)', 'Prometheus & Grafana', 'Helm Charts']
      },
      developmentRoadmap: [
        {
          phase: 'Phase 1: Architecture & Metric Pipeline',
          duration: 'Weeks 1-3',
          milestones: ['Deploy local Minikube cluster with Prometheus node-exporter', 'Build real-time metric ingestion into TimescaleDB'],
          deliverables: ['Functional multi-metric telemetry pipeline']
        },
        {
          phase: 'Phase 2: Energy Modeling & Prediction',
          duration: 'Weeks 4-7',
          milestones: ['Formulate Joules-per-cycle power estimation model based on SPECpower benchmarks', 'Train workload forecasting model'],
          deliverables: ['Validated energy estimation algorithm with <8% error rate']
        },
        {
          phase: 'Phase 3: Optimizer & Executive Dashboard',
          duration: 'Weeks 8-11',
          milestones: ['Build custom Kubernetes CRD controller for Green HPA', 'Develop responsive analytics dashboard in React with Recharts'],
          deliverables: ['Production-ready dashboard and autoscaling engine']
        },
        {
          phase: 'Phase 4: Chaos Testing & Dissertation',
          duration: 'Weeks 12-14',
          milestones: ['Subject cluster to synthetic traffic spikes and measure energy savings', 'Complete dissertation chapters on Green Computing'],
          deliverables: ['Comprehensive Final Project Report and Defense Presentation']
        }
      ],
      aiMlIntegration: {
        overview: 'Forecasts upcoming traffic surges 30 minutes in advance to preemptively scale cloud pods during periods of renewable green grid energy.',
        algorithmsOrModels: ['LightGBM & Prophet for time-series request load forecasting', 'Linear Programming for cost vs carbon optimization trade-offs'],
        datasetSuggestions: ['Alibaba Cloud Cluster Trace Dataset', 'Google Cluster Workload Traces', 'Electricity Maps Grid Carbon Intensity API'],
        evaluationMetrics: ['Mean Absolute Percentage Error (MAPE) on workload prediction', 'Total kWh energy reduction percentage', 'P99 Latency SLA adherence']
      },
      futureImprovements: [
        'Multi-region traffic shifting to follow the sun (directing jobs to regions with peak solar output)',
        'Serverless AWS Lambda / Google Cloud Functions optimizer module'
      ],
      academicEvaluationTips: [
        'Highlight the intersection of two trending disciplines: Systems Engineering (Kubernetes) and Sustainability (Green IT).',
        'Have a live Grafana or custom chart showing before vs after carbon emissions during defense.'
      ],
      vivaDefenseQuestions: [
        {
          question: 'How do you calculate carbon emissions when the cloud provider does not disclose physical watt-meter readings?',
          sampleAnswerHint: 'We utilize open academic methodologies (Cloud Carbon Footprint standard) combining thermal design power (TDP) coefficients, CPU utilization percentages, and regional Power Usage Effectiveness (PUE) ratios.'
        },
        {
          question: 'What happens if your predictive model under-provisions during an unexpected flash crowd?',
          sampleAnswerHint: 'We implement safety guardrails: a reactive circuit breaker triggers immediate emergency scale-up whenever latency approaches 85% of the SLA threshold.'
        }
      ]
    },
    {
      id: `curated_${Date.now()}_4`,
      title: 'SafeRoute AI: Urban Crowd Density & Safety Navigation System',
      tagline: 'Computer vision and spatial graph routing platform that computes well-lit, low-risk pedestrian pathways in metropolitan areas',
      domain,
      difficulty: diff,
      estimatedTime: timeframe,
      problemStatement: 'Standard GPS navigation tools exclusively optimize for the shortest driving time, often routing solo pedestrians through unlit, isolated alleyways or unmonitored zones with elevated crime incidence.',
      keyFeatures: [
        'Multi-criteria Dijkstra / A* Routing algorithm weighing distance, street illumination, and crowd density',
        'CCTV / Street Imagery illumination classifier analyzing public webcam feeds',
        'Emergency SOS Shake Trigger with automated location ping to designated emergency contacts',
        'Crowdsourced hazard verification with Bayesian trust scoring to prevent false reports',
        'Interactive OpenStreetMap canvas with safety heatmaps and turn-by-turn guidance'
      ],
      recommendedTechStack: {
        frontend: ['React 19', 'Tailwind CSS', 'Leaflet / OpenStreetMap', 'Web Geolocation API'],
        backend: ['FastAPI / Node.js Express', 'PostGIS (PostgreSQL Spatial)'],
        database: ['PostgreSQL with PostGIS extension', 'Redis Spatial'],
        aiMl: ['YOLOv8-nano for person/crowd counting', 'Computer Vision illumination estimator', 'NetworkX spatial graphs'],
        devOps: ['Docker', 'Nginx', 'OpenStreetMap Overpass API']
      },
      developmentRoadmap: [
        {
          phase: 'Phase 1: Spatial Map & Graph Ingestion',
          duration: 'Weeks 1-3',
          milestones: ['Download OSM pedestrian network for target city', 'Import road segments into PostGIS database'],
          deliverables: ['Spatial road graph with length and street-type attributes']
        },
        {
          phase: 'Phase 2: Safety Scoring & Vision Pipeline',
          duration: 'Weeks 4-7',
          milestones: ['Implement street lighting score estimator from street view samples', 'Develop weighted A* pathfinding algorithm in Python'],
          deliverables: ['Multi-objective routing API with safety weight parameters']
        },
        {
          phase: 'Phase 3: Web Client & Safety Heatmap',
          duration: 'Weeks 8-11',
          milestones: ['Build interactive mobile-first React map interface', 'Add SOS trigger and verified danger reporting module'],
          deliverables: ['Production web application with responsive GPS navigation']
        },
        {
          phase: 'Phase 4: Field Testing & Thesis',
          duration: 'Weeks 12-14',
          milestones: ['Conduct field test across 15 pedestrian journeys', 'Draft academic thesis focusing on spatial data science and social impact'],
          deliverables: ['Dissertation Report and Field Study evaluation']
        }
      ],
      aiMlIntegration: {
        overview: 'Applies deep learning edge vision to compute real-time safety scores and dynamic edge weights on road network graphs.',
        algorithmsOrModels: ['YOLOv8-nano for anonymous pedestrian density estimation', 'A* Algorithm with Pareto-optimal multi-objective weights', 'OpenCV for lux level estimation'],
        datasetSuggestions: ['OpenStreetMap (OSM) Pedestrian Infrastructure data', 'City Open Data Crime Incident Portal', 'Synthetic camera test clips'],
        evaluationMetrics: ['Path safety index improvement (+35% over standard GPS)', 'Routing calculation latency (< 150ms)', 'Route detour ratio (< 12% extra distance)']
      },
      futureImprovements: [
        'Wearable watch companion app with haptic vibration navigation',
        'Voice-guided pedestrian safety warnings'
      ],
      academicEvaluationTips: [
        'Examiners appreciate practical societal impact: emphasize how this empowers vulnerable demographics.',
        'Demonstrate the multi-objective Pareto frontier showing safety vs travel time trade-offs.'
      ],
      vivaDefenseQuestions: [
        {
          question: 'How do you handle privacy concerns with pedestrian video feeds?',
          sampleAnswerHint: 'No video is stored or transmitted: the edge YOLO model processes frames in memory, increments a numerical density counter, and immediately purges the frame.'
        },
        {
          question: 'What is the time complexity of your multi-objective routing algorithm compared to standard Dijkstra?',
          sampleAnswerHint: 'By integrating heuristic A* with an augmented cost function combining Euclidean distance and inverted safety coefficients, we maintain O((E + V) log V) complexity.'
        }
      ]
    }
  ];
}

function getFallbackMentorResponse(
  userMessage: string,
  project?: ProjectIdea | null
): { reply: string; suggestedActions: string[] } {
  const projTitle = project ? project.title : 'your final-year project';
  
  return {
    reply: `Hello! I've reviewed your question regarding **${projTitle}**.

Here is my recommended academic and engineering strategy:

### 1. Architectural Clarity
Ensure your system exhibits a distinct separation of concerns:
- **Presentation Layer**: Responsive client with clear state boundaries.
- **Service & Inference Layer**: Decouple long-running AI or analytical pipelines into asynchronous worker queues or dedicated microservices to prevent HTTP request timeouts.
- **Persistence Layer**: Utilize relational integrity for critical schemas (users, project records, audit logs) and specialized stores (vector databases or time-series) only where technically justified.

### 2. Viva Voce / Defense Preparation
External examiners will inevitably probe three core dimensions:
1. **"Why this stack over the standard alternative?"** Always answer in terms of benchmarks, memory/computational footprint, and developer velocity rather than subjective preference.
2. **"What happens when the model makes a critical error?"** Highlight your system's fallback mechanisms, confidence score thresholds, and graceful degradation paths.
3. **"How did you validate your claims?"** Make sure you have baseline comparisons (e.g. comparing against a traditional heuristic or naive model) rather than presenting isolated accuracy numbers.

### 3. Next Deliverable Focus
Make sure your **Software Requirements Specification (SRS)** and **System Architecture Diagram** are locked in before writing extensive code.

Let me know which specific area you would like to drill down into next!`,
    suggestedActions: [
      'Draft sample Viva Voce defense questions & answers',
      'Generate a system architecture & database schema outline',
      'Help write the Problem Statement for my report',
    ],
  };
}
