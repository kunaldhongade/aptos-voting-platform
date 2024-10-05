import HomeImage from "@/assets/placeholders/home.png";

const Hero = () => {
  return (
    <section className="our-story-container px-4 flex flex-col md:flex-row gap-6 max-w-screen-xl mx-auto w-full items-center">
      <div className="w-full ">
        <img src={HomeImage} alt="Scholarship students" className="w-full h-auto object-cover rounded-lg shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;
