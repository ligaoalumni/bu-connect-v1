import Link from "next/link";
import { Iconify } from "./iconify";

export const Footer = () => {
  return (
    <footer className="mx-auto container mb-10  ">
      <div className="flex flex-col md:flex-row justify-center items-center min-h-[450px] md:min-h-[324px]  relative py-14">
        <div className="h-full w-full absolute bg-no-repeat bg-right z-10 bg-[url('/images/bu-torch.png')]" />
        <div className="px-5 md:px-10 bg-[#15406ADD] p-5 h-full w-full absolute z-20 flex flex-col md:flex-row gap-y-10 md:gap-y-0 md:justify-between md:items-center">
          <div className="space-y-2 ">
            <p className="  text-lg text-white md:max-w-[500px]">
              BUConnect aims to build a stronger, more cohesive community by
              providing easy access to university news, updates, and resources,
              while creating opportunities for collaboration and networking
              across various departments and alumni networks.
            </p>
            <div className="  gap-3 hidden md:flex">
              <Socials />
            </div>
          </div>
          <div className="">
            <h3 className="text-3xl text-white md:min-w-[300px]">
              Get in touch
            </h3>
            <div className="space-y-3 mt-3">
              <div className="flex gap-2 ">
                <Iconify
                  className="text-white"
                  height={24}
                  width={24}
                  icon="tabler:mail-filled"
                />
                <p className="text-white">alumni@gmail.com</p>
              </div>
              <div className="flex gap-2">
                <Iconify
                  height={24}
                  width={24}
                  className="text-white"
                  icon="mingcute:phone-fill"
                />
                <p className="text-white">+1 (555) 000-0000</p>
              </div>
              <div className="flex gap-2">
                <Iconify
                  height={24}
                  width={24}
                  className="text-white"
                  icon="fluent:location-12-filled"
                />
                <p className="text-white">Polangui, Albay</p>
              </div>
            </div>
            <div className="mt-5  gap-3 md:hidden flex">
              <Socials />
            </div>
          </div>
        </div>
        <p className="z-30 bottom-2 md:bottom-5 text-white absolute">
          &copy; {new Date().getFullYear()} BUConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
  // return publicRoutes.includes(path) || show ? (
  // 	<footer id="about-us" className="bg-[#313131] py-14">
  // 		<div className="container space-y-4 mx-auto py-5">
  // 			<div className="grid mb-14 grid-cols-2 px-5 sm:px-0 sm:grid-cols-2 md:grid-cols-4 gap-5">
  // 				<div className="flex justify-center items-start">
  // 					<Link href="/" className="mr-6  flex items-center space-x-2">
  // 						<Image src="/icon.svg" height={100} width={100} alt="LNHS Logo" />
  // 					</Link>
  // 				</div>
  // 				<div className="space-y-3  ">
  // 					<h3 className="text-white font-semibold">Strand</h3>
  // 					<ul className="  flex flex-col gap-3">
  // 						<Link href="#">
  // 							<li className="text-white text-xs">STEM</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">ABM</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">HUMSS</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">TVL</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">A&D</li>
  // 						</Link>
  // 					</ul>
  // 				</div>
  // 				<div className="space-y-3">
  // 					<h3 className="text-white font-semibold">Resources</h3>
  // 					<ul className="  flex flex-col gap-3">
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Smart Classes</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Library</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Sports</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Auditorium and Halls</li>
  // 						</Link>
  // 					</ul>
  // 				</div>

  // 				<div className="space-y-3">
  // 					<h3 className="text-white font-semibold">About Us</h3>
  // 					<ul className="  flex flex-col gap-3">
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Contact</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Help/Support</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">FAQ</li>
  // 						</Link>
  // 						<Link href="#">
  // 							<li className="text-white text-xs">Terms and Conditions</li>
  // 						</Link>
  // 					</ul>
  // 				</div>
  // 			</div>
  // 			<Separator className="" />
  // 			<div className="flex flex-col px-5 md:px-0 justify-center md:flex-row  gap-2 items-center md:justify-between">
  // 				<div className="flex gap-5">
  // 					<p className="text-white">&copy; 2025 LNHS</p>
  // 					<Link className="text-white underline text-sm" href="#">
  // 						Privacy Policy
  // 					</Link>
  // 					<Link className="text-white underline text-sm" href="#">
  // 						Terms of Service
  // 					</Link>
  // 				</div>

  // 				<div className="flex gap-5">
  // 					<Link href="#">
  // 						<IconBrandFacebookFilled size={24} color="#fff" />
  // 					</Link>
  // 					<Link href="#">
  // 						<IconBrandInstagram size={24} color="#fff" />
  // 					</Link>
  // 					<Link href="#">
  // 						<IconBrandTwitterFilled size={24} color="#fff" />
  // 					</Link>
  // 					<Link href="#">
  // 						<IconBrandLinkedinFilled size={24} color="#fff" />
  // 					</Link>
  // 				</div>
  // 			</div>
  // 		</div>
  // 	</footer>
  // ) : null;
};

export const Socials = () => (
  <div className="flex gap-5">
    <Link className="" href="#">
      <Iconify icon="logos:facebook" width="32" height="32" />
    </Link>
    <Link className="" href="#">
      <Iconify icon="skill-icons:instagram" width="32" height="32" />
    </Link>
    <Link className="" href="#">
      <Iconify icon="skill-icons:linkedin" width="32" height="32" />
    </Link>
    <Link className="" href="#">
      <Iconify icon="flat-color-icons:google" width="32" height="32" />
    </Link>
  </div>
);
