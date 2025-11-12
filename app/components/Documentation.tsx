import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import { useSession } from "./SessionContext";

export default function Documentation() {
  const [documents, setdocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const rowsPerPage = 10;
  const { session, setSession, clearSession } = useSession();

  useEffect(() => {
    const fetchdocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("valid_user_email");

        if(localStorage.getItem("company")){
          var response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/documentationdata`,
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
          `${process.env.NEXT_PUBLIC_API_URL}wp-json/custom/v1/documentationdata`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              authemail: `Bearer ${userEmail}`,
            },
          }
        );
        }
        

        const data = response.data;

        if (typeof data.error !== 'undefined' && data.error != null) {
          setdocuments([]);
        } else {
          const transformed = data.map((document:any) => ({
            date: document.date,
            category: document.category,
            size: document.size,
            downloadUrl: document.downloadUrl || "#",
            resource: document.resource,
          }));

          setdocuments(transformed);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchdocuments();
  }, []);


  // Filter and paginate data
 const filtereddocuments = useMemo(() => {
  let filtered = documents.filter((document) =>
    Object.values(document).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (sortConfig !== null) {
    filtered = [...filtered].sort((a:any, b:any) => {
      const { key, direction } = sortConfig;

      if (key === "date") {
        const aDate:any = new Date(a.date);
        const bDate:any = new Date(b.date);
        return direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (key === "category") {
        return direction === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }

      if (key === "resource") {
        return direction === "asc"
          ? a.resource.localeCompare(b.resource)
          : b.resource.localeCompare(a.resource);
      }

      return 0;
    });
  }

  return filtered;
}, [searchTerm, documents, sortConfig]);

const handleSort = (key: string) => {
  setSortConfig((prev) => {
    if (prev && prev.key === key) {
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    }
    return { key, direction: "asc" };
  });
};


  const paginateddocuments = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtereddocuments.slice(start, start + rowsPerPage);
  }, [filtereddocuments, currentPage]);

  const totalPages = Math.ceil(filtereddocuments.length / rowsPerPage);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="sm:text-2xl text-lg font-bold text-[#190089] whitespace-nowrap mr-2 text-left">User Guide</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-1 mr-1 p-1 w-full sm:items-center sm:justify-end">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documents..."
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
        </div>
      </div>
      <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm sm:text-base">
        <thead className="text-left text-[#848A95] border-b bg-[#F9FAFB]">
          <tr>
            <th
            className="sm:py-3 sm:px-4 px-1 py-2 uppercase cursor-pointer select-none"
            onClick={() => handleSort("category")}
          >
            ORDER FORM {sortConfig?.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
          </th>
            <th
            className="sm:py-3 sm:px-4 px-1 py-2 uppercase cursor-pointer select-none hidden sm:table-cell"
            onClick={() => handleSort("resource")}
          >RESOURCE {sortConfig?.key === "resource" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
            <th
              className="sm:py-3 sm:px-4 px-1 py-2 uppercase cursor-pointer select-none text-center sm:text-left"
              onClick={() => handleSort("date")}
            >
              Date {sortConfig?.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="sm:py-3 sm:px-4 px-1 py-2 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginateddocuments.map((document:any, idx) => (
            <tr key={idx}>
              <td className="py-4 px-4 font-semibold text-black sm:text-sm text-xs"><div>{document.category}</div><div className="text-gray-400 sm:hidden block">{document.resource}</div></td>
              <td className="py-4 px-4 text-[#848A95] hidden sm:table-cell">{document.resource}</td>
              <td className="py-4 px-4 text-[#848A95]">{document.date}</td>
              <td className="py-4 px-4">
                <a href={document.downloadUrl} target="_blank" rel="noopener noreferrer">
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
