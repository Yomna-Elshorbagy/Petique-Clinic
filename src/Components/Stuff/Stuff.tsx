import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { RxTwitterLogo } from "react-icons/rx";
import stuff1 from "../../assets/images/stuff1.avif";
import stuff2 from "../../assets/images/stuff2.avif";
import stuff3 from "../../assets/images/stuff3.jpg";

const members = [
  {
    id: 1,
    name: "Sophia Lee",
    role: "Veterinary Doctor",
    image: stuff1,
  },
  {
    id: 2,
    name: "Nicholas Gomes",
    role: "Veterinary Doctor",
    image: stuff2,
  },
  {
    id: 3,
    name: "Emily Clark",
    role: "Pet Groomer",
    image: stuff3,
  },
];

export default function Stuff() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <p className="text-(--color-light-accent) font-bold flex justify-center items-center gap-2 mb-2 text-2xl">
          Our Specialists <span>🐾</span>
        </p>
        <h2 className="text-4xl font-bold text-(--color-light-dark)">
          Meet Our Experienced Pet Care Team
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
        {members.map((member) => (
          <div key={member.id} className="relative group rounded-xl overflow-hidden shadow-lg">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-4 flex flex-col gap-2 transition-all duration-300 group-hover:translate-y-0 translate-y-full">
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-sm">{member.role}</p>
              <div className="flex gap-3 mt-2">
                <FaFacebookF className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <RxTwitterLogo className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <FaInstagram className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
                <FaLinkedin className="w-6 h-6 cursor-pointer hover:text-(--color-light-accent)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}