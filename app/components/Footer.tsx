import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";
import { MdOutlinePhone, MdOutlineEmail } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const VITE_WEB_URL = "https://www.relayhumancloud.com"

export default function Footer() {

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index: any) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleFooterNavigate = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0A0057] text-white pt-5 pb-2">
      <div className="footer-section">
        {/* Column 1 */}
        <div className="footer-column">
          <button
            className="footer-accordion-header md:cursor-default"
            onClick={() => toggleSection(1)}
          >
            <h3 className="font-semibold text-[#b6bef1] text-left">Available Talent</h3>

            {/* Icons shown only on mobile */}
            <span className="footer-accordion-icon md:hidden">
              {openSection === 1 ? <FaMinus /> : <FaPlus />}
            </span>
          </button>
          {/* Content wrapper */}
          <ul
            className={`footer-accordion-content ${
              openSection === 1 ? "open" : ""
            } space-y-2 text-sm text-left`}
          >
            <li><Link href={`${VITE_WEB_URL}/talent`} onClick={handleFooterNavigate} className="hover:underline">View All Talent</Link></li>
          </ul>
        </div>

        <div className="footer-line-mobile">
          <hr />
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <button
            className="footer-accordion-header md:cursor-default"
            onClick={() => toggleSection(2)}
          >
            <h3 className="font-semibold text-[#b6bef1] text-left">Solutions</h3>

            {/* Icons shown only on mobile */}
            <span className="footer-accordion-icon md:hidden">
              {openSection === 2 ? <FaMinus /> : <FaPlus />}
            </span>
          </button>
          {/* Content wrapper */}
          <ul
            className={`footer-accordion-content ${
              openSection === 2 ? "open" : ""
            } space-y-2 text-sm text-left`}
          >
            <li><Link href={`${VITE_WEB_URL}/talent/`} onClick={handleFooterNavigate} className="hover:underline">Dedicated Talent in a Relay Office</Link></li>
            <li><Link href={`${VITE_WEB_URL}/opening-your-overseas-office/`} onClick={handleFooterNavigate} className="hover:underline">Setting Up Your Overseas Office</Link></li>
            <li><Link href={`${VITE_WEB_URL}/global-teams-consulting/`} onClick={handleFooterNavigate} className="hover:underline">Consulting & Change Management</Link></li>
            <li><Link href={`${VITE_WEB_URL}/international-payroll-service/`} onClick={handleFooterNavigate} className="hover:underline">International Payroll Service</Link></li>
            {/* <li><Link href="/virtual-assistant/" onClick={handleFooterNavigate} className="hover:underline">Virtual Assistant</Link></li> */}
            {/* <li><Link href="/lead-generation/" onClick={handleFooterNavigate} className="hover:underline">Lead Generation</Link></li> */}
            {/* <li><Link href="/relay-workflow/" onClick={handleFooterNavigate} className="hover:underline">Relay Workflow</Link></li> */}
          </ul>
        </div>

        <div className="footer-line-mobile">
          <hr />
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <button
            className="footer-accordion-header md:cursor-default"
            onClick={() => toggleSection(3)}
          >
            <h3 className="font-semibold text-[#b6bef1] text-left">Area of Expertise</h3>

            {/* Icons shown only on mobile */}
            <span className="footer-accordion-icon md:hidden">
              {openSection === 3 ? <FaMinus /> : <FaPlus />}
            </span>
          </button>
          {/* Content wrapper */}
          <ul
            className={`footer-accordion-content ${
              openSection === 3 ? "open" : ""
            } space-y-2 text-sm text-left`}
          >
            <li><Link href={`${VITE_WEB_URL}/accounting/`} onClick={handleFooterNavigate} className="hover:underline">Accounting</Link></li>
            <li><Link href={`${VITE_WEB_URL}/ai/`} onClick={handleFooterNavigate} className="hover:underline">AI & Automation</Link></li>
            <li><Link href={`${VITE_WEB_URL}/commercial-real-estate/`} onClick={handleFooterNavigate} className="hover:underline">Commercial Real Estate</Link></li>
            <li><Link href={`${VITE_WEB_URL}/yardi-accounting/`} onClick={handleFooterNavigate} className="hover:underline">Yardi</Link></li>
            <li><Link href={`${VITE_WEB_URL}/media-and-communications/`} onClick={handleFooterNavigate} className="hover:underline">Media and Communications</Link></li>
            <li><Link href={`${VITE_WEB_URL}/professional-services/`} onClick={handleFooterNavigate} className="hover:underline">Professional Services</Link></li>
            <li><Link href={`${VITE_WEB_URL}/retail/`} onClick={handleFooterNavigate} className="hover:underline">Retail</Link></li>
            <li><Link href={`${VITE_WEB_URL}/technology/`} onClick={handleFooterNavigate} className="hover:underline">Technology</Link></li>
            <li><Link href={`${VITE_WEB_URL}/government/`} onClick={handleFooterNavigate} className="hover:underline">Government</Link></li>
            <li><Link href={`${VITE_WEB_URL}/other-industries/`} onClick={handleFooterNavigate} className="hover:underline">Other Industries</Link></li>
          </ul>
        </div>

        <div className="footer-line-mobile">
          <hr />
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <button
            className="footer-accordion-header md:cursor-default"
            onClick={() => toggleSection(4)}
          >
            <h3 className="font-semibold text-[#b6bef1] text-left">About Relay</h3>

            {/* Icons shown only on mobile */}
            <span className="footer-accordion-icon md:hidden">
              {openSection === 4 ? <FaMinus /> : <FaPlus />}
            </span>
          </button>
          {/* Content wrapper */}
          <ul
            className={`footer-accordion-content ${
              openSection === 4 ? "open" : ""
            } space-y-2 text-sm text-left`}
          >
            <li><Link href={`${VITE_WEB_URL}/about/`}onClick={handleFooterNavigate} className="hover:underline">About Us</Link></li>
            <li><Link href={`${VITE_WEB_URL}/how-it-works/`} onClick={handleFooterNavigate} className="hover:underline">How It Works</Link></li>
            <li><Link href={`${VITE_WEB_URL}/our-offices/`} onClick={handleFooterNavigate} className="hover:underline">Our Offices</Link></li>
            <li><Link href={`${VITE_WEB_URL}/about#leadership`} className="hover:underline">Leadership Team</Link></li>
            <li><Link href={`${VITE_WEB_URL}/careers/`} onClick={handleFooterNavigate} className="hover:underline">Careers</Link></li>
          </ul>
        </div>

        <div className="footer-line-mobile">
          <hr />
        </div>

        {/* Column 5 */}
        <div className="footer-column">
          <button
            className="footer-accordion-header md:cursor-default"
            onClick={() => toggleSection(5)}
          >
            <h3 className="font-semibold text-[#b6bef1] text-left">Resources</h3>

            {/* Icons shown only on mobile */}
            <span className="footer-accordion-icon md:hidden">
              {openSection === 5 ? <FaMinus /> : <FaPlus />}
            </span>
          </button>
          {/* Content wrapper */}
          <ul
            className={`footer-accordion-content ${
              openSection === 5 ? "open" : ""
            } space-y-2 text-sm text-left`}
          >
            <li><Link href={`${VITE_WEB_URL}/events/`} onClick={handleFooterNavigate} className="hover:underline">Events</Link></li>
            <li><Link href={`${VITE_WEB_URL}/resource-center/`} onClick={handleFooterNavigate} className="hover:underline">Resource Center</Link></li>
            <li><Link href="https://customer.relayhumancloud.com/" className="hover:underline">Customer Portal</Link></li>
            <li><Link href="https://partner.relayhumancloud.com/" className="hover:underline">Partner Resources</Link></li>
            <li><Link href={`${VITE_WEB_URL}/partners/`} onClick={handleFooterNavigate} className="hover:underline">Partner Program</Link></li>
            <li><Link href={`${VITE_WEB_URL}/job-descriptions/`} onClick={handleFooterNavigate} className="hover:underline">Job Descriptions</Link></li>
            <li><Link href={`${VITE_WEB_URL}/job-description-generator/`} onClick={handleFooterNavigate} className="hover:underline">Job Description Generator</Link></li>
            <li><Link href={`${VITE_WEB_URL}/faq-data/`} onClick={handleFooterNavigate} className="hover:underline">FAQ</Link></li>
            <li><Link href={`${VITE_WEB_URL}/blog/`} onClick={handleFooterNavigate} className="hover:underline">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-line-mobile">
          <hr />
        </div>

        {/* Column 6 */}
        <div className="footer-desktop">
          {/* Logo + CTA */}
          <div className="flex flex-col gap-4 md:items-end mb-4">
            
            <img
              src={`${VITE_WEB_URL}/wp-content/uploads/2025/06/log-relay-white.png`}
              alt="Logo"
            />
            <Link href={`${VITE_WEB_URL}/schedule-a-call`}>
              <button className="bg-[#3333ff] cursor-pointer px-4 py-2 rounded-full text-sm font-medium hover:bg-[#5248d6] transition">
                Schedule a Call
              </button>
            </Link>
          </div>

          {/* Socials */}
          <div className="flex space-x-3 space-y-2 text-xl mb-4">
            <Link href="https://x.com/relayhumancloud" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="https://www.facebook.com/RelayHumanCloud1/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="https://www.linkedin.com/company/relayhumancloud/" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="https://www.youtube.com/channel/UCSur5TFAU__2xFjigHlY_9A" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="https://www.instagram.com/relayhumancloud/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="tel:+12144673529">
              <MdOutlinePhone className="hover:text-gray-300 cursor-pointer" />
            </Link>
            <Link href="mailto:info@relayhumancloud.com">
              <MdOutlineEmail className="hover:text-gray-300 cursor-pointer" />
            </Link>
          </div>

          {/* SOC2 Badge */}
          <div className="flex items-end w-32">
            <img src={`${VITE_WEB_URL}/wp-content/uploads/2025/06/soc-image.png`} alt="SOC 2 Type 1" className="h-12" />
          </div>
          <div className="flex items-end w-[50px] pt-4">
            <img src={`${VITE_WEB_URL}/wp-content/uploads/2026/03/Certification-Badge-DEC-2025-2026_1-small-100x140.png`} width={88} height={140} alt="Great Place to work Icon" className="h-[80px]" />
          </div>
        </div>


        {/* Column 6 - Mobile*/}
        <div className="footer-mobile-wrap">

          <div className="flex flex-col items-left text-left">
            {/* Schedule a Call */}
            <div className="footer-mobile-cta">
              <Link href={`${VITE_WEB_URL}/schedule-a-call`} onClick={handleFooterNavigate}>
                <button className="footer-cta-btn">
                  Schedule a Call
                </button>
              </Link>
            </div>

            {/* SOC2 + Relay Logo side-by-side */}
            <div className="footer-mobile-logo-row">
              <img
                src={`${VITE_WEB_URL}/wp-content/uploads/2025/06/soc-image.png`}
                alt="SOC2 Badge"
                className="footer-soc2-img mb-2"
              />
              <img src={`${VITE_WEB_URL}/wp-content/uploads/2026/03/Certification-Badge-DEC-2025-2026_1-small-100x140.png`} width={88} height={140} alt="Great Place to work Icon" className="h-[80px] w-[50px]" />
            </div>

            {/* Social Icons */}
            <div className="footer-social-row">
              <Link href="https://x.com/relayhumancloud" target="_blank" rel="noopener noreferrer">
                <FaXTwitter className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="https://www.facebook.com/RelayHumanCloud1/" target="_blank" rel="noopener noreferrer">
                <FaFacebookF className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="https://www.linkedin.com/company/relayhumancloud/" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="https://www.youtube.com/channel/UCSur5TFAU__2xFjigHlY_9A" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="https://www.instagram.com/relayhumancloud/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="tel:+12144673529">
                <MdOutlinePhone className="hover:text-gray-300 cursor-pointer" />
              </Link>
              <Link href="mailto:info@relayhumancloud.com">
                <MdOutlineEmail className="hover:text-gray-300 cursor-pointer" />
              </Link>
            </div>
          </div>
          <div className="flex items-center h-full">
            <img
              src={`${VITE_WEB_URL}/wp-content/uploads/2025/06/log-relay-white.png`}
              alt="Logo"
              className="-mt-16"
            />
          </div>
        </div>

      </div>
      <div className="footer-line mt-6">
        <hr />
      </div>
      {/* Legal Links */}
      <div className="tnc-desktop">
        <p className="text-[#d5d5ff]">© 2026 Relay Human Cloud. All Rights Reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href={`${VITE_WEB_URL}/privacy-policy/`} onClick={handleFooterNavigate} className="hover:underline">Privacy Policy</Link>
          <Link href={`${VITE_WEB_URL}/cookie-policy/`} onClick={handleFooterNavigate} className="hover:underline">Cookie Settings</Link>
          <Link href={`${VITE_WEB_URL}/onlineterms/`} onClick={handleFooterNavigate} className="hover:underline">Terms & Conditions</Link>
          <Link href={`${VITE_WEB_URL}/onlineterms-uk/`} onClick={handleFooterNavigate} className="hover:underline">Terms and Conditions (UK)</Link>
          <Link href={`${VITE_WEB_URL}/software-online-terms/`} onClick={handleFooterNavigate} className="hover:underline">Software Terms & Conditions</Link>
          <Link href={`${VITE_WEB_URL}/accessibility/`} onClick={handleFooterNavigate} className="hover:underline">Accessibility</Link>
        </div>
      </div>

      {/* Legal Links - Mobile */}
      <div className="tnc-mobile">
        <div className="flex flex-wrap gap-4 w-full">
          <Link href={`${VITE_WEB_URL}/privacy-policy/`} onClick={handleFooterNavigate} className="hover:underline">Privacy Policy</Link>
          <Link href={`${VITE_WEB_URL}/cookie-policy/`} onClick={handleFooterNavigate} className="hover:underline">Cookie Settings</Link>
          <Link href={`${VITE_WEB_URL}/onlineterms/`} onClick={handleFooterNavigate} className="hover:underline">Terms & Conditions</Link>
          <Link href={`${VITE_WEB_URL}/onlineterms-uk/`} onClick={handleFooterNavigate} className="hover:underline">Terms and Conditions (UK)</Link>
          <Link href={`${VITE_WEB_URL}/software-online-terms/`} onClick={handleFooterNavigate} className="hover:underline">Software Terms & Conditions</Link>
          <Link href={`${VITE_WEB_URL}/accessibility/`} onClick={handleFooterNavigate} className="hover:underline">Accessibility</Link>
        </div>
        <p>© 2026 Relay Human Cloud. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
