import os
import AppKit

html_content = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1f2937;
    line-height: 1.55;
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
  .header-box {
    background-color: #f0fdf4;
    border: 1.5px solid #86efac;
    border-left: 6px solid #16a34a;
    padding: 18px 22px;
    margin-bottom: 24px;
    border-radius: 6px;
  }
  h1 {
    color: #14532d;
    font-size: 22pt;
    margin: 0 0 6px 0;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .subtitle {
    color: #374151;
    font-size: 12.5pt;
    margin: 0 0 14px 0;
    font-weight: 500;
  }
  .meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    font-size: 9.5pt;
    border-top: 1px solid #bbf7d0;
    padding-top: 8px;
  }
  .meta-table td {
    padding: 4px 8px;
    color: #4b5563;
  }
  .meta-table strong {
    color: #14532d;
  }
  h2 {
    color: #166534;
    font-size: 14pt;
    border-bottom: 2px solid #bbf7d0;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    font-weight: 700;
  }
  .overview-p {
    font-size: 10.5pt;
    color: #374151;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .scene-card {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    margin-bottom: 22px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .scene-header {
    background: #f8fafc;
    border-bottom: 1.5px solid #e2e8f0;
    padding: 10px 16px;
    font-size: 12pt;
    font-weight: 700;
    color: #0f172a;
  }
  .badge-time {
    background: #dcfce7;
    color: #166534;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 9pt;
    font-weight: 700;
    margin-left: 10px;
    border: 1px solid #86efac;
  }
  .scene-body {
    padding: 14px 16px;
  }
  .action-box {
    background: #f0f7ff;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    margin-bottom: 12px;
    font-size: 10pt;
    color: #1e3a8a;
    border-radius: 0 4px 4px 0;
  }
  .action-box strong {
    color: #1d4ed8;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 0.5px;
  }
  .voiceover-box {
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 12px 16px;
    margin-bottom: 10px;
    font-size: 10.5pt;
    color: #14532d;
    font-style: italic;
    border-radius: 0 4px 4px 0;
    line-height: 1.65;
  }
  .voiceover-box strong {
    font-style: normal;
    color: #15803d;
    text-transform: uppercase;
    font-size: 8.5pt;
    letter-spacing: 0.5px;
  }
  .talking-points {
    font-size: 9.5pt;
    color: #4b5563;
    background: #f9fafb;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px dashed #e5e7eb;
    margin-top: 8px;
  }
  .talking-points strong {
    color: #111827;
  }
  .checklist-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 14px;
    font-size: 10pt;
  }
  .checklist-table th, .checklist-table td {
    border: 1px solid #e5e7eb;
    padding: 10px 14px;
    text-align: left;
  }
  .checklist-table th {
    background-color: #f1f5f9;
    color: #1e293b;
    font-weight: 700;
  }
  .checklist-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  .footer-note {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
    font-size: 9pt;
    color: #6b7280;
    text-align: center;
  }
</style>
</head>
<body>

<div class="header-box">
  <h1>AgriHeal &mdash; Video Demonstration Script</h1>
  <div class="subtitle">Complete Product Demonstration Walkthrough & Voice-Over Guide</div>
  <table class="meta-table">
    <tr>
      <td><strong>Format:</strong> Screen Recording + Voice-Over</td>
      <td><strong>Target Duration:</strong> 4:30 Minutes</td>
      <td><strong>Platform:</strong> Progressive Web App (PWA)</td>
      <td><strong>Evaluation:</strong> MSME / Investors</td>
    </tr>
  </table>
</div>

<p class="overview-p">
  This document provides the complete scene-by-scene script, on-screen user actions, spoken voice narration, and key technical talking points for recording an impactful demonstration video of the <strong>AgriHeal</strong> platform.
</p>

<h2>Scene-by-Scene Demonstration Guide</h2>

