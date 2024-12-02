import React, { useState } from "react";
import { supabase } from "./supabaseClient"; // Import Supabase client

const ContentManagement: React.FC = () => {
  const [year, setYear] = useState<string>("");
  const [degree, setDegree] = useState<string>("");
  const [specialisation, setSpecialisation] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>("Subject");
  const [resourceType, setResourceType] = useState<string>("");
  const [fileUrls, setFileUrls] = useState<string>(""); // State for file URLs input
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false); // Success alert state

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

  // Generates tags based on selected parameters
  const generateTags = () => {
    return [year, degree, subject, resourceType].filter(Boolean);
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while processing

    try {
      // Split the file URLs input into an array
      const urls = fileUrls.split(",").map((url) => url.trim());

      // Ensure that subject or elective are set to 'None' if empty
      const subjectColumn = subject || "None";
      const electiveColumn = subjectType === "Elective/Language" ? subject : "None";

      // Ensure specialisation is set to 'None' if not selected
      const specialisationColumn = specialisation || "None";

      const tags = generateTags(); // Generate tags for the resource

      const { data, error } = await supabase.from("resources").insert({
        title,
        description,
        year,
        degree,
        specialisation: specialisationColumn,
        subject: subjectType === "Subject" ? subjectColumn : null,
        elective: subjectType === "Elective/Language" ? electiveColumn : null,
        tags, // Tags should be stored as an array
        resource_type: resourceType,
        file_urls: urls, // File URLs should be stored as an array
      });

      if (error) {
        console.error("Database insert failed:", error.message); // Handle database error
        throw new Error(error.message);
      }

      console.log("Resource added:", data); // Log successful upload

      // Show success modal
      setShowSuccessAlert(true);
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`); // Show error message
    } finally {
      setLoading(false); // Set loading to false after processing
    }
  };

  // Close the success modal when the user clicks "OK"
  const handleModalClose = () => {
    setShowSuccessAlert(false);
    // Reset the form fields
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
      {/* Main form */}
      <h3 className="mb-4">Add New Resource</h3>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        {/* Row with Year, Degree, Specialisation, and Resource Type */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="year" className="form-label">
              Year
            </label>
            <select
              id="year"
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              disabled={!degree}
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

        {/* Subject and Subject Type Fields */}
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

        {/* File URLs and Title */}
        <div className="mb-3">
          <label htmlFor="fileUrls" className="form-label">
            Enter File URLs (comma-separated)
          </label>
          <input
            type="text"
            id="fileUrls"
            className="form-control"
            value={fileUrls}
            onChange={(e) => setFileUrls(e.target.value)}
            placeholder="Enter File URLs"
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
            placeholder="Enter Title"
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
            placeholder="Enter Description"
            rows={3}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessAlert && (
        <div
          className="modal fade show"
          tabIndex={-1}
          style={{ display: "block" }}
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="successModalLabel">
                  Success!
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose} // Close modal when clicked
                />
              </div>
              <div className="modal-body">
                Your resource has been successfully added.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-dark"
                  data-bs-dismiss="modal"
                  onClick={handleModalClose} // Close modal when clicked
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
