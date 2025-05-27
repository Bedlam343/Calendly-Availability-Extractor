const Title = () => {
  return (
    <div className="relative flex justify-center pointer-events-none">
      <p className="text-4xl text-center text-stone-100 font-mono">
        Calendly Schedule Extractor
      </p>
      <div className="animate-reveal-left absolute top-0  pb-4">
        <p
          className="text-4xl text-transparent underline decoration-2 
            underline-offset-4 decoration-purple-400 decoration-wavy
            font-mono"
        >
          Calendly Schedule Extractor
        </p>
      </div>
    </div>
  );
};

export default Title;
