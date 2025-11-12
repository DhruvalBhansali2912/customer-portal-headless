import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { useSession } from "./SessionContext";

export default function TeamMembers() {

    interface TeamMember {
    name: string;
    avatar: string;
    position: string;
    email: string;
    phone: string;
    department: string;
    supervisor: string;
    startDate: string;
  }

  interface feedbackMem {
    name: string;
    entity_id: string;
    email: string;
    startDate: string;
    phone: string;
    department: string;
    supervisor: string;
  }

  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const rowsPerPage = 10;
  const departmentDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isOpenD, setIsOpenD] = useState(false);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);

  // Feedback code below
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackMember, setFeedbackMember] = useState<feedbackMem | null>(null);
  const [feedbackTypes, setFeedbackTypes] = useState([]);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const feedbackModalRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const { session, setSession, clearSession } = useSession();



  const parseDateString = (dateStr:any) => {
    if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return null;
    }
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        var token = localStorage.getItem("token");
        var userEmail = localStorage.getItem("valid_user_email");
        if(localStorage.getItem("company")){
          var response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/teamdata`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
                company: localStorage.getItem("company")
              },
            }
          );
        }
        else{
          var response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/teamdata`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
              },
            }
          );
        }

        const data = response.data;

        if (typeof data.error !== "undefined" && data.error !== null) {
          setMembers([]);
        } else {
          const transformed = data.map((member: any) => ({
            entity_id: member.entity_id,
            name: member.name,
            email: member.email,
            phone: member.phone,
            startDate: member.start_date,
            department: member.department,
            supervisor: member.supervisor,
            avatar: member.image,
            position: member.position,
          }));

          setMembers(transformed);
          const departments:any = Array.from(
            new Set(transformed.map((m:any) => m.department).filter((d:any) => d && d.trim() !== ""))
          ).sort();
          setAvailableDepartments([ ...departments]);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      departmentDropdownRef.current &&
      !departmentDropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpenD(false);
    }
  }

  if (isOpenD) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpenD]);


  // useEffect(() => {
  //   function handleClickOutside(event:any) {
  //     if (
  //       feedbackModalRef.current &&
  //       !feedbackModalRef.current.contains(event.target)
  //     ) {
  //       setFeedbackModalOpen(false);
  //     }
  //   }

  //   if (feedbackModalOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   } else {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [feedbackModalOpen]);

  useEffect(() => {
    const fetchFeedbackTypes = async () => {
      try {
        var token = localStorage.getItem("token");
        var userEmail = localStorage.getItem("valid_user_email");
        var response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/feedbacktypes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              authemail: `Bearer ${userEmail}`,
            },
          }
        );
        setFeedbackTypes(response.data);
      } catch (error) {
        console.error("Error fetching feedback types", error);
      }
    };

    fetchFeedbackTypes();
  }, []);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const filteredMembers = useMemo(() => {
    let sorted = [...members].filter((m:any) => {
      const matchesSearch = Object.values(m).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDepartment =
      selectedDepartments.length === 0 || selectedDepartments.includes(m.department);
    return matchesSearch && matchesDepartment;
    });

    if (sortConfig !== null) {
      sorted.sort((a, b) => {
        let aVal:any = a[sortConfig.key];
        let bVal:any = b[sortConfig.key];

        if (sortConfig.key === "startDate") { // Fixed: Changed "start_date" to "startDate"
          aVal = parseDateString(aVal);
          bVal = parseDateString(bVal);

          // Handle invalid dates
          if (!aVal && !bVal) return 0;
          if (!aVal) return sortConfig.direction === "asc" ? 1 : -1; // Push invalid dates to the end
          if (!bVal) return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [members, searchTerm, selectedDepartments, sortConfig]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredMembers.slice(start, start + rowsPerPage);
  }, [filteredMembers, currentPage]);

  const handleAddMember = async() => {
    try {
        var token = localStorage.getItem("token");
        var userEmail = localStorage.getItem("valid_user_email");
        if(localStorage.getItem("company")){
          var response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/addnewmember`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
                company: localStorage.getItem("company")
              },
            }
          );
        }
        else{
          var response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/addnewmember`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
              },
            }
          );
        }

        const data = response.data;

       if(data.success){
        var redirecturl = data.message;
        //console.log(redirecturl)
        window.location.href= redirecturl;
       }
      } catch (error) {
        console.error("Error redirecting to add new member page", error);
      } finally {
        
      }
  };


  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#462EFC] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-6">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="sm:text-2xl text-lg font-bold text-[#190089] whitespace-nowrap mr-2 text-center sm:text-left">
          Team Members
        </h2>
        <button
          onClick={handleAddMember}
          className="hover:bg-[#462EFC] text-[#462EFC] bg-white border border-[#462EFC] hover:shadow-md hover:shadow-[#462EFC]/40 font-semibold rounded-full px-2 py-1 text-xs transition duration-150 ease-in-out hover:text-white cursor-pointer block sm:hidden"
        >
          Add new member
        </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-1 mr-1 p-1 w-full sm:items-center sm:justify-end">
        <button
          onClick={handleAddMember}
          className="hover:bg-[#462EFC] text-[#462EFC] bg-white border border-[#462EFC] hover:shadow-md hover:shadow-[#462EFC]/40 font-semibold rounded-full px-6 py-2 text-sm transition duration-150 ease-in-out hover:text-white cursor-pointer hidden sm:block"
        >
          Add new member
        </button>

         <div className="relative order-1 sm:order-2">
          <input
            type="text"
            placeholder="Search Team members..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto pl-4 pr-10 py-2 rounded-full bg-gray-100 placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#190089]"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            🔍
          </span>
        </div>
            <div className="relative inline-block order-2 sm:order-1">
            <div className="relative w-auto sm:w-60 text-right sm:text-left" ref={departmentDropdownRef}>
            <button
              onClick={() => setIsOpenD(!isOpenD)}
              className="sm:w-full text-left pl-4 pr-10 py-2 rounded-full bg-gray-100 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#190089]"
            >
              {selectedDepartments.length > 0 ? selectedDepartments.join(", ") : "Select Departments"}
            </button>
            {isOpenD && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                <input
                  type="text"
                  className="w-full px-3 py-2 border-b text-sm text-black focus:outline-none"
                  placeholder="Search departments..."
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                />
                {availableDepartments
                  .filter((dept) =>
                    dept.toLowerCase().includes(departmentSearchTerm.toLowerCase())
                  )
                  .map((dept) => (
                    <label key={dept} className="flex items-center px-3 py-2 text-sm text-black cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={() =>
                          setSelectedDepartments((prev) =>
                            prev.includes(dept)
                              ? prev.filter((d) => d !== dept)
                              : [...prev, dept]
                          )
                        }
                        className="mr-2"
                      />
                      {dept}
                    </label>
                  ))}
              </div>
            )}
          </div>


            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {isOpenD ? (
                // Up arrow
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M14.7 12.3L10 7.6l-4.7 4.7-1.4-1.4L10 4.8l6.1 6.1z" />
                </svg>
              ) : (
                // Down arrow
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.3 7.7L10 12.4l4.7-4.7 1.4 1.4L10 15.2 3.9 9.1z" />
                </svg>
              )}
            </div>
          </div>

         
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm sm:text-base">
          <thead className="text-left text-[#848A95] border-b bg-[#F9FAFB]">
            <tr>
              <th className="py-2 px-3 uppercase cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortConfig?.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              {/* Hide on mobile */}
              <th className="py-2 px-3 uppercase cursor-pointer hidden sm:table-cell" onClick={() => handleSort("startDate")}>
                Start Date {sortConfig?.key === "startDate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 px-3 uppercase cursor-pointer hidden sm:table-cell" onClick={() => handleSort("department")}>
                Department {sortConfig?.key === "department" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 px-3 uppercase cursor-pointer hidden sm:table-cell" onClick={() => handleSort("supervisor")}>
                Supervisor {sortConfig?.key === "supervisor" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-2 px-3 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="text-xs sm:text-sm">
            {paginatedMembers.map((m: any, idx) => (
              <tr key={idx}>
                {/* Name always visible */}
                <td
                  className="py-3 px-3 flex items-center gap-2 cursor-pointer"
                  onClick={() => setSelectedMember(m)}
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/05/profile-portal.png`;
                    }}
                  />
                  <div>
                    <div className="font-medium text-black hover:underline">{m.name}</div>
                    <div className="text-black text-[10px] w-40 sm:w-64 break-all  sm:text-xs">{m.email}</div>
                  </div>
                </td>

                {/* Hidden on mobile */}
                <td className="py-3 px-3 text-[#848A95] hidden sm:table-cell">{m.startDate}</td>
                <td className="py-3 px-3 text-[#848A95] hidden sm:table-cell">{m.department}</td>
                <td className="py-3 px-3 text-[#848A95] hidden sm:table-cell">{m.supervisor}</td>

                {/* Actions */}
                <td className="py-3 px-3 text-[#462EFC] font-semibold cursor-pointer text-center sm:text-left">
                  {/* Mobile → 3 horizontal dots */}
                  <span
                    className="block sm:hidden text-lg font-bold"
                    onClick={() => {
                      setSelectedMember(m);
                    }}
                  >
                    ⋯
                  </span>
                  {/* Desktop → Provide Feedback */}
                  <span
                    className="hidden sm:block hover:underline"
                    onClick={() => {
                      setFeedbackMember(m || null);
                      setFeedbackModalOpen(true);
                      setRating(0);
                      setFeedbackText("");
                      setSelectedFeedbackType("");
                      setFeedbackSuccess(false);
                    }}
                  >
                    Provide Feedback
                  </span>
                </td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-[#848A95]">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-[#848A95] disabled:opacity-50 cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-[#848A95] disabled:opacity-50 cursor-pointer"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center"
          onClick={() => setSelectedMember(null)}
        >
          <div className="absolute inset-0 bg-black/[0.4] backdrop-blur-sm"></div>
          <div
            className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#190089] text-white px-4 py-2 rounded-t-md flex justify-between items-center">
              <h3 className="text-lg font-semibold">Team Member Details</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-white text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 text-[#190089]">
              <div className="flex items-center mb-4">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-full border mr-4"
                  onError={(e) => {
                    const target2 = e.target as HTMLImageElement;
                      target2.onerror = null;
                      target2.src = `${process.env.NEXT_PUBLIC_API_URL}wp-content/uploads/2025/05/profile-portal.png`;
                    }}
                />
                <div>
                  <div className="text-lg font-semibold">{selectedMember.name}</div>
                  <div className="text-sm text-[#848A95]">{selectedMember.position}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                 <div className="sm:hidden flex justify-between">
                  <div className="text-md text-black"><div className="font-semibold">Department</div><div>{selectedMember.department}</div></div>
                  <div className="text-sm cursor-pointer" onClick={() => {
                    setFeedbackMember(
                      selectedMember
                        ? {
                            name: selectedMember.name,
                            entity_id: (selectedMember as any).entity_id ?? "",
                            email: selectedMember.email,
                            startDate: selectedMember.startDate,
                            phone: selectedMember.phone,
                            department: selectedMember.department,
                            supervisor: selectedMember.supervisor,
                          }
                        : null
                    );
                    setFeedbackModalOpen(true);
                  }}>Provide feedback</div>
                </div>
                <div>📧 {selectedMember.email}</div>
                <div>📞 {selectedMember.phone || "(214) GO-RELAY / (214) 467-3529"}</div>
                <div>📂 {selectedMember.department}</div>
                <div>👤 Supervisor: {selectedMember.supervisor}</div>
                <div>📅 Start Date: {selectedMember.startDate}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {feedbackModalOpen && feedbackMember && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-black/[0.4] backdrop-blur-sm"></div>
          <div ref={feedbackModalRef } className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-md z-10">
            <div className="bg-[#190089] text-white px-4 py-2 rounded-t-md flex justify-between items-center">
              <h3 className="text-lg font-semibold">Give Feedback for {feedbackMember.name}</h3>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="text-white text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 text-[#190089] space-y-4">
              
              <div>
                <label className="block mb-1 font-medium">Rating</label>
                <div className="flex space-x-1 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={`cursor-pointer ${
                        star <= (hoveredRating || rating) ? "text-[#EFBF04]" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Your Feedback</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Please provide your feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-gray-200 px-4 py-2 rounded text-gray-700 cursor-pointer"
                  onClick={() => setFeedbackModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#462EFC] text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                  disabled={ rating === 0 || !feedbackText}
                  onClick={async () => {
                    try {
                      var token = localStorage.getItem("token");
                      var userEmail = localStorage.getItem("valid_user_email");
                      var company = localStorage.getItem("company");

                      if(company){
                        var response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/submitfeedback`,
                        {
                          entity_id: feedbackMember.entity_id.toString(),
                          feedback_type: selectedFeedbackType,
                          rating: rating.toString(),
                          feedback: feedbackText,
                          name: feedbackMember.name
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            authemail: `Bearer ${userEmail}`,
                            company: company
                          },
                        }
                      );
                      console.log(response);

                      }
                      else{
                        var response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/submitfeedback`,
                        {
                          entity_id: feedbackMember.entity_id.toString(),
                          feedback_type: selectedFeedbackType,
                          rating: rating.toString(),
                          feedback: feedbackText,
                          name: feedbackMember.name
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            authemail: `Bearer ${userEmail}`,
                          },
                        }
                      );
                      console.log(response);

                      }
                      
                      setFeedbackSuccess(true);
                      setTimeout(() => {
                        setFeedbackModalOpen(false);
                      }, 1500);
                    } catch (err) {
                      alert("Failed to submit feedback.");
                      console.error(err);
                    }
                  }}
                >
                  Submit
                </button>
              </div>
              {feedbackSuccess && (
                <div className="text-green-600 font-medium text-center mt-2">
                  ✅ Feedback submitted successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}