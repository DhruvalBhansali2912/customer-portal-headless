// Footer.tsx
import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    if (window.innerWidth <= 500) {
      document.querySelectorAll(".collapsible-footer").forEach((col) => {
        const heading = col.querySelector(".collapsible-heading") as HTMLElement;
        const linksWrapper = col.querySelector(".collapsible-links") as HTMLElement;

        heading?.addEventListener("click", () => {
          heading.classList.toggle("active");
          linksWrapper.classList.toggle("active");
          linksWrapper.classList.toggle("max-h-0");
        });
      });
    }
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#141464] to-[#5C7CB8] text-white px-5 py-8 font-['Plus_Jakarta_Sans'] leading-relaxed z-10">
      <div className="sm:px-6 mx-auto">
        <div className="flex flex-wrap gap-2 justify-between items-start">
          {/* Column Group */}
          {[
            {
              heading: "Available Now Talent",
              links: [{ text: "View All Talent", href: "https://www.relayhumancloud.com/talent" }],
            },
            {
              heading: "Solutions",
              links: [
                { text: "Dedicated Talent in a Relay Office", href: "https://www.relayhumancloud.com/talent" },
                { text: "Setting Up Your Overseas Office", href: "https://www.relayhumancloud.com/opening-your-overseas-office" },
                { text: "Consulting & Change Management", href: "https://www.relayhumancloud.com/global-teams-consulting" },
                { text: "International Payroll Service", href: "https://www.relayhumancloud.com/international-payroll-service" },
              ],
            },
            {
              heading: "Areas of Expertise",
              links: [
                { text: "Accounting", href: "https://www.relayhumancloud.com/accounting" },
                { text: "Commercial Real Estate", href: "https://www.relayhumancloud.com/commercial-real-estate" },
                { text: "Sales & Marketing", href: "https://www.relayhumancloud.com#" },
                { text: "Professional Services", href: "https://www.relayhumancloud.com/professional-services" },
                { text: "Retail", href: "https://www.relayhumancloud.com/retail" },
                { text: "Technology", href: "https://www.relayhumancloud.com/technology" },
                { text: "Government", href: "https://www.relayhumancloud.com/government" },
              ],
            },
            {
              heading: "About Relay",
              links: [
                { text: "How It Works", href: "https://www.relayhumancloud.com/how-it-works" },
                { text: "Company", href: "https://www.relayhumancloud.com/about" },
                { text: "Our Offices", href: "https://www.relayhumancloud.com/our-offices" },
                { text: "Leadership Team", href: "https://www.relayhumancloud.com/about/#team" },
                { text: "Careers", href: "https://www.relayhumancloud.com/careers" },
              ],
            },
            {
              heading: "Resources",
              links: [
                { text: "Resource Center", href: "https://www.relayhumancloud.com/resource-center" },
                { text: "Customer Portal", href: "https://www.relayhumancloud.com/customer-portal" },
                { text: "Partner Resources", href: "https://www.relayhumancloud.com/partner-resources" },
                { text: "Partner Program", href: "https://www.relayhumancloud.com/partners" },
                { text: "Job Descriptions", href: "https://www.relayhumancloud.com/job-descriptions" },
                { text: "FAQ", href: "https://www.relayhumancloud.com/faq-data" },
                { text: "Blog", href: "https://www.relayhumancloud.com/blog" },
              ],
            },
          ].map(({ heading, links }, i) => (
            <div key={i} className="min-w-[160px] sm:max-w-[230px] collapsible-footer w-full sm:w-auto">
              <h4 className="text-[14px] font-semibold text-[#c3bdf1] mb-3 sm:cursor-default cursor-pointer collapsible-heading relative sm:after:hidden after:content-['+'] after:absolute after:right-0 after:text-lg after:transition-transform sm:after:content-none [&.active]:after:content-['-']">
                {heading}
              </h4>
              <div className="collapsible-links max-h-0 overflow-hidden transition-all duration-300 sm:max-h-full sm:overflow-visible">
                {links.map(({ text, href }, j) => (
                  <a
                    key={j}
                    href={href}
                    className="block text-[14px] text-white mb-2 hover:underline"
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Logo and Social */}
          <div className="sm:max-w-[240px] w-full flex flex-col gap-4 mt-4 sm:mt-0 sm:items-end items-center text-center sm:text-right order-last sm:order-none">

            <img
              src="https://www.relayhumancloud.com/wp-content/uploads/2025/06/log-relay-white.png"
              alt="Relay Human Cloud"
              className="max-w-[160px] h-auto order-3 sm:order-none self-end sm:self-auto sm:mt-0 mt-[-60px]"
            />

            <a
            className="bg-[#3333ff] text-white px-5 py-2 text-sm rounded-full font-semibold hover:bg-[#786cff] order-1 sm:order-none self-start sm:self-auto"
            href="https://www.relayhumancloud.com/schedule-a-call"
          >
            Schedule a Call
          </a>

            <div className="flex flex-wrap gap-3 sm:mt-1 mt-4 justify-center sm:justify-end order-4 sm:order-none self-start sm:self-auto">
              {[
                ["https://x.com/relayhumancloud", "twitter.png"],
                ["https://www.facebook.com/RelayHumanCloud1/", "facebook.png"],
                ["https://www.linkedin.com/company/relayhumancloud/", "linkedin.png"],
                ["https://www.youtube.com/channel/UCSur5TFAU__2xFjigHlY_9A", "youtube.png"],
                ["https://www.instagram.com/relayhumancloud/", "instagram.png"],
                ["tel:+12144673529", "Phone.png"],
                ["mailto:info@relayhumancloud.com", "Mail.png"],
              ].map(([link, icon], i) => (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`https://www.relayhumancloud.com/wp-content/uploads/2025/06/${icon}`}
                    alt=""
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>
           <div className="mt-2 order-2 sm:order-none self-start sm:self-auto">
            <img
              src="https://www.relayhumancloud.com/wp-content/uploads/2025/06/soc-image.png"
              alt="SOC 2 Verified"
              className="w-[160px] mx-auto sm:mx-0"
            />
          </div>

          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center mt-10 pt-5 sm:border-t sm:border-white/20 text-sm text-[#d5d5ff] gap-4 text-center">

          <p className="sm:order-none order-2">© 2025 Relay Human Cloud. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4 justify-center">

            <a href="https://www.relayhumancloud.com/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="https://www.relayhumancloud.com/onlineterms" className="hover:underline">
              Terms & Conditions
            </a>
            <a href="https://www.relayhumancloud.com/onlineterms-uk" className="hover:underline">
              Terms and Conditions (UK)
            </a>
            <a href="https://www.relayhumancloud.com/software-online-terms" className="hover:underline">
              Software Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
