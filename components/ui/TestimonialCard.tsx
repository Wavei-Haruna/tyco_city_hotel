import Image, { StaticImageData } from "next/image";
import { testimonialImages } from "@/assets/testimonial/_testimonials";
import React from "react";

interface TestimonialCardProps {
  image: string | StaticImageData;
  name: string;
  designation: string;
  testimonial: string;
  bgName: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  image,
  name,
  designation,
  testimonial,
  bgName,
}) => {
  return (
    <div className="relative font-poppins flex bg-white shadow-lg px-6 items-center max-w-2xl overflow-hidden border border-gray-200 min-h-[430px]">
      {/* Background Name */}
      <h1 className="absolute text-[8rem] font-bold text-gray-200 opacity-20 -top-10 left-6 uppercase">
        {bgName}
      </h1>

      {/* Image Section */}
      <div className="relative">
        <Image
          src={image}
          alt={name}

          className="relative bottom-0 grayscale"
        />
      </div>

      {/* Text Section */}
      <div className="w-2/3 pl-6">
        {/* Quote */}
        <Image
          src={testimonialImages.quotation}
          alt=""
          width={28}
          height={28}
          className="h-7 mb-2"
        />

        <p className="_paragraph italic">{testimonial}</p>

        {/* Name & Designation */}
        <p className="font-bold text-lg mt-4">{name}</p>
        <p className="text-sm text-gray-600">{designation}</p>
      </div>

      {/* Glow Effect */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary opacity-70 rounded-full blur-2xl"></div>
    </div>
  );
};

export default TestimonialCard;
