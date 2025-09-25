import { useState } from "react";

function Dropdown() {
  const [pick, setPick] = useState("");

  const handleChange = (e) => {
    setPick(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={pick} onChange={handleChange} required>
          <option>--select a reading</option>
          <option>Opening Reading</option>
          <option>Closing Reading</option>
        </select>
      </form>
    </div>
  );
}

export default Dropdown;
