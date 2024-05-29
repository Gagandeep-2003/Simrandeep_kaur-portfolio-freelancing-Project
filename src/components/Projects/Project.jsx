import React from 'react';
// import { SlPaperPlane } from "react-icons/sl";
import { data } from "../../data/work-data"; 
import "./Projects.css";

const Project = ({ title }) => (
  <div className="page14-inner">
    <h1>{title}</h1>
    {/* <SlPaperPlane className="i" /> */}
    <div className="center14"></div>
  </div>
);

const ProjectList = () => {
  return (
  <>
      <h2 className="heading-text">
        Projects
      </h2>
    <div id="page14">
      {data.map((project) => (
        <Project
          key={project.id}
          title={project.title}
        />
      ))}
    </div>
  </>
  );
};

export default ProjectList;
