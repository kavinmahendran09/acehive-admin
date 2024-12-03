import React, { useState } from "react";
import { supabase } from "./supabaseClient"; // Import Supabase client

const ContentManagement: React.FC = () => {
  const [year, setYear] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [specialisation, setSpecialisation] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>("Subject");
  const [resourceType, setResourceType] = useState<string>("");
  const [fileUrls, setFileUrls] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility state

  // Specialisation options based on the degree selected
  const specialisationOptions =
    degree === "Computer Science"
      ? [
          "Core",
          "Data Science",
          "Information Technology",
          "Artificial Intelligence",
          "Cloud Computing",
          "Cyber Security",
          "Computer Networking",
          "Gaming Technology",
          "Artificial Intelligence and Machine Learning",
          "Business Systems",
          "Big Data Analytics",
          "Block Chain Technology",
          "Software Engineering",
          "Internet of Things",
        ]
      : degree === "Biotechnology"
      ? [
          "Biotechnology Core",
          "Biotechnology (Computational Biology)",
          "Biotechnology W/S in Food Technology",
          "Biotechnology W/S in Genetic Engineering",
          "Biotechnology W/S in Regenerative Medicine",
        ]
      : degree === "Electrical"
      ? ["Electrical & Electronics Engineering", "Electric Vehicle Technology"]
      : degree === "Civil"
      ? ["Civil Engineering Core", "Civil Engineering with Computer Applications"]
      : degree === "ECE"
      ? [
          "ECE (Electronics and Communication Engineering)",
          "Electronics & Communication Engineering",
          "Cyber Physical Systems",
          "Data Sciences",
          "Electronics and Computer Engineering",
          "VLSI Design and Technology",
        ]
      : degree === "Automobile"
      ? ["Core", "Automotive Electronics", "Vehicle Testing"]
      : degree === "Mechanical"
      ? [
          "Core",
          "Automation and Robotics",
          "AIML (Artificial Intelligence and Machine Learning)",
          "Mechatronics Engineering Core",
          "Autonomous Driving Technology",
          "Immersive Technologies",
          "Industrial IoT",
          "Robotics",
        ]
      : [];

  const generateTags = () => {
    return [year, degree, subject, resourceType].filter(Boolean);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);

    if (selectedYear === "1st Year") {
      setDegree("");
      setSpecialisation("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const urls = fileUrls.split(",").map((url) => url.trim());
      const subjectColumn = subject || "None";
      const electiveColumn = subjectType === "Elective/Language" ? subject : "None";
      const degreeColumn = year === "1st Year" ? "None" : degree || "None";
      const specialisationColumn = year === "1st Year" ? "None" : specialisation || "None";
      const tags = generateTags();

      const { error } = await supabase.from("resources").insert({
        title,
        description,
        year,
        degree: degreeColumn,
        specialisation: specialisationColumn,
        subject: subjectType === "Subject" ? subjectColumn : null,
        elective: subjectType === "Elective/Language" ? electiveColumn : null,
        tags,
        resource_type: resourceType,
        file_urls: urls,
      });

      if (error) throw new Error(error.message);

      setShowModal(true);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setYear("");
    setDegree("");
    setSpecialisation("");
    setSubject("");
    setSubjectType("Subject");
    setResourceType("");
    setFileUrls("");
    setTitle("");
    setDescription("");
  };

  return (
    <div className="mt-5">
      <h3 className="mb-4">Add New Resource</h3>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="year" className="form-label">
              Year
            </label>
            <select
              id="year"
              className="form-select"
              value={year}
              onChange={handleYearChange}
              required
            >
              <option value="">Select Year</option>
              {["1st Year", "2nd Year", "3rd Year"].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="degree" className="form-label">
              Degree
            </label>
            <select
              id="degree"
              className="form-select"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              disabled={year === "1st Year"}
              required
            >
              <option value="">Select Degree</option>
              {[
                "Computer Science",
                "Biotechnology",
                "Electrical",
                "Civil",
                "ECE",
                "Automobile",
                "Mechanical",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="specialisation" className="form-label">
              Specialisation
            </label>
            <select
              id="specialisation"
              className="form-select"
              value={specialisation}
              onChange={(e) => setSpecialisation(e.target.value)}
              disabled={year === "1st Year"}
              required
            >
              <option value="">Select Specialisation</option>
              {specialisationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="resourceType" className="form-label">
              Resource Type
            </label>
            <select
              id="resourceType"
              className="form-select"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              required
            >
              <option value="">Select Resource Type</option>
              {["CT Paper", "Sem Paper", "Study Material"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter Subject"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="subjectType" className="form-label">
              Subject Type
            </label>
            <select
              id="subjectType"
              className="form-select"
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value)}
            >
              <option value="Subject">Subject</option>
              <option value="Elective/Language">Elective/Language</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="fileUrls" className="form-label">
            File URLs (comma-separated)
          </label>
          <input
            type="text"
            id="fileUrls"
            className="form-control"
            value={fileUrls}
            onChange={(e) => setFileUrls(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {/* Bootstrap Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : "d-none"}`}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="successModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="successModal">
                Success!
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleModalClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{color:"green"}}>Resource added successfully!</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleModalClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
