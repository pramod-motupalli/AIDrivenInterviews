import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Client-side Resume Parser for Education & Experience
function extractEducationFromText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const educationList = [];
  
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('education') || line.includes('academic') || line.includes('credential') || line.includes('qualification')) {
      startIndex = i;
      break;
    }
  }
  
  if (startIndex === -1) return null;
  
  const degreeRegex = /(bachelor|master|b\.s\.|m\.s\.|b\.tech|m\.tech|b\.a\.|m\.a\.|ph\.d\.|diploma|degree|high\s+school|graduate)/i;
  const yearRegex = /\b(19\d{2}|20\d{2})\b/;
  
  for (let i = startIndex + 1; i < Math.min(lines.length, startIndex + 10); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.length < 30 && /(experience|skills|projects|employment|history|work|experience)/i.test(line)) {
      break;
    }
    
    const isEducationLine = degreeRegex.test(line) || line.includes('University') || line.includes('College') || line.includes('School') || line.includes('Institute');
    if (isEducationLine) {
      const degreeMatch = line.match(degreeRegex);
      let degree = degreeMatch ? degreeMatch[0] : "";
      
      if (degree) {
        degree = degree.charAt(0).toUpperCase() + degree.slice(1).toLowerCase();
        if (degree.toLowerCase() === 'b.s.' || degree.toLowerCase() === 'bs') degree = "Bachelor of Science";
        if (degree.toLowerCase() === 'm.s.' || degree.toLowerCase() === 'ms') degree = "Master of Science";
        if (degree.toLowerCase() === 'b.tech' || degree.toLowerCase() === 'btech') degree = "Bachelor of Technology";
        if (degree.toLowerCase() === 'm.tech' || degree.toLowerCase() === 'mtech') degree = "Master of Technology";
      } else {
        degree = "Degree";
      }
      
      const yearMatch = line.match(yearRegex);
      const year = yearMatch ? yearMatch[0] : "";
      
      let school = "";
      const schoolMatch = line.match(/([A-Za-z0-9\s.,]+(University|College|Institute|School))/i);
      if (schoolMatch) {
        school = schoolMatch[0].trim();
      } else {
        const parts = line.split(/[,\-|]/);
        for (const part of parts) {
          if (/(university|college|institute|school)/i.test(part)) {
            school = part.trim();
            break;
          }
        }
      }
      if (!school) {
        school = "Institution";
      }
      
      let specialization = "";
      const specMatch = line.match(/(in|major in|specialization in)\s+([A-Za-z\s]{3,30})/i);
      if (specMatch) {
        specialization = specMatch[2].trim();
      } else {
        const parts = line.split(/(in|of|—|-)/i);
        if (parts.length > 2) {
          specialization = parts[2].split(',')[0].trim();
        }
      }
      if (specialization.toLowerCase().includes('university') || specialization.toLowerCase().includes('college') || specialization.toLowerCase().includes('school')) {
        specialization = "";
      }
      
      educationList.push({
        degree,
        specialization: specialization || "General Studies",
        school,
        year
      });
    }
  }
  
  return educationList.length > 0 ? educationList : null;
}

function extractExperienceFromText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const experienceList = [];
  
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('experience') || line.includes('work history') || line.includes('employment') || line.includes('professional experience')) {
      startIndex = i;
      break;
    }
  }
  
  if (startIndex === -1) return null;
  
  let currentExp = null;
  for (let i = startIndex + 1; i < Math.min(lines.length, startIndex + 20); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.length < 30 && /(education|skills|projects|languages|certifications|hobbies)/i.test(line)) {
      break;
    }
    
    const dateRangeRegex = /(19\d{2}|20\d{2}|present|\d+\s+years?)/i;
    const isHeaderLine = line.length < 80 && (line.includes('|') || line.includes(' at ') || line.includes(',') || dateRangeRegex.test(line));
    
    if (isHeaderLine && (line.toLowerCase().includes('developer') || line.toLowerCase().includes('engineer') || line.toLowerCase().includes('manager') || line.toLowerCase().includes('lead') || line.toLowerCase().includes('intern') || line.toLowerCase().includes('analyst') || line.toLowerCase().includes('specialist') || line.toLowerCase().includes('consultant') || line.toLowerCase().includes('programmer') || line.toLowerCase().includes('designer'))) {
      if (currentExp) {
        experienceList.push(currentExp);
      }
      
      let role = line;
      let company = "Company";
      let duration = "Duration";
      
      const parts = line.split(/[|,•-]/);
      if (parts.length > 0) {
        role = parts[0].trim();
      }
      if (parts.length > 1) {
        company = parts[1].trim();
      }
      
      const durationMatch = line.match(/(20\d{2}\s*-\s*(20\d{2}|present))|(\d+\s*years?)/i);
      if (durationMatch) {
        duration = durationMatch[0].trim();
      }
      
      currentExp = {
        role,
        company,
        duration,
        description: ""
      };
    } else if (currentExp) {
      if (currentExp.description.length < 250) {
        currentExp.description += (currentExp.description ? " " : "") + line;
      }
    }
  }
  
  if (currentExp) {
    experienceList.push(currentExp);
  }
  
  return experienceList.length > 0 ? experienceList : null;
}