<div class="scene-card">
  <div class="scene-header">
    Scene 1: The Hook & Indian Agricultural Crisis
    <span class="badge-time">0:00 &ndash; 0:35 (35 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Start on the AgriHeal Welcome / Splash screen showcasing the AgriHeal brand logo, clean hero imagery, and tagline. Keep the cursor steady to establish a professional visual intro.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;Every single year, Indian agriculture loses over ninety thousand crore rupees to preventable crop diseases, pest outbreaks, and unscientific farming practices. But the bigger tragedy is that eighty-six percent of our farmers are smallholders who cannot read complex, text-heavy apps in English, and thousands suffer from fatal pesticide poisoning simply because nobody taught them the right chemical dilution or safety precautions.<br><br>
      This is where <strong>AgriHeal</strong> steps in. AgriHeal is an AI-powered, voice-first precision agriculture and farmer healthcare platform that converts complex agronomic science into simple, spoken local language guidance&mdash;accessible to any farmer, on any basic smartphone, without needing expensive hardware.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Connects real national agronomic losses (ICAR statistics) with farmer health hazards, immediately positioning AgriHeal as the unified remedy.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 2: Zero-Literacy Vernacular Onboarding
    <span class="badge-time">0:35 &ndash; 1:05 (30 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Click on <strong>Language Selection</strong> (displaying Telugu, Hindi, Tamil, English). Select a regional language or English, quickly progress through <strong>Profile Setup</strong> (select crop: <em>Paddy/Cotton/Wheat</em>, enter farm size: <em>3 Acres</em>), and land smoothly on the <strong>Farmer Dashboard</strong>.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;Let's experience how a farmer uses AgriHeal.<br><br>
      Right from the start, AgriHeal breaks the digital barrier with multi-language vernacular onboarding. Whether a farmer speaks Telugu, Hindi, Tamil, or English, the entire platform instantly adapts.<br><br>
      Once the farmer logs their basic plot details&mdash;such as crop type and acreage&mdash;they are greeted by an intuitive, clutter-free dashboard designed with clear visual cards, high-contrast indicators, and zero confusing technical jargon.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Demonstrates zero-friction accessibility and rapid 30-second setup tailored for non-tech-savvy rural users.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 3: Vani Voice AI in Action
    <span class="badge-time">1:05 &ndash; 1:45 (40 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Highlight and tap the floating <strong>Vani Voice Widget</strong>. Show the active listening waveform animation. Trigger a query or ambient greeting (<em>&ldquo;Namaste! I am Vani...&rdquo;</em>), showing Vani responding with natural spoken audio and an on-screen advisory card.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;Now, meet <strong>Vani</strong>&mdash;our real-time conversational AI voice assistant.<br><br>
      A farmer standing in the middle of a muddy field cannot type queries into a search bar. With Vani, they don't have to. Powered by real-time voice activity detection and ultra-low-latency speech synthesis, the farmer simply taps the microphone and speaks naturally in their native dialect&mdash;asking questions about weather risks, yellowing leaves, or market prices.<br><br>
      Vani understands the context, reasons with agricultural intelligence, and speaks back in clear, compassionate audio. It completely eliminates the literacy barrier, turning the phone into a 24/7 personal digital agronomist.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Technical differentiation via LiveKit WebRTC, Silero Voice Activity Detection, and Cartesia Neural TTS voice synthesis.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 4: AgriShield &mdash; AI Crop Leaf Diagnostics
    <span class="badge-time">1:45 &ndash; 2:25 (40 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Navigate to <strong>Crop Management &rarr; AgriShield</strong>. Tap <strong>Upload Leaf Photo / Camera</strong>. Select a diseased leaf photo. Show the rapid analysis loader (&lt;3 seconds) and reveal the diagnostic breakdown: disease identity, severity score, biological treatments, and chemical options.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;When disease strikes a crop, delay means devastation. Here we open <strong>AgriShield</strong>, our AI computer-vision diagnostic engine.<br><br>
      The farmer simply takes a photo of an affected leaf directly with their phone camera. Within three seconds, our deep learning vision pipeline inspects the leaf tissue, identifies the specific disease&mdash;such as Leaf Blight&mdash;and calculates the severity level.<br><br>
      Notice that AgriShield doesn't just name the problem; it prioritizes eco-friendly biological remedies first, followed by scientifically validated curative measures to arrest the outbreak immediately.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Rapid Computer Vision pathology detection, instant remediation, and prioritizing organic/biological cures over synthetic chemicals.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 5: ToxiGuard &mdash; Chemical Safety & Farmer Health
    <span class="badge-time">2:25 &ndash; 3:05 (40 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Click through to <strong>ToxiGuard</strong>. Highlight the WHO Toxicity Color Band (Yellow/Blue/Green hazard rating), enter a 15-liter knapsack sprayer tank capacity in the <strong>Dilution Calculator</strong>, and showcase the required PPE gear checklist and Pre-Harvest Interval (PHI) count.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;This brings us to one of AgriHeal's most critical innovations: <strong>ToxiGuard</strong>.<br><br>
      Most commercial apps tell farmers which pesticide to buy, but none tell them how to spray safely. Over-dilution damages soil; under-dilution fails; and inhaling toxic fumes causes severe illness.<br><br>
      ToxiGuard actively protects farmer lives. It classifies the chemical into standardized WHO toxicity color bands, computes the <strong>exact milliliter-to-water dilution</strong> based on the farmer's knapsack sprayer tank size, displays mandatory PPE safety gear, and warns them about the pre-harvest withholding interval to ensure food safety for consumers.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Primary winning differentiator! Active occupational safety, PPE checklists, and precise tank dilution calculation.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 6: Precision Agriculture &mdash; SatWater & Crop Nutrition
    <span class="badge-time">3:05 &ndash; 3:45 (40 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Open <strong>SatWaterMonitor</strong> (highlight soil moisture percentage, safe status, and irrigation recommendation). Transition to <strong>Crop Nutrition / Fertilizer Calculator</strong> (select crop, show N-P-K nutrient status, and display stage-wise Urea/DAP dosage).
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;Next, AgriHeal addresses resource efficiency.<br><br>
      Here is <strong>SatWaterMonitor</strong>. By analyzing remote satellite moisture indicators and localized weather forecasts, it informs the farmer whether irrigation is needed today. This prevents over-watering, saving thousands of liters of groundwater and diesel pumping costs.<br><br>
      Alongside water, our <strong>Crop Nutrition</strong> module eliminates fertilizer guesswork. Instead of dumping random bags of Urea or DAP, the farmer selects their crop and growth stage. AgriHeal analyzes the N-P-K nutrient requirements and specifies the precise kilogram dosage needed per hectare, protecting soil biology while maximizing yield.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Satellite remote sensing indices, preventing groundwater over-extraction, and scientific stage-wise N-P-K fertilizer optimization.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 7: Farm Financial Ledger, Livestock & Schemes
    <span class="badge-time">3:45 &ndash; 4:15 (30 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Glance through <strong>CropFarmExpenses</strong> (income vs. expense ledger), <strong>Livestock Monitor</strong> (cattle health triage and vaccination calendar), and <strong>Schemes Center</strong> (government subsidy matching).
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;AgriHeal is a complete rural ecosystem:<br><br>
      &bull; The <strong>Farm Ledger</strong> lets farmers log daily seed, labor, and fertilizer expenses to forecast their final harvest profits.<br>
      &bull; The <strong>Livestock Monitor</strong> extends care to rural cattle and dairy animals with disease symptom triage and vaccination reminders.<br>
      &bull; And through our <strong>Schemes Center</strong>, farmers discover government subsidies, crop insurance schemes, and welfare benefits they are entitled to&mdash;ensuring financial security.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Complete farm operations coverage: financials, animal husbandry, and direct welfare eligibility access.
    </div>
  </div>
</div>

<div class="scene-card">
  <div class="scene-header">
    Scene 8: Technology Foundation & Closing Vision
    <span class="badge-time">4:15 &ndash; 4:45 (30 sec)</span>
  </div>
  <div class="scene-body">
    <div class="action-box">
      <strong>[SCREEN ACTION]</strong><br>
      Return to the Farmer Dashboard or present the full-screen <strong>Architecture Flowchart</strong> graphic, finishing on the AgriHeal logo with team/mentor credentials.
    </div>
    <div class="voiceover-box">
      <strong>[SPOKEN VOICE-OVER]</strong><br>
      &ldquo;Under the hood, AgriHeal is built as a zero-hardware, ultra-lightweight Progressive Web Application using React, Vite, and Tailwind on the frontend, backed by a resilient FastAPI and Supabase cloud architecture with LiveKit WebRTC audio streaming. It functions smoothly even on low-bandwidth rural 3G and 4G connections.<br><br>
      By merging instant AI vision diagnostics with life-saving chemical safety and vernacular voice AI, AgriHeal doesn't just optimize farms&mdash;it heals agricultural livelihoods and protects farmer health.<br><br>
      Thank you for watching the AgriHeal demonstration.&rdquo;
    </div>
    <div class="talking-points">
      <strong>Core Focus:</strong> Scalable cloud infrastructure, zero-hardware PWA, and a memorable, mission-driven closing statement.
    </div>
  </div>
</div>

<h2>Pre-Recording Checklist & Demo Setup</h2>
<table class="checklist-table">
  <tr>
    <th style="width: 25%;">Parameter</th>
    <th>Recommended Configuration</th>
  </tr>
  <tr>
    <td><strong>Browser Zoom</strong></td>
    <td>Set to 100% or 110% on Google Chrome / Safari for optimal text sharpness and button card padding.</td>
  </tr>
  <tr>
    <td><strong>Screen Resolution</strong></td>
    <td>1920 &times; 1080 (16:9 Full HD) or Responsive Mobile Viewport (iPhone 14 Pro / Pixel 7).</td>
  </tr>
  <tr>
    <td><strong>Demo Assets</strong></td>
    <td>Have 1 high-resolution diseased crop leaf photo on Desktop ready for instant upload into AgriShield.</td>
  </tr>
  <tr>
    <td><strong>Pacing & Audio</strong></td>
    <td>Speak with warmth, clarity, and authority. Allow screen transitions to settle for 1 second before narrating.</td>
  </tr>
</table>

<div class="footer-note">
  AgriHeal &mdash; AI-Powered Vernacular Precision Agriculture Platform &bull; Project Proposal &amp; Demonstration Guide
</div>

</body>
</html>
"""

html_data = AppKit.NSData.dataWithBytes_length_(html_content.encode('utf-8'), len(html_content.encode('utf-8')))
options = {AppKit.NSDocumentTypeDocumentAttribute: AppKit.NSHTMLTextDocumentType}
attr_str, _, error = AppKit.NSAttributedString.alloc().initWithData_options_documentAttributes_error_(html_data, options, None, None)

workspace_pdf = "/Users/myselfmourya/AgriHeal/AgriHeal_Video_Demonstration_Script.pdf"

printInfo = AppKit.NSPrintInfo.sharedPrintInfo().copy()
printInfo.setJobDisposition_(AppKit.NSPrintSaveJob)
printInfo.dictionary().setObject_forKey_(workspace_pdf, AppKit.NSPrintSavePath)
printInfo.setPaperSize_(AppKit.NSMakeSize(595.28, 841.89)) # A4 size
printInfo.setLeftMargin_(36.0)
printInfo.setRightMargin_(36.0)
printInfo.setTopMargin_(36.0)
printInfo.setBottomMargin_(36.0)
printInfo.setHorizontalPagination_(AppKit.NSFitPagination)
printInfo.setVerticalPagination_(AppKit.NSAutoPagination)

width = 595.28 - 72.0
textView = AppKit.NSTextView.alloc().initWithFrame_(AppKit.NSMakeRect(0, 0, width, 100))
textView.textStorage().setAttributedString_(attr_str)
textView.sizeToFit()

op = AppKit.NSPrintOperation.printOperationWithView_printInfo_(textView, printInfo)
op.setShowsPrintPanel_(False)
op.setShowsProgressPanel_(False)
success = op.runOperation()

if success:
    print("SUCCESS:", workspace_pdf, "Size:", os.path.getsize(workspace_pdf))
else:
    print("FAILED")
