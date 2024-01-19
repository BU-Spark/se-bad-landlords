export default function Footer() {
    return (
        <footer className="bg-[#021C66] h-72 flex px-8 text-white font-['Lora'] text-sm">
            {/* logo */}
            <div className="flex items-center justify-center flex-[0_0_25%] md:flex-[0_0_15%]">
                <img src="/footer-logo.png" alt="Logo" className="bg-white rounded-full lg:w-2/3 2xl:w-1/2" />
            </div>

            {/* content */}
            <div className="hidden md:flex items-center pl-9 pr-28 flex-[0_0_60%]">
                Councilor Breadon's mission to increase accessibility and transparency in the Boston planning 
                and development process aligns with our goals of promoting accountability and responsibility 
                among property owners and landlords. Through our website, you can access up-to-date information 
                on property violations, learn about your rights as a tenant, 
                and join us in advocating for a fair and just housing system in Boston. 
                Join our community today and help us make Boston a better place to live for all residents.
            </div>

            {/* socials and about */}
            <div className="flex items-center justify-around flex-[0_0_75%] md:flex-[0_0_25%]">
                <div>
                    <h3 className="font-bold mb-7">About</h3>
                    <button className="block mb-7">Privacy & Policy</button>
                    <button className="block mb-7">Terms & Condition</button>
                    <button className="block">Sitemap</button>
                </div>
                <div>
                    <h3 className="font-bold mb-6">Socials</h3>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="block mb-6">
                        <img src="/linkedln.svg" alt="LinkedIn" />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="block mb-6">
                        <img src="/twitter.svg" alt="Twitter" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="block">
                        <img src="/instagram.svg" alt="Instagram" />
                    </a>
                </div>
            </div>
        </footer>
    );
}