export default function CandidateDeepView({
  isOpen,
  onClose,
  candidate,
  jobConfig,
  onSchedule,
  onReject,
  onUpdateCandidate,
  isScheduling,
}) {
  const status = candidate?.status || "Awaiting Review";
  const scheduled = status === "Interview Pending";
  const navigate = useNavigate();

  // Email Editing State
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // AI Summary Expand/Collapse State
  const [isAiSummaryExpanded, setIsAiSummaryExpanded] = useState(false);

  if (!isOpen || !candidate) return null;

  const {
    name = "Candidate Name",
    email = "email@example.com",
    phone = "+1 (555) 000-0000",
    ats_score = 0,
    skills = [],
    resume_url = "",
  } = candidate;

  // Helper to determine the best preview URL based on file type
  const getPreviewUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('blob:')) return `${url}#toolbar=0`;
    
    // Force Google Docs viewer for all Supabase URLs to prevent auto-downloads in the iframe.
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStartEdit = () => {
    setEditedEmail(email);
    setIsEditingEmail(true);
    setEmailError("");
  };

  const handleCancelEdit = () => {
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleSaveEmail = async () => {
    if (!validateEmail(editedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSavingEmail(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (onUpdateCandidate) {
        onUpdateCandidate({ email: editedEmail });
      }
      setIsEditingEmail(false);
    } catch {
      setEmailError("Failed to save. Try again.");
    } finally {
      setIsSavingEmail(false);
    }
  };

  // Try to parse education and experience from candidate.resume_text if not explicitly set
  const parsedEducation = !candidate.education && candidate.resume_text ? extractEducationFromText(candidate.resume_text) : null;
  const parsedExperience = !candidate.experience && candidate.resume_text ? extractExperienceFromText(candidate.resume_text) : null;

  const rawEducation = candidate.education || parsedEducation || [
    {
      degree: "Bachelor of Science",
      specialization: "Computer Science",
      school: "State University",
      year: "2021",
    },
  ];

  const rawExperience = candidate.experience || parsedExperience || [
    {
      role: "Frontend Developer",
      company: "Tech Solutions Inc.",
      duration: "2 Years",
      description:
        "Developed responsive web applications using React and Tailwind CSS. Optimized performance and improved accessibility.",
    },
    {
      role: "Junior Developer",
      company: "SoftDev Co.",
      duration: "1 Year",
      description: "Assisted in building UI components and integrating APIs.",
    },
  ];

  // Map and sanitize education objects and strings
  const education = rawEducation.map(edu => {
    if (typeof edu === 'string') {
      const text = edu;
      const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
      const year = yearMatch ? yearMatch[0] : "";
      const cleanText = text.replace(/\b(19\d{2}|20\d{2})\b/, '').replace(/[()]/g, '').trim();
      let degree = cleanText;
      let specialization = "";
      let school = "";
      const schoolSplit = cleanText.split(/\s+at\s+|\s+from\s+|\s+@\s+/i);
      if (schoolSplit.length > 1) {
        school = schoolSplit[1].trim();
        degree = schoolSplit[0].trim();
      }
      const specSplit = degree.split(/\s+in\s+/i);
      if (specSplit.length > 1) {
        specialization = specSplit[1].trim();
        degree = specSplit[0].trim();
      }
      return {
        degree: degree || "Degree",
        specialization: specialization || "General Studies",
        school: school || "Institution",
        year: year
      };
    } else {
      // If it is an object but only has 'degree' field, parse it
      if (edu.degree && !edu.school && !edu.specialization) {
        const text = edu.degree;
        const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : (edu.year || "");
        const cleanText = text.replace(/\b(19\d{2}|20\d{2})\b/, '').replace(/[()]/g, '').trim();
        let degree = cleanText;
        let specialization = "";
        let school = "";
        const schoolSplit = cleanText.split(/\s+at\s+|\s+from\s+|\s+@\s+/i);
        if (schoolSplit.length > 1) {
          school = schoolSplit[1].trim();
          degree = schoolSplit[0].trim();
        }
        const specSplit = degree.split(/\s+in\s+/i);
        if (specSplit.length > 1) {
          specialization = specSplit[1].trim();
          degree = specSplit[0].trim();
        }
        return {
          degree: degree || "Degree",
          specialization: specialization || "General Studies",
          school: school || "Institution",
          year: year
        };
      }
      return {
        degree: edu.degree || "Degree",
        specialization: edu.specialization || "General Studies",
        school: edu.school || "Institution",
        year: edu.year || ""
      };
    }
  });

  // Map and sanitize experience objects and strings
  const experience = rawExperience.map(exp => {
    if (typeof exp === 'string') {
      return {
        role: exp,
        company: "Company",
        duration: "Duration",
        description: ""
      };
    }
    return {
      role: exp.role || "Role",
      company: exp.company || "Company",
      duration: exp.duration || "Duration",
      description: exp.description || ""
    };
  });

  const statusOptions = [
    {
      label: "Suitable",
      value: "Suitable",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: "check_circle",
    },
    {
      label: "Awaiting Review",
      value: "Awaiting Review",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "visibility",
    },
    {
      label: "Shortlisted",
      value: "Shortlisted",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      icon: "star",
    },
    {
      label: "Interview Pending",
      value: "Interview Pending",
      color: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "schedule",
    },
    {
      label: "Not Suitable",
      value: "Not Suitable",
      color: "bg-red-50 text-red-700 border-red-100",
      icon: "cancel",
    },
  ];

  const currentStatus =
    statusOptions.find((opt) => opt.value === status) || statusOptions[1];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-50 w-full h-full md:h-[95vh] max-w-7xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 pt-[calc(1rem+env(safe-area-inset-top))] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Candidate Pre-Screening Profile
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-6">
          
          {/* Full-width Candidate Summary Header Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* LEFT SIDE: Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 min-w-0 w-full text-center sm:text-left">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg shadow-blue-100 border-4 border-white shrink-0">
                {name ? name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase() : "C"}
              </div>
              
              {/* Info Details */}
              <div className="space-y-3 flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2.5 justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight break-words">
                    {name}
                  </h1>
                  <div className="shrink-0 flex justify-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border inline-flex items-center gap-1.5 ${currentStatus.color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {currentStatus.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-sm text-gray-500 w-full">
                  <div className="w-full min-w-0">
                    {isEditingEmail ? (
                      <div className="space-y-2 w-full max-w-md mx-auto sm:mx-0">
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <Input
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            placeholder="Candidate Email"
                            className={`h-9 text-sm px-3 py-2 rounded-lg border-gray-200 focus:ring-blue-500 w-full ${emailError ? "border-red-500" : ""}`}
                            autoFocus
                          />
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              onClick={handleSaveEmail}
                              disabled={isSavingEmail}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-9 font-bold flex-1 sm:flex-none"
                            >
                              {isSavingEmail ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="border-gray-200 text-gray-600 h-9 px-4 font-bold flex-1 sm:flex-none"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        {emailError && (
                          <p className="text-[11px] text-red-500 font-bold">
                            {emailError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-center sm:justify-start gap-2 group cursor-pointer hover:text-gray-900 transition-colors w-full min-w-0"
                        onClick={handleStartEdit}
                      >
                        <span className="material-symbols-outlined text-gray-400 text-[18px] shrink-0">
                          mail
                        </span>
                        <span className="break-all flex-1 min-w-0 text-center sm:text-left">{email}</span>
                        <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all shrink-0">
                          edit
                        </span>
                      </div>
                    )}
                  </div>

                  {!isEditingEmail && (
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-center sm:justify-start gap-x-4 gap-y-2 w-full min-w-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                        <span className="material-symbols-outlined text-gray-400 text-[18px] shrink-0">
                          call
                        </span>
                        <span className="break-words flex-1 min-w-0 text-center sm:text-left">{phone}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                        <span className="material-symbols-outlined text-gray-400 text-[18px] shrink-0">
                          work
                        </span>
                        <span className="break-words flex-1 min-w-0 text-center sm:text-left">{jobConfig?.title || "Applied Role"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CENTER: JD Match Score circular progress/ring */}
            <div className="flex flex-col items-center justify-center gap-2 shrink-0 w-full lg:w-auto py-2 border-y border-gray-100 lg:border-none">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                JD Match Score
              </span>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - ats_score / 100)}`}
                    className="text-emerald-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {ats_score}%
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                    Match
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 w-full lg:w-[380px] xl:w-[440px] shrink-0">
              <Button
                onClick={onSchedule}
                disabled={scheduled || isScheduling}
                className={`w-full font-bold h-10 rounded-xl flex items-center justify-center gap-2 transition-all px-3 text-xs sm:text-sm ${
                  scheduled 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100/50'
                }`}
              >
                {isScheduling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    Sending Invite...
                  </>
                ) : scheduled ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Invite Sent
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    Schedule Interview
                  </>
                )}
              </Button>

              <Button
                onClick={() => navigate(`/live-monitoring/${candidate.session_token || candidate.id}`, { state: { candidate } })}
                className="w-full bg-indigo-50 border border-indigo-150 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-850 font-bold h-10 rounded-xl flex items-center justify-center gap-2 px-3 text-xs sm:text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  visibility
                </span>
                Monitor Live Session
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(resume_url, "_blank")}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-850 font-bold h-10 rounded-xl flex items-center justify-center gap-2 px-3 text-xs sm:text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
                Download Resume
              </Button>

              <Button
                variant="outline"
                onClick={onReject}
                className="w-full bg-red-50 border border-red-150 text-red-700 hover:bg-red-100 hover:text-red-800 font-bold h-10 rounded-xl flex items-center justify-center gap-2 px-3 text-xs sm:text-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">
                  person_remove
                </span>
                Reject Candidate
              </Button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Resume Preview & AI Screening Summary */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Resume Preview */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[380px] sm:h-[480px] md:h-[650px] relative">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">
                      description
                    </span>
                    Resume Preview
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(resume_url || candidate.local_resume_url, "_blank")}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                      title="Open in new tab"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        open_in_new
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50/50 p-4 sm:p-6 flex justify-center items-stretch overflow-hidden">
                  {resume_url || candidate.local_resume_url ? (
                    <iframe
                      src={getPreviewUrl(resume_url || candidate.local_resume_url)}
                      className="w-full h-full rounded-xl border border-gray-200/60 shadow-md max-w-3xl bg-white"
                      title="Resume Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 py-12">
                      <span className="material-symbols-outlined text-6xl mb-2 text-gray-300">
                        find_in_page
                      </span>
                      <p className="text-sm font-medium">Resume preview not available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Screening Summary */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <span className="material-symbols-outlined text-8xl text-indigo-900">
                    auto_awesome
                  </span>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100">
                      <span className="material-symbols-outlined text-[18px]">
                        auto_awesome
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      AI Screening Summary
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-100/60 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                      Confidence: High
                    </span>
                    <button
                      onClick={() => setIsAiSummaryExpanded(!isAiSummaryExpanded)}
                      className="p-1.5 hover:bg-indigo-100/80 rounded-lg text-indigo-600 transition-colors flex items-center justify-center border border-indigo-100"
                      title={isAiSummaryExpanded ? "Collapse Details" : "Expand Details"}
                    >
                      <span className={`material-symbols-outlined transform transition-transform duration-200 ${isAiSummaryExpanded ? "rotate-180" : ""}`}>
                        keyboard_arrow_down
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    JD Match Explanation
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-normal">
                    Sarah has strong experience in frontend development with
                    React and TypeScript. Resume shows consistent career growth
                    and relevant skills match the job requirements exceptionally
                    well.
                  </p>
                </div>

                {/* Collapsible Section for Strengths and Concerns */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-4 border-t border-indigo-100/50 transition-all duration-300 ${isAiSummaryExpanded ? "opacity-100 visible h-auto" : "opacity-0 invisible h-0 overflow-hidden"}`}>
                  {/* Strengths */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-emerald-500 text-[18px]">
                        check_circle
                      </span>
                      <span className="font-bold text-[10px] uppercase tracking-wider">
                        Strengths
                      </span>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        Strong React and TypeScript expertise
                      </li>
                      <li className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        Good experience in building scalable web apps
                      </li>
                      <li className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        Great match with required skills
                      </li>
                    </ul>
                  </div>

                  {/* Concerns */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-800">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">
                        warning
                      </span>
                      <span className="font-bold text-[10px] uppercase tracking-wider">
                        Potential Concerns
                      </span>
                    </div>
                    <ul className="space-y-2 ml-7">
                      <li className="text-xs text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        Limited backend development experience
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Skills, Experience, Education */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Technical Skills Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-[20px]">
                    psychology
                  </span>
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-100/80 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-default"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No skills identified
                    </p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-[20px]">
                    history_edu
                  </span>
                  Experience
                </h3>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 pb-2 last:pb-0 group"
                    >
                      {idx !== experience.length - 1 && (
                        <div className="absolute left-[3px] top-4 bottom-0 w-px bg-gray-100 group-hover:bg-blue-100 transition-colors"></div>
                      )}
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50 shadow-sm transition-transform group-hover:scale-110"></div>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight">
                            {exp.role}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-[12px] font-semibold text-blue-600">
                          {exp.company}
                        </p>
                        <p className="text-[12px] text-gray-500 leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 text-[20px]">
                    school
                  </span>
                  Education
                </h3>
                <div className="space-y-3.5">
                  {education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight">
                          {edu.degree}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400 shrink-0">
                          {edu.year}
                        </span>
                      </div>
                      {edu.specialization && (
                        <p className="text-[11px] font-medium text-gray-500">
                          Specialization: {edu.specialization}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-blue-600">
                        {edu.school}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
