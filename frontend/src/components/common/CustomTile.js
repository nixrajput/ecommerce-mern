const CustomTile = ({ icon, leading, trailing }) => {
  return (
    <div className="custom-item-tile">
      {icon && <div className="icon">{icon}</div>}

      <div className="leading">{leading}</div>

      <div className="trailing">{trailing}</div>
    </div>
  );
};

export default CustomTile;
