// RATES: taken from your FEE_STRUCTURE_ESTIMATION.xlsx file.
// To change a price, edit the number after "rate". type: sqft = per sq.ft, percent = % of project cost, visit = per site visit, course = per course.
var GST_RATE = 0.18;   // 18% GST, as in the INVOICE sheet
var APPOINTMENT = {"name": "CONSULTATION APPOINTMENT", "detail": "One appointment with AAECPL engineers to discuss your project", "unit": "one-time fee"};
// Appointment fee depends on how the client meets us. It is charged ONCE per estimate.
var APPOINTMENT_FEES = {"Phone call": 0, "Online meeting": 250, "At AAECPL office": 500};
// How "% of project cost" services are calculated:
//   area-fees    = on the subtotal of the area-based (per sq.ft) fees the client selected (Building)
//   project-cost = on the project cost the client types in (Water and Waste Water, Education)
var PERCENT_BASIS = {"building": "area-fees", "water": "project-cost", "education": "project-cost"};
var RATES = {
 "building": [
  {
   "name": "ARCHITECTURAL PLANNING & DESIGN",
   "detail": "Concept design, space planning, floor plans, elevations, sections",
   "type": "sqft",
   "rate": 15,
   "rateText": "₹15 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "STRUCTURAL DESIGN CONSULTANCY",
   "detail": "Structural analysis, RCC/steel design, structural drawings",
   "type": "sqft",
   "rate": 20,
   "rateText": "₹20 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "MEP CONSULTANCY",
   "detail": "Electrical, plumbing, fire-fighting & HVAC system design",
   "type": "sqft",
   "rate": 20,
   "rateText": "₹20 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "DETAILED PROJECT REPORT (DPR)",
   "detail": "Complete DPR including drawings, estimates, specifications & reports",
   "type": "percent",
   "rate": 0.85,
   "rateText": "0.85% – 1.0% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "PROJECT MANAGEMENT CONSULTANCY (PMC)",
   "detail": "Project planning, monitoring, quality & cost control",
   "type": "percent",
   "rate": 3,
   "rateText": "3% – 5% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "SITE SUPERVISION / QUALITY CONTROL",
   "detail": "Regular/periodic site visits and quality checks",
   "type": "visit",
   "rate": 1500,
   "rateText": "₹1,500 – ₹4,000 per visit (Based on Location)",
   "unit": "per visit (Based on Location)",
   "remark": "Rate will be applied based on city."
  },
  {
   "name": "WORKING / CONSTRUCTION DRAWINGS",
   "detail": "Detailed drawings for execution (civil & MEP)",
   "type": "sqft",
   "rate": 15,
   "rateText": "₹15 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "COST ESTIMATION & BOQ",
   "detail": "Detailed quantity take-off & cost estimates as per DSR/SOR",
   "type": "percent",
   "rate": 0.5,
   "rateText": "0.5% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "TENDER DOCUMENTATION",
   "detail": "Preparation of BOQ, specifications, tender drawings & documents",
   "type": "percent",
   "rate": 1,
   "rateText": "1.0% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "APPROVAL & LIAISON SERVICES",
   "detail": "Building plan approvals & coordination with authorities",
   "type": "sqft",
   "rate": 20,
   "rateText": "₹20 per sq.ft / lump sum",
   "unit": "per sq.ft / lump sum"
  },
  {
   "name": "3D VISUALIZATION & MODEL",
   "detail": "3D renders, views and walkthrough animations",
   "type": "sqft",
   "rate": 15,
   "rateText": "₹15 per sq.ft per floor",
   "unit": "per sq.ft per floor"
  }
 ],
 "water": [
  {
   "name": "DETAILED PROJECT REPORT (DPR)",
   "detail": "Complete DPR including drawings, estimates, specifications & reports",
   "type": "percent",
   "rate": 0.85,
   "rateText": "0.85% – 1.0% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "STRUCTURAL DESIGN CONSULTANCY",
   "detail": "Structural analysis, RCC/steel design, structural drawings",
   "type": "sqft",
   "rate": 20,
   "rateText": "₹20 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "PROJECT MANAGEMENT CONSULTANCY (PMC)",
   "detail": "Project planning, monitoring, quality & cost control",
   "type": "percent",
   "rate": 3,
   "rateText": "3% – 5% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "SITE SUPERVISION / QUALITY CONTROL",
   "detail": "Regular/periodic site visits and quality checks",
   "type": "visit",
   "rate": 1500,
   "rateText": "₹1,500 – ₹4,000 per visit (Based on Location)",
   "unit": "per visit (Based on Location)"
  },
  {
   "name": "WORKING / CONSTRUCTION DRAWINGS",
   "detail": "Detailed drawings for execution (civil & MEP)",
   "type": "sqft",
   "rate": 15,
   "rateText": "₹15 per sq.ft",
   "unit": "per sq.ft"
  },
  {
   "name": "COST ESTIMATION & BOQ",
   "detail": "Detailed quantity take-off & cost estimates as per DSR/SOR",
   "type": "percent",
   "rate": 0.5,
   "rateText": "0.5% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "TENDER DOCUMENTATION",
   "detail": "Preparation of BOQ, specifications, tender drawings & documents",
   "type": "percent",
   "rate": 1,
   "rateText": "1.0% of project cost",
   "unit": "% of project cost"
  },
  {
   "name": "APPROVAL & LIAISON SERVICES",
   "detail": "Building plan approvals & coordination with authorities",
   "type": "sqft",
   "rate": 20,
   "rateText": "₹20 per sq.ft / lump sum",
   "unit": "per sq.ft / lump sum"
  }
 ],
 "education": [
  {
   "name": "AUTOCAD",
   "detail": "2D drafting, architectural & civil drawings, layers, dimensions, blocks, plotting, practical project work",
   "type": "course",
   "rate": 8000,
   "rateText": "₹8,000 per Course",
   "unit": "course"
  },
  {
   "name": "STAAD PRO",
   "detail": "Structural modelling, loading, analysis, design, RCC/steel structures and practical project",
   "type": "course",
   "rate": 12500,
   "rateText": "₹12,500 per Course",
   "unit": "course"
  },
  {
   "name": "RCDC",
   "detail": "RCC structural design, beam, column, slab, footing design, detailing and practical application",
   "type": "course",
   "rate": 10000,
   "rateText": "₹10,000 per Course",
   "unit": "course"
  },
  {
   "name": "SKETCHUP",
   "detail": "3D modelling, architectural visualization, building modelling, materials, scenes and rendering basics",
   "type": "course",
   "rate": 8000,
   "rateText": "₹8,000 per Course",
   "unit": "course"
  },
  {
   "name": "MS EXCEL – CIVIL ESTIMATION",
   "detail": "Advanced Excel for quantity calculation, BOQ, rate analysis, BBS, estimation and CPWD DSR-based estimates",
   "type": "course",
   "rate": 12500,
   "rateText": "₹12,500 per Course",
   "unit": "course"
  },
  {
   "name": "WATERGEMS",
   "detail": "Water-supply network modelling, pipe network analysis, demand allocation, hydraulic analysis and design",
   "type": "course",
   "rate": 30000,
   "rateText": "₹30,000 per Course",
   "unit": "course"
  },
  {
   "name": "SEWERGEMS",
   "detail": "Sewer network modelling, hydraulic analysis, pipe sizing, profiles, manholes and network design",
   "type": "course",
   "rate": 30000,
   "rateText": "₹30,000 per Course",
   "unit": "course"
  },
  {
   "name": "CIVIL ENGINEERING ACADEMIC COURSE",
   "detail": "Academic support for Civil Engineering subjects, numerical problems, design concepts, drawings and practical applications",
   "type": "course",
   "rate": 50000,
   "rateText": "₹50,000 per Course",
   "unit": "course"
  },
  {
   "name": "CIVIL ENGINEERING ACADEMIC COURSE NOTES",
   "detail": "Subject-wise notes, solved numerical problems, design formulas, important questions and reference material",
   "type": "course",
   "rate": 5000,
   "rateText": "₹5,000 per Complete Set",
   "unit": "complete set"
  }
 ]
};
