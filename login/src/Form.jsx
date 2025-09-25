import { useState, useEffect } from "react";
import DCC_Logo from "./assets/DCC_Logo.png";
import "./NewForm.css";

function Form() {
  const today = new Date().toISOString().split("T")[0];

  const [info, setInfo] = useState({
    facility: "",
    readingType: "",
    date: today,
    genReading: {},
    tankReadings: {},
    program: "",
    time: "",
    comments: "",
  });

  // inside component
  useEffect(() => {
    if (info.facility) {
      const savedGen = JSON.parse(
        localStorage.getItem(`genReading_${info.facility}`) || "{}"
      );
      const savedTank = JSON.parse(
        localStorage.getItem(`tankReadings_${info.facility}`) || "{}"
      );

      setInfo((prev) => ({
        ...prev,
        genReading: savedGen,
        tankReadings: savedTank,
      }));
    }
  }, [info.facility]);

  useEffect(() => {
    if (info.facility) {
      localStorage.setItem(
        `genReading_${info.facility}`,
        JSON.stringify(info.genReading)
      );
    }
  }, [info.genReading, info.facility]);

  useEffect(() => {
    if (info.facility) {
      localStorage.setItem(
        `tankReadings_${info.facility}`,
        JSON.stringify(info.tankReadings)
      );
    }
  }, [info.tankReadings, info.facility]);

  const facilityGenTypes = {
    A3C: ["C15-1000KVA", "C18-500KVA", "C15-500KVA", "250KVA", "60KVA"],
    "Annex 2": ["C15-500KVA", "100KVA"],
    "71 Kudirat": ["350KVA", "100KVA"],
  };
  const facilityTanks = {
    A3C: ["Tank-1", "Tank-2", "Dump-1", "Dump-2"],
    "Annex 2": ["Tank-1", "Tank-2"],
    "71 Kudirat": ["Tank-1"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formattedDate = "";
    if (info.date) {
      const d = new Date(info.date);
      formattedDate = d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    //for excel script
    // const payload = {
    //   facility: info.facility,
    //   readingType: info.readingType,
    //   date: formattedDate,
    //   genReading: info.genReading,
    //   tankReadings: info.tankReadings,
    //   program: info.program,
    //   time: info.time,
    //   comments: info.comments,
    // };

    // ✅ Send to Google Sheets
    // await fetch(
    //   "https://script.google.com/macros/s/AKfycbwOb5jQZOo7bXJhGN8JiX77Ts4jw4ZHHquTXUi0EYdIul9g6BNYPYLcYNDcywxLPug2-g/exec",
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   }
    // );

    // ✅ Send to WhatsApp
    const genData = Object.entries(info.genReading)
      .map(([gen, val]) => `${gen}: ${val}hrs`)
      .join("%0A%0A");

    const tankValues = Object.values(info.tankReadings).map(Number);
    const tankData = Object.entries(info.tankReadings)
      .map(([tank, val]) => `${tank}: ${val}litres`)
      .join("%0A%0A");
    const totalLitres = tankValues.reduce(
      (sum, v) => sum + (isNaN(v) ? 0 : v),
      0
    );

    const timeLabel =
      info.readingType === "Opening Reading" ? "Setup time" : "Shutdown time";

    let formattedTime = info.time
      ? new Date(`1970-01-01T${info.time}:00`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

    const message =
      `*${info.readingType}* (${info.facility} facility)%0A%0A` +
      `*Date:* ${formattedDate}%0A%0A` +
      `*Gen Reading*%0A${genData || "N/A"}%0A%0A` +
      `*Diesel Reading*%0A${tankData || "N/A"}%0A%0A` +
      `*Total:* ${totalLitres}ltrs%0A%0A` +
      `*Programs:* ${info.program || "N/A"}%0A%0A` +
      `*${timeLabel}:* ${formattedTime}%0A%0A` +
      `*Comments:* ${info.comments || "None"}`;

    const phoneNumber = "2348036218977";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

    // Reset form except readings
    setInfo((prev) => ({
      ...prev,
      facility: "",
      readingType: "",
      date: today,
      program: "",
      time: "",
      comments: "",
    }));
  };

  return (
    <div className="dcc-container">
      <header className="dcc-header">
        <img src={DCC_Logo} alt="DCC Estates Limited" className="dcc-logo" />
        <h1 className="dcc-title">DCC Estates Limited</h1>
      </header>

      <form className="dcc-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Facility</legend>
          <select
            name="facility"
            onChange={handleChange}
            value={info.facility}
            required
          >
            <option value=""> --select a facility-- </option>
            <option value="A3C">A3C</option>
            <option value="Annex 2">Annex 2</option>
            <option value="71 Kudirat">71 Kudirat</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Reading Type</legend>
          <select
            name="readingType"
            onChange={handleChange}
            value={info.readingType}
            required
          >
            <option value=""> --select a reading-- </option>
            <option value="Opening Reading">Opening Reading</option>
            <option value="Closing Reading">Closing Reading</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Date</legend>
          <input
            type="date"
            onChange={handleChange}
            name="date"
            value={info.date}
          />
        </fieldset>

        {info.facility && (
          <fieldset>
            <legend>Gen Readings</legend>
            {facilityGenTypes[info.facility].map((gen) => (
              <div key={gen}>
                <label>{gen}</label>
                <input
                  type="number"
                  placeholder={`Reading for ${gen}`}
                  value={info.genReading[gen] || ""}
                  onChange={(e) =>
                    setInfo((prev) => ({
                      ...prev,
                      genReading: {
                        ...prev.genReading,
                        [gen]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
          </fieldset>
        )}

        {info.facility && (
          <fieldset>
            <legend>Diesel Tanks</legend>
            {facilityTanks[info.facility].map((tank) => (
              <div key={tank}>
                <label>{tank}</label>
                <input
                  type="number"
                  placeholder={`Reading for ${tank}`}
                  value={info.tankReadings[tank] || ""}
                  onChange={(e) =>
                    setInfo((prev) => ({
                      ...prev,
                      tankReadings: {
                        ...prev.tankReadings,
                        [tank]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
          </fieldset>
        )}

        <fieldset>
          <legend>Program</legend>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Program"
            name="program"
            value={info.program}
          />
        </fieldset>

        <fieldset>
          <legend>Time</legend>
          <input
            type="time"
            onChange={handleChange}
            name="time"
            value={info.time}
          />
        </fieldset>

        <fieldset>
          <legend>Comment</legend>
          <textarea
            onChange={handleChange}
            placeholder="Comments"
            name="comments"
            value={info.comments}
          />
        </fieldset>

        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </div>
  );
}

export default Form;
