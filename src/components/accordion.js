import React, { useEffect, useState } from "react";

const Accordion = ({ subjects }) => {

  const [getSubjects, setSubjects] = useState(subjects);

  const handleAccordion = (sub) => {
    const accordion = [...getSubjects];
    accordion.map(accord => {
      if(accord.id === sub.id){
        accord.isActive == "active" ? accord.isActive = "" : accord.isActive = "active";
      }else{
        accord.isActive = "";
      }
    })
    setSubjects(accordion);
  }

  return (
    <>
      {
        getSubjects.length > 0 && 
        getSubjects.map((subject, key) => (
          <div className={`accordion-item ${subject.isActive ? subject.isActive : ''}`} key={key}>
            <div
              className="accordion-title"
              onClick={() => handleAccordion(subject)}
            >
              <div>
                {subject.name}
                <span>{subject.isActive ? "-" : "+"}</span>
              </div>
            </div>

            {subject?.isActive && (
              <>
                <div className="accordion-content">
                  <ul>
                    {subject?.topics.length ? (
                      subject.topics.map((topic, key) => (
                        <li key={key}>{topic.name}</li>
                      ))
                    ) : (
                      <li> No topics found</li>
                    )}
                  </ul>
                </div>
              </>
            )}

          </div>
        ))
      }
    </>
  );
};

export default Accordion;
