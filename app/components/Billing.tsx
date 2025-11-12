import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { useSession } from "./SessionContext";

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [monthSearch, setMonthSearch] = useState("");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [statusSearch, setStatusSearch] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);


  const [selectedMonthYear, setSelectedMonthYear] = useState<string[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const { session, setSession, clearSession } = useSession();
  const allStatuses = ["Paid", "Due", "Overdue"];


  // Function to parse MM/DD/YYYY string to Date object
  const parseDateString = (dateStr: string) => {
    if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return null;
    }
    const [month, day, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("valid_user_email");
        let response: any[] = [];

        if (localStorage.getItem("company")) {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/billingdata`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
                company: localStorage.getItem("company"),
              },
            }
          );
          response = res.data;
        } else {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/billingdata`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                authemail: `Bearer ${userEmail}`,
              },
            }
          );
          response = res.data;
        }

        const data:any = response;

        


        if (typeof data.error !== 'undefined' && data.error != null) {
          setInvoices([]);
        } else {
          const transformed = data.map((invoice: any) => ({
            number: invoice.number,
            date: invoice.date,
            amount: invoice.amount,
            status: invoice.status,
            dueDate: invoice.dueDate,
            downloadUrl: invoice.downloadUrl || "#",
          }));

          setInvoices(transformed);
        }
        const uniqueMonths = Array.from(
          new Set(
            response.map((inv: any) => getMonthName(inv.date)).filter(Boolean)
          )
        ).sort();

        setAvailableMonths(uniqueMonths);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
    
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!event.target.closest(".month-dropdown")) {
        setIsMonthDropdownOpen(false);
        setIsMonthOpen(false);
      }
      if (!event.target.closest(".status-dropdown")) {
        setIsStatusDropdownOpen(false);
        setIsStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const getStatusStyle = (status: any) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-200 text-green-800";
      case "due":
        return "bg-yellow-200 text-yellow-800";
      case "overdue":
        return "bg-red-200 text-red-800";
      default:
        return "text-gray-800";
    }
  };

  const getMonthName = (dateString: string) => {
    const date = parseDateString(dateString);
    return date ? date.toLocaleString("default", { month: "long" }) : "";
  };

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getMonthYearKey = (dateStr: string) => {
    const parsed = parseDateString(dateStr);
    if (!parsed) return "";
    const month = parsed.toLocaleString("default", { month: "short" }); // Jan, Feb, etc.
    const year = parsed.getFullYear();
    return `${month}-${year}`;
  };

  // Filter and sort data
  const filteredInvoices = useMemo(() => {
    let result = invoices.filter((invoice: any) => {
     const invoiceKey = getMonthYearKey(invoice.date);
    const matchesMonthYear =
      selectedMonthYear.length === 0 || selectedMonthYear.includes(invoiceKey);

    const matchesSearch = Object.values(invoice).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(invoice.status);

    return matchesMonthYear && matchesSearch && matchesStatus;
    });

    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "date" || sortConfig.key === "dueDate") {
          aVal = parseDateString(aVal);
          bVal = parseDateString(bVal);

          // Handle invalid dates
          if (!aVal && !bVal) return 0;
          if (!aVal) return sortConfig.direction === "asc" ? 1 : -1; // Push invalid dates to the end
          if (!bVal) return sortConfig.direction === "asc" ? -1 : 1;
        }

        
        if (sortConfig.key === "number") {
           if (!aVal) aVal = "";
            if (!bVal) bVal = "";
            return aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: 'base' }) * (sortConfig.direction === "asc" ? 1 : -1);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, invoices, selectedMonthYear, selectedStatuses, sortConfig]);

  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredInvoices.slice(start, start + rowsPerPage);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  return (
    <div className="overflow-x-auto min-h-[250px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="sm:text-2xl text-lg  font-bold text-[#190089] whitespace-nowrap mr-2 text-left">
          Billing & Invoices
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-1 mr-1 p-1 w-full sm:items-center sm:justify-end">
         
          <div className="relative inline-block">
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-4 pr-10 py-2 mt-1 mr-1 rounded-full bg-gray-100 placeholder-gray-500 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#190089] w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>
           <div className="flex flex-row gap-2 w-full sm:w-auto  sm:gap-4">
          {/* Month Filter */}
          <div className="relative inline-block flex-1">
            <div className="relative month-dropdown sm:w-auto sm:min-w-[180px] min-w-[130px]">
            <button
              className="w-full pl-4 sm:pr-8 pr-4 py-2 rounded-full bg-gray-100 text-sm text-black cursor-pointer focus:ring-2 focus:ring-[#190089] text-left"
              onClick={() => {
                setIsMonthDropdownOpen((prev) => !prev);
                setIsMonthOpen((prev)=> !prev);
              }}
            >
              {selectedMonthYear.length > 0 ? selectedMonthYear.join(", ") : "All Months"}
            </button>

            {isMonthDropdownOpen && (
              <div className="absolute z-10 mt-2 p-3 bg-white text-[rgba(0,0,0,0.5)] border rounded-xl shadow-xl sm:w-[280px] w-[250px]">
                <div className="flex justify-between items-center mb-2">
                  <button onClick={() => setCurrentYear((y) => y - 1)} className="cursor-pointer">←</button>
                  <span className="font-semibold">{currentYear}</span>
                  <button onClick={() => setCurrentYear((y) => y + 1)} className="cursor-pointer">→</button>
                </div>
                <div className="grid grid-cols-3 sm:gap-2 gap-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => {
                    const key = `${month}-${currentYear}`;
                    const isSelected = selectedMonthYear.includes(key);
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedMonthYear((prev) =>
                            isSelected ? prev.filter((m) => m !== key) : [...prev, key]
                          );
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1 text-sm text-center rounded cursor-pointer ${
                          isSelected ? "bg-[#5278c3] text-white" : "hover:bg-gray-100 text-black"
                        }`}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {isMonthOpen ? (
                // Up arrow
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.7 12.3L10 7.6l-4.7 4.7-1.4-1.4L10 4.8l6.1 6.1z" />
                </svg>
              ) : (
                // Down arrow
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.3 7.7L10 12.4l4.7-4.7 1.4 1.4L10 15.2 3.9 9.1z" />
                </svg>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative inline-block flex-1">
            <div className="relative status-dropdown w-full sm:w-auto sm:min-w-[180px] min-w-[130px]">
            <button
              className="w-full text-left pl-4 pr-8 py-2 rounded-full bg-gray-100 text-sm text-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#190089]"
              onClick={() => {
                setIsStatusDropdownOpen((prev) => !prev);
                setIsStatusOpen((prev) =>!prev)
              }}
            >
              {selectedStatuses.length > 0 ? selectedStatuses.join(", ") : "All Status"}
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-1 bg-white border rounded shadow-md w-full max-h-60 overflow-y-auto">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search status..."
                    className="w-full px-2 py-1 border rounded text-sm text-black"
                    value={statusSearch}
                    onChange={(e) => setStatusSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {(allStatuses || [])
                      .filter((status) =>
                        status.toLowerCase().includes(statusSearch.toLowerCase())
                      )
                    .map((status) => (
                      <div
                        key={status}
                        className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setSelectedStatuses((prev) =>
                            prev.includes(status)
                              ? prev.filter((s) => s !== status)
                              : [...prev, status]
                          );
                          setCurrentPage(1);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          readOnly
                        />
                        {status}
                      </div>
                    ))}
                </div>
                
              </div>
            )}
          </div>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              {isStatusOpen ? (
                // Up arrow
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M14.7 12.3L10 7.6l-4.7 4.7-1.4-1.4L10 4.8l6.1 6.1z" />
                </svg>
              ) : (
                // Down arrow
                <svg
                  className="w-4 h-4 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.3 7.7L10 12.4l4.7-4.7 1.4 1.4L10 15.2 3.9 9.1z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm sm:text-base border-separate border-spacing-y-3 sm:border-collapse">
          <thead className="text-left text-[#848A95] border-b bg-[#F9FAFB]">
            <tr>
              <th className="py-3 px-4 uppercase cursor-pointer" onClick={() => handleSort("number")}>INVOICE # {sortConfig?.key === "number" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
              <th className="py-3 px-4 uppercase cursor-pointer hidden sm:table-cell" onClick={() => handleSort("date")}>
                Date {sortConfig?.key === "date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-3 px-4 uppercase cursor-pointer sm:text-left text-right" onClick={() => handleSort("status")}>Status {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}</th>
              <th className="py-3 px-4 uppercase cursor-pointer hidden sm:table-cell" onClick={() => handleSort("dueDate")}>
                Due Date {sortConfig?.key === "dueDate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="py-3 px-4 uppercase hidden sm:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="space-y-2 sm:space-y-0">
            {paginatedInvoices.map((invoice: any, idx) => (
              <tr key={idx} className="rounded-xl shadow-md border sm:table-row sm:rounded-none sm:shadow-none sm:border-0">
                <td className="py-4 px-4 pr-0 sm:pr-4 font-semibold text-black">
                  <div>{invoice.number}</div>
                <div className="text-gray-400 sm:hidden block border-b pb-2">{invoice.date}</div>

                <div className="text-black sm:hidden block pt-2">DUE DATE</div>
                <div className="text-gray-400 sm:hidden block">{invoice.dueDate}</div>
                </td>
                <td className="py-4 px-4 text-[#848A95] hidden sm:table-cell">
                  <div>{ invoice.date}</div>
                </td>
                <td className="py-4 pl-0 pr-4 sm:pl-4">
                  <div className="border-b border-[#99a1af] sm:border-0 pb-4 pt-1 text-right sm:text-left">
                    <span className={`sm:text-sm text-lg px-6 py-1 sm:px-3 sm:py-1 rounded-full ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="sm:hidden block  pt-4 mb-2"> <a href={invoice.downloadUrl}  className="flex justify-end" target="_blank" rel="noopener noreferrer">
                    <Download className="text-[#462EFC] hover:text-[#190089] cursor-pointer mr-6" size={24} />
                  </a></div>
                </td>
                <td className="py-4 px-4 text-[#848A95] hidden sm:table-cell">
                  {invoice.dueDate}
                </td>
                <td className="py-4 px-4 hidden sm:table-cell">
                  <a href={invoice.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="text-[#462EFC] hover:text-[#190089] cursor-pointer" size={18} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
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
    </div>
  );
}