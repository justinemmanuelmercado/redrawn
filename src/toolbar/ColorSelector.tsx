const ColorSelector = ({ strokeColor, fillColor }: { strokeColor: string, fillColor: string }) => {
  return (
    <div className="relative">
      <div
        className="absolute w-12 h-12 rounded-full border-8 border-black"
        style={{ borderColor: strokeColor }}
      ></div>
      <div
        className="w-12 h-12 ml-3 mt-3 rounded-full"
        style={{ backgroundColor: fillColor }}
      ></div>
    </div>
  );
};

export default ColorSelector;
